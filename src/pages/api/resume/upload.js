// import fs from "fs";
// import path from "path";
// import formidable from "formidable";
// import { connectDB } from "@/lib/db";
// import Resume from "@/models/Resume";

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

// export default async function handler(req, res) {
//     if (req.method !== "POST") {
//         return res.status(405).json({ message: "Method not allowed" });
//     }

//     try {
//         await connectDB();

//         // UPLOAD RESUME by making 'uploads' folder in the project root     
//         const uploadDir = path.join(process.cwd(), "uploads");
//         if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

//         // Formidable in easy words is a library to handle file uploads in Node.js
//         // (It only stores the file and gives you its path)
//         const form = formidable({
//             uploadDir,
//             keepExtensions: true,
//             multiples: false,
//             maxFileSize: 10 * 1024 * 1024, // 10MB limit
//         });
//         // form.parse is a method in the formidable library that is used to parse(it is a function that extracts data from a form)
//         // incoming form data, including file uploads, from an HTTP request.
//         const [fields, files] = await form.parse(req);
//         const file = files.resume?.[0];

//         if (!file || !file.filepath) {
//             return res.status(400).json({ message: "No file uploaded" });
//         }

//         // fs.readFileSync, Goes to the file location, Reads the file content, Loads it into memory
//         const buffer = fs.readFileSync(file.filepath);
//         // Takes binary data, Decodes it into readable text, Now JS can process it
//         const text = buffer.toString("utf-8");

//         // ✅ SAVE TO MONGODB
//         const savedResume = await Resume.create({
//             userId: fields.userId,
//             filename: file.originalFilename,
//             text,
//         });

//         // resumeId going to ResumeUpload.js to setResumeId and to dashboard for selecting options
//         return res.status(200).json({
//             success: true,
//             resumeId: savedResume._id,
//         });

//     } catch (error) {
//         console.error("UPLOAD ERROR:", error);
//         return res.status(500).json({ message: "Server error" });
//     }
// }



// pages/api/upload-resume.js
import fs from "fs";
import path from "path";
import formidable from "formidable";
import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";

/**
 * API Route: /api/upload-resume
 * Purpose: Handle resume file uploads, extract text content, and store in MongoDB
 * Supported file types: PDF, TXT, DOC, DOCX (with basic text extraction)
 */

// Next.js API configuration - disable built-in body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parser to use formidable for file uploads
  },
};

/**
 * Main API handler function
 * @param {object} req - HTTP request object
 * @param {object} res - HTTP response object
 */
import { getAuth } from "@clerk/nextjs/server";


export default async function handler(req, res) {
  // Only allow POST requests for file uploads
  if (req.method !== "POST") {
    return res.status(405).json({ 
      success: false, 
      message: "Method not allowed. Use POST for file uploads." 
    });
  }

  let tempFilePath = null; // Track temporary file path for cleanup
  let connectionEstablished = false; // Track database connection status

  try {
    // ================================
    // 1. ESTABLISH DATABASE CONNECTION
    // ================================


   const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "You must be logged in to upload a resume" 
      });
    }

    console.log("📊 Connecting to database...");
    await connectDB();
    connectionEstablished = true;
    console.log("✅ Database connected successfully");

    // ================================
    // 2. SETUP UPLOAD DIRECTORY
    // ================================
    const uploadDir = path.join(process.cwd(), "uploads");
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      console.log(`📁 Creating upload directory: ${uploadDir}`);
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // ================================
    // 3. CONFIGURE FORMIDABLE FOR FILE UPLOAD
    // ================================
    console.log("📤 Configuring file upload...");
    const form = formidable({
      uploadDir,                    // Directory to store uploaded files temporarily
      keepExtensions: true,         // Keep original file extensions
      multiples: false,             // Allow only single file upload per request
      maxFileSize: 10 * 1024 * 1024, // Limit file size to 10MB (adjust as needed)
      maxFields: 5,                 // Limit number of form fields
      maxFieldsSize: 1024 * 1024,   // Limit total size of form fields (1MB)
      
      // Security: Filter potentially dangerous files
      filter: ({ name, originalFilename, mimetype }) => {
        console.log(`🔍 Validating file: ${originalFilename}, Type: ${mimetype}`);
        
        // Only allow specific file types
        const allowedMimeTypes = [
          "application/pdf",                          // PDF files
          "text/plain",                               // Text files
          "application/msword",                       // DOC files
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // DOCX files
        ];

        const isAllowed = allowedMimeTypes.includes(mimetype);
        if (!isAllowed) {
          console.warn(`⚠️ Rejected file type: ${mimetype}`);
        }
        return isAllowed;
      }
    });

    // ================================
    // 4. PARSE FORM DATA AND UPLOAD FILE
    // ================================
    console.log("🔄 Parsing form data...");
    
    // Parse the incoming form data (files + fields)
    // formidable.parse returns an array: [fields, files]
    const [fields, files] = await form.parse(req);
    
    // Extract the uploaded resume file
    const file = files.resume?.[0];
    
    // Validate that a file was uploaded
    if (!file || !file.filepath) {
      console.error("❌ No file uploaded or file parsing failed");
      return res.status(400).json({ 
        success: false,  
        message: "No file uploaded. Please select a resume file." 
      });
    }

    // Store temp file path for cleanup
    tempFilePath = file.filepath;
    console.log(`✅ File uploaded temporarily to: ${tempFilePath}`);
    console.log(`📄 File details: ${file.originalFilename}, Size: ${file.size} bytes, Type: ${file.mimetype}`);

    // ================================
    // 5. READ AND VALIDATE FILE CONTENT
    // ================================
    console.log("📖 Reading file content...");
    
    // Check if file exists and has content
    if (!fs.existsSync(file.filepath)) {
      throw new Error("Uploaded file not found on server");
    }

    const stats = fs.statSync(file.filepath);
    if (stats.size === 0) {
      throw new Error("Uploaded file is empty");
    }

   
    // ================================
    // 6. EXTRACT TEXT FROM FILE BASED ON TYPE
    // ================================
    console.log(`🔧 Extracting text from ${file.mimetype}...`);
    let extractedText = "";
    const buffer = fs.readFileSync(file.filepath);

    // DEBUG: Check what we're getting
    console.log(`📊 Buffer size: ${buffer.length} bytes`);
    console.log(`🔍 First 100 chars of buffer: ${buffer.toString('utf-8', 0, 100)}`);

    // Handle different file types
    if (file.mimetype === "application/pdf") {
      // PDF file - use pdf-parse for text extraction
      try {
        console.log("📄 Processing PDF file...");
        
        // FIX: Try different import methods for pdf-parse
        let pdfParse;
        try {
          // Method 1: Try as default export
          const pdfModule = await import('pdf-parse');
          pdfParse = pdfModule.default;
          console.log("✅ Imported pdf-parse as default export");
        } catch (importError) {
          // Method 2: Try as named export
          const pdfModule = await import('pdf-parse');
          pdfParse = pdfModule;
          console.log("✅ Imported pdf-parse as named export");
        }
        
        // Verify pdfParse is a function
        if (typeof pdfParse !== 'function') {
          throw new Error(`pdf-parse is not a function. Type: ${typeof pdfParse}`);
        }
        
        // Parse PDF and extract text
        console.log("🔄 Parsing PDF buffer...");
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text || "";
        
        console.log(`✅ PDF text extracted: ${extractedText.length} characters`);
        
        if (extractedText.length > 0) {
          console.log("📝 First 200 chars:", extractedText.substring(0, 200));
        }
        
        // Check if PDF extraction was successful
        if (!extractedText || extractedText.trim().length === 0) {
          console.warn("⚠️ PDF appears to be empty or text extraction failed");
          
          // Try alternative: Check if buffer has content
          const bufferString = buffer.toString('utf-8', 0, 1000);
          console.log("🔍 First 1000 chars of buffer:", bufferString.substring(0, 200));
          
          extractedText = "[PDF content extraction returned empty text]";
        }
        
      } catch (pdfError) {
        console.error("❌ PDF parsing error:", pdfError.message);
        console.error("❌ Error stack:", pdfError.stack);
        
        // Fallback: Try to extract text manually
        try {
          console.log("🔄 Trying manual text extraction...");
          const bufferString = buffer.toString('latin1');
          
          // Look for text patterns in PDF
          const textInParentheses = bufferString.match(/\((.*?)\)/g);
          if (textInParentheses) {
            extractedText = textInParentheses
              .map(text => text.slice(1, -1))
              .filter(text => text.length > 1)
              .join(' ');
            console.log(`✅ Manual extraction from parentheses: ${extractedText.length} chars`);
          }
          
          if (!extractedText || extractedText.length < 50) {
            // Try to extract any readable ASCII text
            const asciiText = buffer.toString('ascii', 0, Math.min(buffer.length, 10000));
            const readableWords = asciiText.match(/[A-Za-z]{3,}/g);
            if (readableWords) {
              extractedText = readableWords.join(' ');
              console.log(`✅ ASCII extraction: ${extractedText.length} chars`);
            }
          }
          
          if (!extractedText || extractedText.length < 10) {
            extractedText = `[PDF parsing failed: ${pdfError.message}]`;
          }
          
        } catch (fallbackError) {
          extractedText = `[All extraction methods failed: ${pdfError.message}]`;
        }
      }
    } else if (file.mimetype === "text/plain") {
      // Plain text file - direct UTF-8 conversion
      console.log("📝 Processing text file...");
      extractedText = buffer.toString("utf-8");
      console.log(`✅ Text file processed: ${extractedText.length} characters`);
    } else if (
      file.mimetype === "application/msword" || 
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // Word document - basic text extraction
      console.log("📘 Processing Word document...");
      
      // For DOC/DOCX files, we do basic text extraction
      // Note: For better extraction, consider using 'mammoth' library
      try {
        extractedText = buffer.toString("utf-8", 0, Math.min(buffer.length, 50000));
        
        // Clean up binary artifacts for Word docs
        extractedText = extractedText.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
        console.log(`✅ Word document processed: ${extractedText.length} characters`);
        
        if (!extractedText || extractedText.trim().length < 10) {
          extractedText = "[Word document content extraction limited. Consider using a dedicated DOCX parser for better results.]";
        }
      } catch (wordError) {
        console.error("❌ Word document processing error:", wordError.message);
        extractedText = `[Error processing Word document: ${wordError.message}]`;
      }
    } else {
      // Unsupported file type (should be caught by filter, but double-check)
      throw new Error(`Unsupported file type: ${file.mimetype}`);
    }
    // ================================
    // 7. CLEAN AND VALIDATE EXTRACTED TEXT
    // ================================
    console.log("🧹 Cleaning extracted text...");
    
    // First, check if we have actual text or just error messages
    if (extractedText.startsWith('[ERROR:') || 
        extractedText.startsWith('[PDF') || 
        extractedText.startsWith('[This PDF') ||
        extractedText.startsWith('[Could not')) {
      console.log("ℹ️ Extracted text appears to be an error message, not actual resume text");
      // Keep the error message as-is so user knows what happened
    } else if (extractedText.includes("%PDF-1.")) {
      console.error("❌ ERROR: Still getting raw PDF data!");
      extractedText = "[ERROR: PDF text extraction completely failed. Try a different PDF file.]";
    }
    
    // Only clean if we have actual text
    let cleanedText = extractedText;
    if (!cleanedText.startsWith('[')) {
      // Remove excessive whitespace and normalize
      cleanedText = extractedText
        .replace(/\s+/g, ' ')           // Replace multiple spaces with single space
        .replace(/\n\s*\n/g, '\n\n')    // Normalize line breaks
        .trim();
      
      // Limit text length to prevent MongoDB document size issues
      const maxTextLength = 100000; // 100KB max
      if (cleanedText.length > maxTextLength) {
        console.warn(`⚠️ Text truncated from ${cleanedText.length} to ${maxTextLength} characters`);
        cleanedText = cleanedText.substring(0, maxTextLength) + "... [text truncated]";
      }
      
      // Check if we have meaningful text
      if (!cleanedText || cleanedText.trim().length < 10) {
        console.warn("⚠️ Extracted text is very short or empty");
        cleanedText = "[No text content could be extracted from the file]";
      }
    }

    console.log(`✅ Text cleaned: ${cleanedText.length} characters remaining`);
    console.log(`📝 Final text to save (first 500 chars): ${cleanedText.substring(0, 500)}`);
    
    // Check if it's worth saving
    if (cleanedText.startsWith('[') && cleanedText.endsWith(']')) {
      console.warn("⚠️ Warning: Only saving error message, not actual resume text");
    }
    // ================================
    // 8. SAVE TO MONGODB
    // ================================
    console.log("💾 Saving to MongoDB...");
    
   console.log(`📦 Text content type: ${typeof cleanedText}`);
    console.log(`📦 Text starts with: ${cleanedText.substring(0, 50)}...`);
    console.log(`📦 Text ends with: ...${cleanedText.substring(Math.max(0, cleanedText.length - 50))}`);

    // Extract userId from form fields (assuming it's sent in the form)
    // Note: Your Resume model doesn't have userId field based on your schema
    // If you need userId, you should add it to the schema
    // const userId = fields.userId?.[0] || "unknown";
    
    // Create document in MongoDB using your Resume model
    const savedResume = await Resume.create({
      userId: userId,
      filename: file.originalFilename,
      text: cleanedText,
      uploadedAt: new Date(),
    });

    console.log(`✅ Saved to MongoDB with ID: ${savedResume._id}`);
    res.json({ success: true, resumeId: savedResume._id });

    // ================================
    // 9. CLEANUP TEMPORARY FILE
    // ================================
    console.log("🗑️ Cleaning up temporary file...");
    if (fs.existsSync(file.filepath)) {
      try {
        fs.unlinkSync(file.filepath);
        console.log(`✅ Temporary file deleted: ${file.filepath}`);
      } catch (cleanupError) {
        console.error("⚠️ Failed to delete temporary file:", cleanupError.message);
        // Don't fail the request if cleanup fails
      }
    }

    // ================================
    // 10. RETURN SUCCESS RESPONSE
    // ================================
    console.log("🎉 Upload process completed successfully");
    
    return res.status(200).json({
      success: true,
      message: "Resume uploaded and processed successfully",
      data: {
        resumeId: savedResume._id.toString(),
        filename: savedResume.filename,
        textLength: savedResume.text.length,
        uploadDate: savedResume.uploadedAt,
      }
    });

  } catch (error) {
    // ================================
    // ERROR HANDLING AND CLEANUP
    // ================================
    console.error("❌ UPLOAD ERROR:", error);

    // Cleanup temporary file if it exists
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
        console.log(`✅ Cleared temporary file after error: ${tempFilePath}`);
      } catch (cleanupError) {
        console.error("❌ Failed to cleanup temp file after error:", cleanupError.message);
      }
    }

    // Determine appropriate error response
    let statusCode = 500;
    let errorMessage = "An unexpected error occurred";

    // Handle specific error types
    if (error.message.includes("maxFileSize") || error.code === "LIMIT_FILE_SIZE") {
      statusCode = 413;
      errorMessage = "File too large. Maximum size is 10MB.";
    } else if (error.message.includes("Unsupported file type") || error.message.includes("Invalid file type")) {
      statusCode = 400;
      errorMessage = "Unsupported file type. Please upload PDF, TXT, DOC, or DOCX files only.";
    } else if (error.message.includes("No file uploaded")) {
      statusCode = 400;
      errorMessage = "No file was uploaded. Please select a resume file.";
    } else if (error.message.includes("empty")) {
      statusCode = 400;
      errorMessage = "Uploaded file is empty.";
    }

    // Return error response
    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
      timestamp: new Date().toISOString()
    });
  } finally {
    // Optional: Close database connection if you're managing connections manually
    // Note: Mongoose typically handles connection pooling automatically
    if (connectionEstablished) {
      console.log("🔌 Database connection maintained (pooled)");
    }
  }
}
