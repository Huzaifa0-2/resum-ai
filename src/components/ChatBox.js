// import { useState } from "react";

// export default function ChatBox() {
//   const [msg, setMsg] = useState("");
//   const [reply, setReply] = useState("");

//   async function send() {
//     if (!msg.trim()) return;

//     try {
//       const res = await fetch("/api/ai/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ message: msg }), // must be "message" because backend expects { message: ... }
//       });

//       const data = await res.json();
//       setReply(data.reply || "No response from AI");
//     } catch (err) {
//       console.error("Chat API error:", err);
//       setReply("Error connecting to AI");
//     }
//   }

//   return (
//     <div>
//       <textarea
//         value={msg}
//         onChange={(e) => setMsg(e.target.value)}
//         placeholder="Type your message..."
//       />
//       <button onClick={send}>Ask</button>
//       <p>{reply}</p>
//     </div>
//   );
// }



// import { useState } from "react";

// export default function ChatBox({ resumeId }) {
//   const [msg, setMsg] = useState("");
//   const [reply, setReply] = useState("");

//   async function send() {
//     if (!msg.trim()) return;

//     try {
//       const res = await fetch("/api/ai/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           message: msg,
//           resumeId: resumeId, // 🔴 VERY IMPORTANT
//         }),
//       });

//       const data = await res.json();
//       setReply(data.reply || "No response from AI");
//     } catch (err) {
//       console.error("Chat API error:", err);
//       setReply("Error connecting to AI");
//     }
//   }

//   return (
//     <div>
//       <textarea
//         value={msg}
//         onChange={(e) => setMsg(e.target.value)}
//         placeholder="Ask something about your resume..."
//       />
//       <button onClick={send}>Ask</button>
//       <p>{reply}</p>
//     </div>
//   );
// }


import { useState, useEffect, useRef } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Trash2,
  Paperclip,
  FileText,
  Brain,
  Zap,
  ChevronRight,
  Loader2,
  TrendingUp // Added this import
} from "lucide-react";

export default function ChatBox({ resumeId }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [suggestions] = useState([
    "What jobs match my profile?",
    "What salary should I expect?",
    "What certifications would help?",
    "How do I transition to a different role?"
  ]);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [msg]);

  // Load chat history from localStorage
  useEffect(() => {
    const savedChat = localStorage.getItem(`resume-chat-${resumeId}`);
    if (savedChat) {
      setMessages(JSON.parse(savedChat));
    }
  }, [resumeId]);

  const saveChat = (updatedMessages) => {
    localStorage.setItem(`resume-chat-${resumeId}`, JSON.stringify(updatedMessages));
  };

  const sendMessage = async () => {
    if (!msg.trim() || loading) return;

    const userMessage = { text: msg, sender: "user", time: new Date().toLocaleTimeString() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveChat(updatedMessages);
    setMsg("");
    setLoading(true);
    setTyping(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, resumeId }),
      });

      const data = await res.json();
      const aiMessage = {
        text: data.reply || "No response from AI",
        sender: "ai",
        time: new Date().toLocaleTimeString()
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      saveChat(finalMessages);
    } catch (err) {
      console.error("Chat API error:", err);
      const errorMessage = {
        text: "Sorry, I'm having trouble connecting. Please try again.",
        sender: "ai",
        time: new Date().toLocaleTimeString(),
        error: true
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      saveChat(finalMessages);
    } finally {
      setLoading(false);
      setTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setMsg(suggestion);
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      setMessages([]);
      localStorage.removeItem(`resume-chat-${resumeId}`);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleFeedback = (messageIndex, helpful) => {
    const updatedMessages = [...messages];
    updatedMessages[messageIndex].feedback = helpful;
    setMessages(updatedMessages);
    saveChat(updatedMessages);
    // Send feedback to backend
    fetch("/api/ai/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageIndex, helpful, resumeId }),
    });
  };

  const regenerateResponse = async (messageIndex) => {
    setLoading(true);
    try {
      const messageToRegenerate = messages[messageIndex - 1];
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageToRegenerate.text,
          resumeId
        }),
      });

      const data = await res.json();
      const updatedMessages = [...messages];
      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        text: data.reply,
        regenerated: true
      };
      setMessages(updatedMessages);
      saveChat(updatedMessages);
    } catch (err) {
      console.error("Regeneration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-2 ">
      {/* Chat Header */}
      {/* <div className="p-6 border-b border-cyan-500/20 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Career Assistant</h2>
              <p className="text-sm text-gray-400">Powered by Gemini AI • Analyzing your resume</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearChat}
              className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-red-400 transition-all"
              title="Clear chat"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <div className="flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm text-green-400">AI Online</span>
            </div>
          </div>
        </div>
      </div> */}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center pt-12">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 mb-6">
              <Bot className="w-12 h-12 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Hello! I'm your AI Career Assistant</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              I've analyzed your resume. Ask me anything about your skills, career path, or how to improve your profile.
            </p>

            {/* Suggestions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto mb-8">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-4 rounded-xl bg-gradient-to-br from-gray-900/50 to-black/50 border border-cyan-500/10 hover:border-cyan-500/30 transition-all text-left group hover:shadow-lg hover:shadow-cyan-500/5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{suggestion}</span>
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                  </div>
                </button>
              ))}
            </div>

            {/* Capabilities */}
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/10 text-center">
                  <Sparkles className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-300">Skills Analysis</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/10 text-center">
                  <Zap className="w-5 h-5 text-blue-400 mx-auto mb-2" /> {/* Replaced Target with Zap */}
                  <p className="text-xs text-gray-300">Job Matching</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/10 text-center">
                  <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-300">Career Growth</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-5 ${message.sender === "user"
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30"
                      : "bg-gradient-to-br from-gray-900/50 to-black/50 border border-purple-500/20"
                    }`}
                >
                  <div className="flex items-center mb-3">
                    <div className={`p-2 rounded-full mr-3 ${message.sender === "user"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                        : "bg-gradient-to-r from-purple-500 to-pink-600"
                      }`}>
                      {message.sender === "user" ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <span className="font-bold">
                        {message.sender === "user" ? "You" : "Career AI"}
                      </span>
                      <span className="text-xs text-gray-400 ml-3">{message.time}</span>
                    </div>
                  </div>
                  <p className="text-gray-100 whitespace-pre-wrap">{message.text}</p>

                  {/* Message Actions */}
                  {message.sender === "ai" && !message.error && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => copyToClipboard(message.text)}
                          className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-cyan-400 transition-all"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => regenerateResponse(index)}
                          className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-purple-400 transition-all"
                          title="Regenerate response"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500 mr-2">Helpful?</span>
                        <button
                          onClick={() => handleFeedback(index, true)}
                          className={`p-1.5 rounded ${message.feedback === true
                              ? "bg-green-500/20 text-green-400"
                              : "hover:bg-gray-800 text-gray-400"
                            }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleFeedback(index, false)}
                          className={`p-1.5 rounded ${message.feedback === false
                              ? "bg-red-500/20 text-red-400"
                              : "hover:bg-gray-800 text-gray-400"
                            }`}
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {typing && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl p-5 bg-gradient-to-br from-gray-900/50 to-black/50 border border-purple-500/20">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full mr-3 bg-gradient-to-r from-purple-500 to-pink-600">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-cyan-500/20 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm">
        <div className="flex items-end space-x-4">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about your resume, skills, career path..."
              className="w-full p-4 pr-12 rounded-xl bg-gray-900/50 border border-cyan-500/20 focus:border-cyan-500/40 focus:outline-none text-white placeholder-gray-500 resize-none max-h-24 md:max-h-16"
              rows={1}
              disabled={loading}
            />
            <div className="absolute right-3 bottom-3 flex items-center space-x-2">
              {/* <button className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-cyan-400">
                <Paperclip className="w-5 h-5" />
              </button> */}
              <span className="text-xs text-gray-500">
                {msg.length > 0 ? `${msg.length}/1000` : ""}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-0">
            <button
              onClick={sendMessage}
              disabled={!msg.trim() || loading}
              className={`p-2 md:p-4 rounded-xl flex-shrink-0 transition-all ${!msg.trim() || loading
                  ? "bg-gray-800 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 hover:shadow-lg hover:shadow-cyan-500/25"
                }`}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 md:w-6 md:h-6 text-white animate-spin" />
              ) : (
                <Send className="w-4 h-4 md:w-6 md:h-6 text-white" />
              )}
            </button>

            <button
              onClick={clearChat}
              className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-red-400 transition-all"
              title="Clear chat"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Try asking:</span>
            <button
              onClick={() => handleSuggestionClick("What are my strongest skills?")}
              className="text-xs px-3 py-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all"
            >
              Strongest skills
            </button>
            <button
              onClick={() => handleSuggestionClick("How can I improve my resume?")}
              className="text-xs px-3 py-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all"
            >
              Resume tips
            </button>
          </div>
          {/* <div className="text-xs text-gray-500">
            Press <kbd className="px-2 py-1 bg-gray-800 rounded">Enter</kbd> to send •{" "}
            <kbd className="px-2 py-1 bg-gray-800 rounded">Shift+Enter</kbd> for new line
          </div> */}
        </div>
      </div>
    </div>
  );
}
