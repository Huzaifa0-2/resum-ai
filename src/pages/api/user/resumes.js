// import { getAuth } from "@clerk/nextjs/server";
// import { connectDB } from "@/lib/db";
// import Resume from "@/models/Resume";

// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   try {
//     const { userId } = getAuth(req);
    
//     if (!userId) {
//       return res.status(401).json({ 
//         success: false, 
//         message: "Unauthorized" 
//       });
//     }

//     await connectDB();

//     const resumes = await Resume.find({ userId })
//       .sort({ uploadedAt: -1 })
//       .select("filename uploadedAt");

//     return res.status(200).json({
//       success: true,
//       resumes,
//     });

//   } catch (error) {
//     console.error("Get resumes error:", error);
//     return res.status(500).json({ 
//       success: false, 
//       message: "Server error" 
//     });
//   }
// }


// src/pages/api/user/resumes.js
import { getAuth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";

export default async function handler(req, res) {
  // Set content type to JSON
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method !== "GET") {
    return res.status(405).json({ 
      success: false, 
      message: "Method not allowed" 
    });
  }

  try {
    console.log("=== Resumes API Called ===");
    
    // Get auth
    const { userId } = getAuth(req);
    console.log("Auth result - User ID:", userId);
    
    if (!userId) {
      console.log("No user ID, returning 401");
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized - Please sign in" 
      });
    }

    console.log("Connecting to DB...");
    await connectDB();
    console.log("DB connected");

    // Find resumes
    const resumes = await Resume.find({ userId })
      .sort({ uploadedAt: -1 })
      .select("filename uploadedAt _id");
    
    console.log(`Found ${resumes.length} resumes`);

    return res.status(200).json({
      success: true,
      resumes: resumes.map(r => ({
        _id: r._id,
        filename: r.filename,
        uploadedAt: r.uploadedAt,
      })),
      count: resumes.length
    });

  } catch (error) {
    console.error("=== RESUMES API ERROR ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}