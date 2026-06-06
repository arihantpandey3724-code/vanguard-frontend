import React, { useState, useRef, useEffect } from 'react';

export default function DashboardChat() {
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      text: "Vanguard AI online. Ask me anything about extreme heat survival, water scarcity adaptation, or local climate risks." 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to the bottom when a new message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      // Calling your existing AI microservice endpoint
      const res = await fetch('http://localhost:8000/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      
      const data = await res.json();
      // Adjust 'data.response' if your backend uses a different key like 'data.reply'
      const aiReply = data.response || data.reply || "I am currently offline.";
      
      setMessages(prev => [...prev, { role: 'ai', text: aiReply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "ERROR: Connection to Vanguard AI lost. Ensure backend is running." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[400px] w-full bg-[#F4F3EE] border border-[#162B22]/15 rounded-3xl shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-[#162B22]/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6B8E23] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#6B8E23]"></span>
          </div>
          <h3 className="text-sm font-bold text-[#162B22] uppercase tracking-widest">
            Tactical AI Advisor
          </h3>
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-50/50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user' 
                  ? 'bg-[#162B22] text-white rounded-br-none' 
                  : 'bg-white border border-[#162B22]/10 text-[#2C1E16] rounded-bl-none shadow-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-[#162B22]/10 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#6B8E23] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-[#6B8E23] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-[#6B8E23] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="bg-white border-t border-[#162B22]/10 p-4">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for local survival protocols..."
            className="w-full bg-[#F4F3EE] border border-[#162B22]/20 rounded-xl pl-4 pr-12 py-3 text-sm font-medium text-[#2C1E16] placeholder-[#162B22]/40 focus:outline-none focus:border-[#6B8E23] focus:ring-1 focus:ring-[#6B8E23]/20"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-[#162B22] text-white rounded-lg hover:bg-[#6B8E23] transition-colors disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}