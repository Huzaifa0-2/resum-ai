// import axios from "axios";

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   try {
//     const { message } = req.body; // Make sure frontend sends { message: ... }

//     if (!message) {
//       return res.status(400).json({ message: "Message is required" });
//     }

//     // Free-tier Gemini model
//     const model = "gemini-2.5-flash-lite";

//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         // This is the content format required by Gemini API
//         contents: [
//           {
//             parts: [{ text: message }],
//           },
//         ],
//       }
//     );

//     // Extract the AI's text reply
//     const aiReply =
//       response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

//     res.status(200).json({ reply: aiReply });
//   } catch (error) {
//     console.error("AI CHAT ERROR:", error.response?.data || error.message);
//     res.status(500).json({
//       error: error.response?.data || { message: error.message },
//     });
//   }
// }


import axios from "axios";
import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {

        // Getting logged-in user ID from Clerk
        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({
                message: "You must be logged in to chat"
            });
        }

        const { message, resumeId } = req.body;

        // console.log("Resume ID in chat APIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII:", resumeId);
        console.log("User IDDDDDDDDDDD:", userId, "Resume IDDDDDDDDDD:", resumeId);


        if (!message || !resumeId) {
            return res.status(400).json({
                message: "Message and resumeId are required",
            });
        }

        // Connect DB
        await connectDB();


        // Getting resume AND verify it belongs to this user
        const resume = await Resume.findOne({
            _id: resumeId,   // Find by unique document ID
            userId: userId,  // SECURITY CHECK: Resume must belong to this user
        });

        // Get resume from MongoDB
        // const resume = await Resume.findById(resumeId);

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        console.log("Resume text in chat APIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII:", resume.text);

        // Combine resume + question
        const prompt = `You are a career assistant. Here is the user's resume:
    -------------------------${resume.text}-------------------------
    User question:${message}Answer clearly and concisely.`;

        // FREE Gemini model 
        const model = "gemini-2.5-flash-lite";

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [{ text: prompt }],
                    },
                ],
            }
        );

        const aiReply =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        res.status(200).json({ reply: aiReply });
    } catch (error) {
        console.error("AI CHAT ERROR:", error.response?.data || error.message);
        res.status(500).json({
            error: error.response?.data || { message: error.message },
        });
    }
}
