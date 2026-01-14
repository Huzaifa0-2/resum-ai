// import mongoose from "mongoose";

// export const ResumeSchema = new mongoose.Schema({
//     userId: String,
//     text: String,
// });

// export default mongoose.models.Resume || mongoose.model("Resume", ResumeSchema);


import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    userId: {  // stores Clerk user ID
      type: String,
      required: true,
      index: true,
    },

    filename: String,
    text: String,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "resumes" }
);

export default mongoose.models.Resume ||
  mongoose.model("Resume", ResumeSchema);
