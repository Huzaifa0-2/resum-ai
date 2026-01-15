"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function ResumeUpload({ setResumeId }) {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [uploading, setUploading] = useState(false);
    const { user, isLoaded } = useUser();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage(""); // Clear message when new file selected
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isLoaded || !user) {
            setMessage("Please sign in first");
            return;
        }

        if (!file) {
            setMessage("Please select a file");
            return;
        }

        setUploading(true);
        setMessage("");

        try {
            const formData = new FormData();
            formData.append("resume", file);
            formData.append("userId", user.id);

            const res = await fetch("/api/resume/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("✅ Resume uploaded successfully!");
                if (setResumeId) setResumeId(data.resumeId);
                setFile(null); // Clear file input
                e.target.reset(); // Reset form
            } else {
                setMessage(`❌ ${data.message || "Upload failed"}`);
            }
        } catch (err) {
            console.error(err);
            setMessage("❌ Error uploading resume");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                <div className="flex-1">
                    <input
                        type="file"
                        name="resume"
                        accept=".pdf,.txt,.doc,.docx"
                        onChange={handleFileChange}
                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl 
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
               hover:border-blue-400 transition-all duration-200 
               file:mr-4 file:py-2 file:px-4 file:rounded-lg 
               file:border-0 file:text-sm file:font-semibold 
               file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
               disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={uploading}
                    />
                </div>
                <button
                    type="submit"
                    // disabled={!isLoaded || !user || uploading || !file}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                    {uploading ? "Uploading..." : "Upload Resume"}
                </button>
            </form>

            {/* File name display */}
            {/* {file && (
                <p className="mt-2 text-sm text-gray-600">
                    Selected: <span className="font-medium">{file.name}</span>
                </p>
            )} */}

            {/* Message display */}
            {message && (
                <p className={`mt-2 text-sm ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
                    {message}
                </p>
            )}
        </div>
    );
}