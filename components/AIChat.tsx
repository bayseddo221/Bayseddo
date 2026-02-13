
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { chatWithAdvisor } from '../services/geminiService';

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'As-salamu alaykum! Je suis l\'assistant Bay Seddo. Nanga def? Une question sur l\'investissement?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);
    
    try {
      const response = await chatWithAdvisor(userMsg);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Désolé, je rencontre une petite difficulté technique. Réessayez dans un instant. Jërëjëf." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-green-700 text-white p-4 rounded-full shadow-lg hover:bg-green-800 transition-all hover:scale-110 z-50 flex items-center gap-2 group border-4 border-white"
      >
        <MessageCircle size={24} />
        <span className="font-bold hidden md:inline">Assistant Bay Seddo</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[420px] max-w-[calc(100vw-2rem)] h-[600px] bg-white rounded-3xl shadow-2xl z-50 flex flex-col border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 p-6 flex justify-between items-center text-white shadow-lg relative">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm shadow-inner">
                <Bot size={24} />
            </div>
            <div>
                <h3 className="font-extrabold text-lg tracking-tight">Bay Seddo AI</h3>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <p className="text-green-100 text-[10px] uppercase font-bold tracking-widest">En ligne (Wolof / FR)</p>
                </div>
            </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-all">
          <X size={24} />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 mr-2 flex-shrink-0">
                    <Bot size={16} />
                </div>
            )}
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-green-700 text-white rounded-tr-none shadow-green-900/10' 
                : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none font-medium'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce delay-150"></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-slate-100 flex gap-3 items-center">
        <div className="flex-1 relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Posez votre question (FR / Wolof)..."
              className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all text-slate-700 placeholder:text-slate-400"
            />
        </div>
        <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-green-700 text-white p-4 rounded-2xl hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-900/10 active:scale-95"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};
