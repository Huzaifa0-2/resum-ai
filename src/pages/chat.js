// import ChatBox from "@/components/ChatBox";

// export default function Chat() {
//     return (
//         <div>
//             <h1>Career Chat</h1>
//             <ChatBox resumeId={resumeId} />
//         </div>
//     );
// }

import ChatBox from "@/components/ChatBox";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Chat() {

    const router = useRouter();
    const { resumeId } = router.query;

  // const [resumeId, setResumeId] = useState(null);

  // useEffect(() => {
  //   const id = localStorage.getItem("resumeId");
  //   setResumeId(id);
  // }, []);

  if (!resumeId) {
    return <p>Please upload your resume first.</p>;
  }

  return (
    <div>
      {/* <h1>Career Chat</h1> */}
      <ChatBox resumeId={resumeId} />
    </div>
  );
}
