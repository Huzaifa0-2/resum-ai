// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";

// export default function MatchPage() {
//   const router = useRouter();
//   const { resumeId } = router.query;

//   const [results, setResults] = useState([]);

//   useEffect(() => {
//     if (!resumeId) return;

//     async function fetchMatches() {
//       const res = await fetch("/api/ai/match-job", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ resumeId }),
//       });

//       const data = await res.json();
//       setResults(data.results);
//     }

//     fetchMatches();
//   }, [resumeId]);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Job Match Results</h1>

//       {results.map((job, index) => (
//         <div key={index}>
//           <p>
//             {job.role} — {job.matchPercentage}%
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// }


import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function MatchPage() {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const { resumeId } = router.query;

  const [reply, setReply] = useState([]);

  // useEffect(() => {

  if (!resumeId) return;

  async function fetchMatches() {
    const res = await fetch("/api/ai/match-job", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeId }),
    });

    const data = await res.json();
    setReply(data.reply);
  }

  //   fetchMatches();
  // }, [resumeId]);

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-2 ">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {show === false ? (
          <div className="text-center pt-12">
            <h1 className="text-3xl font-bold">Specifically For IT Roles</h1>
            <p className="my-6 px-96">Discover your perfect tech career match.
              Our AI analyzes your resume against <b>IT roles </b>
              and calculates your skill compatibility percentage.</p>
            <h2 className="text-2xl font-semibold mb-4">What our AI will provide</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto my-8">
              <p className="p-4 rounded-xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/10
              hover:border-pink-700/30 transition-all text-left group hover:shadow-lg hover:shadow-pink-500/5">
                AI-powered job matching for tech careers
              </p>
              <p className="p-4 rounded-xl bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/10 
            hover:border-cyan-500/30 transition-all text-left group hover:shadow-lg hover:shadow-cyan-500/5">
                Top 3 role matches with skill percentages
              </p>
              <p className="p-4 rounded-xl bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/10 
            hover:border-cyan-500/30 transition-all text-left group hover:shadow-lg hover:shadow-cyan-500/5">
                Identifies missing skills with learning suggestions
              </p>
              <p className="p-4 rounded-xl bg-gradient-to-br from-teal-700/20 to-cyan-700/20 border border-cyan-700/30 
            hover:border-cyan-500/30 transition-all text-left group hover:shadow-lg hover:shadow-cyan-300/5">
                Personalized career path recommendations
              </p>
            </div>
            <button className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-600 transition-all cursor-pointer"
              onClick={() => { setShow(true); fetchMatches(); }}>Start Matching</button>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-4">Matched Job</h1>
            <p className="mt-4 whitespace-pre-wrap">
              {reply}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}