// src/pages/api/resume/delete.js
import { getAuth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ 
      success: false, 
      message: "Method not allowed. Use DELETE." 
    });
  }

  try {
    // Get logged-in user
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized. Please sign in." 
      });
    }

    const { resumeId } = req.body;

    if (!resumeId) {
      return res.status(400).json({ 
        success: false, 
        message: "Resume ID is required" 
      });
    }

    await connectDB();

    // Find and delete the resume, ensuring it belongs to the user
    const deletedResume = await Resume.findOneAndDelete({
      _id: resumeId,
      userId: userId // Security: only delete user's own resumes
    });

    if (!deletedResume) {
      return res.status(404).json({ 
        success: false, 
        message: "Resume not found or you don't have permission to delete it" 
      });
    }

    console.log(`Resume deleted: ${deletedResume.filename} by user ${userId}`);

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
      deletedResume: {
        id: deletedResume._id,
        filename: deletedResume.filename
      }
    });

  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}