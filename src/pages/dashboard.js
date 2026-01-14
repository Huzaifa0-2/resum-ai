// import { useState } from "react";
// import ResumeUpload from "../components/ResumeUpload";
// import { useRouter } from "next/router";

// export default function Dashboard() {
//   const [resumeId, setResumeId] = useState(null);
//   const router = useRouter();

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Dashboard</h1>

//       {/* STEP 1: Upload Resume */}
//       <ResumeUpload setResumeId={setResumeId} />

//       {/* STEP 2: Show options ONLY after resume upload */}
//       {resumeId && (
//         <div style={{ marginTop: "20px" }}>
//           <h3>What do you want to do next?</h3>

//           <button
//             onClick={() =>
//               router.push(`/match?resumeId=${resumeId}`)
//             }
//           >
//             Match Jobs
//           </button>

//           <button
//             onClick={() => router.push("/chat")}
//             style={{ marginLeft: "10px" }}
//           >
//             Chat with AI
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }



// import { useUser } from "@clerk/nextjs";
// import { useState, useEffect } from "react";
// import ResumeUpload from "../components/ResumeUpload";
// import Link from "next/link";
// import { useRouter } from "next/router";

// export default function Dashboard() {
//   const { user, isLoaded } = useUser();
//   const [resumes, setResumes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [resumeId, setResumeId] = useState(null);

//   const router = useRouter();

//   useEffect(() => {
//     if (isLoaded && user) {
//       fetchUserResumes();
//     }
//   }, [isLoaded, user]);

//   const fetchUserResumes = async () => {
//     try {
//       const response = await fetch("/api/user/resumes");
//       const data = await response.json();
//       if (data.success) {
//         setResumes(data.resumes);
//       }
//     } catch (error) {
//       console.error("Error fetching resumes:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteResume = async (resumeId) => {
//     try {
//       const response = await fetch("/api/resume/delete", {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json", // ✅ ADD THIS HEADER
//         },
//         body: JSON.stringify({ resumeId }),
//       });
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       if (data.success) {
//         fetchUserResumes();
//       }
//     } catch (error) {
//       console.error("Error deleting resume:", error);
//     }
//   }


//   if (!isLoaded) return <div>Loading...</div>;
//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl mb-4">Please sign in</h1>
//           <Link href="/auth/sign-in" className="text-blue-500">
//             Sign In
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6">
//           Welcome, {user.firstName || user.username}!
//         </h1>

//         <div className="mb-8">
//           <h2 className="text-xl font-semibold mb-4">Upload Resume</h2>
//           {/* Add your upload component here */}
//           <ResumeUpload setResumeId={setResumeId} />
//         </div>
//         {resumeId && (
//           <div style={{ marginTop: "20px" }}>
//             <h3>What do you want to do next?</h3>

//             <button
//               onClick={() =>
//                 router.push(`/match?resumeId=${resumeId}`)
//               }
//             >
//               Match Jobs
//             </button>

//             <button
//               onClick={() => router.push("/chat")}
//               style={{ marginLeft: "10px" }}
//             >
//               Chat with AI
//             </button>
//           </div>
//         )}
//         <div>
//           <h2 className="text-xl font-semibold mb-4">Your Resumes</h2>
//           {loading ? (
//             <p>Loading resumes...</p>
//           ) : resumes.length === 0 ? (
//             <p>No resumes uploaded yet.</p>
//           ) : (
//             <div className="grid gap-4">
//               {resumes.map((resume) => (
//                 <div key={resume._id} className="border p-4 rounded">
//                   <h3 className="font-medium">{resume.filename}</h3>
//                   <p className="text-sm text-gray-600">
//                     Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()}
//                   </p>

//                   <button
//                     onClick={() =>
//                       router.push(`/match?resumeId=${resume._id}`)
//                     }
//                   >Match Jobs</button>
//                   <Link
//                     href={`/chat?resumeId=${resume._id}`}
//                     className="text-blue-500 mt-2 inline-block"
//                   >
//                     Chat about this resume →
//                   </Link>
//                   <div>
//                     <button
//                       onClick={() => {
//                         const confirmDelete = window.confirm(
//                           "Are you sure you want to delete this resume?"
//                         );
//                         if (confirmDelete) {
//                           deleteResume(resume._id);
//                         }
//                       }}
//                       className="text-red-500 mt-2 inline-block"
//                     >
//                       Delete Resume
//                     </button>
//                   </div>
//                 </div>))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import ResumeUpload from "../components/ResumeUpload";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Upload,
  FileText,
  Brain,
  Target,
  MessageSquare,
  Trash2,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Clock,
  Download,
  Zap,
  BarChart3,
  User,
  Shield,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumeId, setResumeId] = useState(null);
  const [activeTab, setActiveTab] = useState("resumes");

  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserResumes();
    }
  }, [isLoaded, user]);

  const fetchUserResumes = async () => {
    try {
      const response = await fetch("/api/user/resumes");
      const data = await response.json();
      if (data.success) {
        setResumes(data.resumes);
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteResume = async (resumeId) => {
    try {
      const response = await fetch("/api/resume/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeId }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        fetchUserResumes();
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
    }
  };

  if (!isLoaded) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading your dashboard...</p>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 border border-cyan-500/20">
          <h1 className="text-2xl font-bold text-white mb-4">Please sign in</h1>
          <Link 
            href="/auth/sign-in" 
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all text-white"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Total Resumes", value: resumes.length, icon: <FileText className="w-5 h-5" />, color: "cyan" },
    { label: "AI Analysis", value: "5/5", icon: <Brain className="w-5 h-5" />, color: "purple" },
    { label: "Job Matches", value: "24", icon: <Target className="w-5 h-5" />, color: "green" },
    { label: "Chat Sessions", value: "12", icon: <MessageSquare className="w-5 h-5" />, color: "pink" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white pt-20">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {user.firstName || user.username}!
                </span>
              </h1>
              <p className="text-gray-400">Here&apos;s your career dashboard with AI insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-sm text-gray-400">Account</p>
                <p className="text-sm">{user.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="p-4 rounded-xl bg-gradient-to-br from-gray-900/50 to-black/50 border border-cyan-500/10 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-r from-${stat.color}-500/20 to-${stat.color}-600/20`}>
                    {stat.icon}
                  </div>
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Upload & Quick Actions */}
          <div className="lg:col-span-2">
            {/* Upload Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg mr-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">Upload New Resume</h2>
              </div>
              
              <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 border border-cyan-500/20">
                <ResumeUpload setResumeId={setResumeId} />
                
                {resumeId && (
                  <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="font-medium">Resume uploaded successfully!</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => router.push(`/match?resumeId=${resumeId}`)}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center space-x-2"
                        >
                          <Target className="w-4 h-4" />
                          <span>Match Jobs</span>
                        </button>
                        <button
                          onClick={() => router.push(`/chat?resumeId=${resumeId}`)}
                          className="px-4 py-2 rounded-lg border border-purple-500/30 hover:bg-purple-500/10 transition-all flex items-center space-x-2"
                        >
                          <Brain className="w-4 h-4" />
                          <span>Chat with AI</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Resume List */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg mr-3">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Your Resumes</h2>
                </div>
                <span className="text-gray-400">{resumes.length} resumes</span>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-gray-800/50 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : resumes.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 border border-cyan-500/20">
                  <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No resumes yet</h3>
                  <p className="text-gray-400 mb-4">Upload your first resume to get AI insights</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {resumes.map((resume) => (
                    <div 
                      key={resume._id} 
                      className="group p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 border border-cyan-500/10 hover:border-cyan-500/30 transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                            <FileText className="w-6 h-6 text-cyan-400" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{resume.filename}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {new Date(resume.uploadedAt).toLocaleDateString()}
                              </span>
                              <span>•</span>
                              <span>Size: {(resume.size / 1024).toFixed(1)}KB</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const confirmDelete = window.confirm(
                              "Are you sure you want to delete this resume?"
                            );
                            if (confirmDelete) {
                              deleteResume(resume._id);
                            }
                          }}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => router.push(`/match?resumeId=${resume._id}`)}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center space-x-2"
                          >
                            <Target className="w-4 h-4" />
                            <span>Match Jobs</span>
                          </button>
                          <Link
                            href={`/chat?resumeId=${resume._id}`}
                            className="px-4 py-2 rounded-lg border border-purple-500/30 hover:bg-purple-500/10 transition-all flex items-center space-x-2"
                          >
                            <Brain className="w-4 h-4" />
                            <span>Chat with AI</span>
                          </Link>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Actions & Tips */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 border border-cyan-500/20">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => router.push("/match")}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-all text-left flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-cyan-400" />
                    <span>Find Job Matches</span>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => router.push("/chat")}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all text-left flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <span>AI Career Coach</span>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => router.push("/analytics")}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:border-green-500/40 transition-all text-left flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                    <span>View Analytics</span>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* AI Tips */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20">
              <div className="flex items-center mb-4">
                <Sparkles className="w-5 h-5 text-purple-400 mr-2" />
                <h3 className="text-xl font-bold">AI Tips</h3>
              </div>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-black/30">
                  <p className="text-sm">💡 <strong>Keyword Optimization:</strong> Add more industry-specific keywords to increase ATS score by 30%</p>
                </div>
                <div className="p-3 rounded-lg bg-black/30">
                  <p className="text-sm">🚀 <strong>Career Growth:</strong> Your skills match 85% of Senior Developer roles. Consider applying!</p>
                </div>
                <div className="p-3 rounded-lg bg-black/30">
                  <p className="text-sm">🎯 <strong>Market Trends:</strong> React and Node.js are trending +40% in job postings this month</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 border border-cyan-500/20">
              <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-cyan-500/20">
                    <Upload className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm">Resume uploaded</p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-green-500/20">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm">AI analysis completed</p>
                    <p className="text-xs text-gray-400">Yesterday</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-purple-500/20">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm">Job matches found</p>
                    <p className="text-xs text-gray-400">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}