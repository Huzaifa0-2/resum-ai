"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function ResumeUpload({ setResumeId }) {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const { user } = useUser();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return setMessage("Please select a file");

        try {
            //FormData is a function to construct a set of key/value pairs representing form fields and their values, in easy words,
            //it is used to send files and data together
            const formData = new FormData();
            formData.append("resume", file); // Must match API 'files.resume'
            formData.append("userId", user.id);

            const res = await fetch("/api/resume/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Resume uploaded successfully!");
                localStorage.setItem("resumeId", data.resumeId);//////////////////////////////
                if (setResumeId) setResumeId(data.resumeId);
            } else {
                setMessage(data.message || "Upload failed");
            }
        } catch (err) {
            console.error(err);
            setMessage("Error uploading resume");
        }
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3 w-full">
  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:items-center w-full gap-2">
    <input
      type="file"
      name="resume"
      accept=".pdf,.txt,.doc,.docx"
      onChange={handleFileChange}
      className="border border-blue-300 rounded px-2 py-1 w-full sm:w-auto"
    />
    <button
      type="submit"
      className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto"
    >
      Upload
    </button>
  </form>
  {/* {message && <p className="text-sm text-red-500 w-full sm:w-auto">{message}</p>} */}
</div>

    );
}

