import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, Bot } from "lucide-react";
import ChatbotApiService from "../services/chatBot/chatBot";
import MarkdownText from "./markdownText";
import logo from '../assets/logo1.png';
export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const logo1 = logo;
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }

  async function sendMessage(e) {
    if (e) e.preventDefault();
    setError(null);
    const text = input.trim();
    if (!text) return;

    const userMsg = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const data = await ChatbotApiService.sendMessage(text);
      
      if (!data.success) throw new Error(data.error || "Chatbot request failed");

      const assistantMsg = { role: "assistant", text: data.reply || "(no reply)" };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("sendMessage error", err);
      setError(err.message || "Failed to send message");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, I couldn't reach the chatbot right now." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div>
      {/* Floating button */}
      <div className="fixed right-8 bottom-8 z-50">
        <button
          onClick={() => setOpen((v) => !v)}
          className="group relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white hover:shadow-indigo-500/60 hover:scale-110 transition-all duration-300 ring-4 ring-indigo-200 hover:ring-6 hover:ring-indigo-300 animate-pulse hover:animate-none"
          aria-label={open ? "Close chat" : "Open chat"}
        >
          {open ? (
            <X className="w-7 h-7 transition-transform duration-300 group-hover:rotate-90" />
          ) : (
            <MessageCircle className="w-7 h-7 transition-transform duration-300 group-hover:scale-125" />
          )}
          
          {/* Notification dot with pulse */}
          {!open && (
            <>
              <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-ping"></span>
              <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
            </>
          )}
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300"></div>
        </button>

        {/* Chat window */}
        {open && (
          <div className="absolute bottom-20 right-0 w-[420px] max-w-[calc(100vw-3rem)] bg-white rounded-3xl shadow-2xl border-2 border-indigo-200 flex flex-col overflow-hidden transform transition-all duration-300 animate-slideIn">
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 px-5 py-5 text-white overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent"></div>
              </div>
              
              <div className="relative flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg ring-2 ring-white/30">
                    <img src={logo1} alt="Logo" className="w-10 h-10 rounded-xl" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-indigo-700 animate-pulse shadow-lg"></span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    TalentBridge Assistant
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </h3>
                  <p className="text-xs text-indigo-100 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Online • Ready to help
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 px-5 py-5 space-y-4 overflow-y-auto bg-gradient-to-b from-indigo-50/30 via-white to-purple-50/30"
              style={{ maxHeight: '450px', minHeight: '350px' }}
            >
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center py-10 animate-fadeIn">
                  <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-5 shadow-xl">
                    <MessageCircle className="w-10 h-10 text-white" />
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-400 to-purple-500 opacity-50 blur-xl animate-pulse"></div>
                  </div>
                  <h4 className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                    Welcome to TalentBridge! 👋
                  </h4>
                  <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
                    Your AI-powered career assistant is here! Ask me about jobs, hiring, company info, or anything else.
                  </p>
                  
                  {/* Quick suggestions */}
                  {/* Quick suggestions */}
                  <div className="mt-6 flex flex-wrap gap-2 justify-center">
                    <button 
                      onClick={() => {
                        setInput("💼 Find Jobs");
                        sendMessage();
                      }}
                      className="px-3 py-1.5 text-xs bg-white border-2 border-indigo-200 text-indigo-600 rounded-full hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      💼 Find Jobs
                    </button>
                    <button 
                      onClick={() => {
                        setInput("🚀 Get Started");
                        sendMessage();
                      }}
                      className="px-3 py-1.5 text-xs bg-white border-2 border-indigo-200 text-indigo-600 rounded-full hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      🚀 Get Started
                    </button>
                    <button 
                      onClick={() => {
                        setInput("❓ How it Works");
                        sendMessage();
                      }}
                      className="px-3 py-1.5 text-xs bg-white border-2 border-indigo-200 text-indigo-600 rounded-full hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      ❓ How it Works
                    </button>
                  </div>
                </div>
              )}

              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-slideUp`}
                >
                  <div
                    className={`${
                      m.role === "user"
                        ? "bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white rounded-3xl rounded-br-lg shadow-lg hover:shadow-xl"
                        : "bg-white text-gray-800 rounded-3xl rounded-bl-lg shadow-lg border-2 border-indigo-100 hover:border-indigo-200 hover:shadow-xl"
                    } max-w-[85%] px-5 py-4 text-sm leading-relaxed transition-all duration-300`}
                  >
                    {m.role === "assistant" ? (
                      <MarkdownText text={m.text} />
                    ) : (
                      <p className="whitespace-pre-wrap break-words font-medium">{m.text}</p>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-3 animate-slideUp">
                  <div className="bg-white text-gray-800 rounded-3xl rounded-bl-lg shadow-lg border-2 border-indigo-100 px-5 py-4 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '300ms' }}></span>
                      </div>
                      <span className="text-gray-500 text-xs font-medium">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-center animate-slideUp">
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs font-medium shadow-md">
                    ⚠️ {error}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-5 py-4 border-t-2 border-indigo-100 bg-gradient-to-b from-white to-indigo-50/30">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="w-full px-5 py-3.5 rounded-2xl border-2 border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none transition-all duration-200 shadow-sm hover:shadow-md bg-white placeholder-gray-400"
                    disabled={loading}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white hover:shadow-xl hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 shadow-lg"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center font-medium">
                ⚡ Powered by TalentBridge AI
              </p>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};