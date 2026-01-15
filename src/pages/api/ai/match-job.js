// import Resume from "../../../models/Resume";
// import Job from "../../../models/Job";
// import { connectDB } from "../../../lib/db";

// export default async function handler(req, res) {

//     if (req.method !== "POST") {
//         return res.status(405).json({ message: "Only POST Allowed" });
//     } 

//     // resumeId is coming from the client, means the user has uploaded a resume
//     const { resumeId } = req.body;

//     await connectDB();

//     // fetch resume and jobs from DB
//     const resume = await Resume.findById(resumeId);
//     const jobs = await Job.find();

//     // simple matching: count how many skills appear in resume text
//     const results = jobs.map((job) => {
//         let matched = 0;
//         job.skills.forEach((skill) => {
//             if (resume.text.toLowerCase().includes(skill.toLowerCase())) { matched++; } });
//             return {
//                 role: job.role,
//                 matchPercentage: Math.round((matched / job.skills.length) * 100)
//             }
//     });

//     res.json({ results });
// }


import axios from "axios";
import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";
import { getAuth } from "@clerk/nextjs/server";


const jobs = [
    { role: "Frontend Developer", skills: ["HTML", "CSS", "JavaScript", "React"], level: "Junior" },
    { role: "Backend Developer", skills: ["Node.js", "Express", "MongoDB"], level: "Mid" },
    { role: "Fullstack Developer", skills: ["React", "Node.js", "Express", "MongoDB"], level: "Senior" },
    { role: "UI/UX Designer", skills: ["Figma", "Adobe XD", "Sketch"], level: "Junior" },
    { role: "Data Analyst", skills: ["SQL", "Python", "Tableau"], level: "Mid" },
    { role: "Data Scientist", skills: ["Python", "TensorFlow", "Keras"], level: "Senior" },
    { role: "DevOps Engineer", skills: ["Docker", "Kubernetes", "AWS"], level: "Mid" },
    { role: "Product Manager", skills: ["Agile", "Scrum", "Product Strategy"], level: "Senior" },
]

export default async function (req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Only POST Allowed" });
    }

    try {

        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({
                message: "Please Login in first"
            });
        }

        const { resumeId } = req.body;

        if (!resumeId) {
            return res.status(400).json({
                message: "resumeId is required"
            });
        }

        await connectDB();

        const resume = await Resume.findOne({
            _id: resumeId,
            userId: userId,
        })

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        console.log("Resume text in chat APIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII:", resume.text);


        // const prompt = `You are a career job matcher and percentage calculator for how many job skills the user's resume matches. 
        // Match the skills and tell the role that suits the user the best with percentage of matching skills and mention missing skills. 
        // Also provide how user can achieve the missing skills with examples. 
        // Here is the user's resume: -------------------------${resume.text}------------------------- 
        // Here are the Jobs: -------------------------${message}------------------------- 
        // Please Answer clearly and concisely.`;



        // Format jobs as a readable string
        const jobsFormatted = jobs.map(job =>
            `Job Role: ${job.role}\nRequired Skills: ${job.skills.join(", ")}\nLevel: ${job.level}`
        ).join("\n\n");


        const prompt = `You are a career advisor. Analyze this resume against available job positions.
        
            USER'S RESUME:
            ${resume.text}

            AVAILABLE JOB POSITIONS:
            ${jobsFormatted}

            YOUR ANALYSIS:
            1. For EACH job position, calculate the percentage of required skills found in the resume
            2. Rank all jobs from highest to lowest match percentage
            3. For the top 3 matches, provide:
            - Job title and level
            - Match percentage (e.g., "75% match")
            - List of skills found in resume (be specific)
            - List of skills missing from resume
            - Brief learning suggestions for missing skills
            
            4. Provide overall career advice
            5. Also provide overall analysis: which career path the user is best suited for based on their skills

            Rules:
            - Use plain text format - NO markdown symbols (#, *, -, _, \`\`\`, etc.)
            - Use ONLY the information provided.
            - Do NOT assume or invent skills.
            - Be clear and concise.

            FORMAT YOUR RESPONSE:
            🔍 SKILLS FOUND IN RESUME: [list skills you found]

            🏆 TOP 3 JOB MATCHES:

            1. [Job Title] ([Level]) - [X]% match
                ✅ Skills Found: [list]
                ❌ Skills Missing: [list]
                📚 Learn: [suggestions]

            2. [Job Title] ([Level]) - [X]% match
                ✅ Skills Found: [list]
                ❌ Skills Missing: [list]
                📚 Learn: [suggestions]

            3. [Job Title] ([Level]) - [X]% match
                ✅ Skills Found: [list]
                ❌ Skills Missing: [list]
                📚 Learn: [suggestions]

            💡 CAREER RECOMMENDATIONS:
            [Provide overall analysis and advice here]

            IMPORTANT: Be specific about which skills from the job description were actually found in the resume.`;

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