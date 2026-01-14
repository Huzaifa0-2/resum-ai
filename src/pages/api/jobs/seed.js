import { connectDB } from "@/lib/db";
import Job from "@/model/Job";

export default async function handler(req, res) {
    await connectDB();

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

    // Clear existing jobs and insert new ones
    await Job.deleteMany();
    await Job.insertMany(jobs);
    res.json({ message: "Job collection seeded!" });
}