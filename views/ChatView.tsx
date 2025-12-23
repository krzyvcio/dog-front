import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Phone, Send, MoreVertical, ShieldCheck } from 'lucide-react';
import { User, ChatMessage } from '../types';
import { CURRENT_USER } from '../services/mockData';

interface ChatViewProps {
  partner: User;
  onBack: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ partner, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, senderId: partner.id, text: "Cześć! Widzę Twoją prośbę o spacer z Burkiem. Będę pod Twoim domem punktualnie o 12:30.", timestamp: "10:05" },
    { id: 2, senderId: CURRENT_USER.id, text: "Świetnie, dzięki Marek. Burek już nie może się doczekać!", timestamp: "10:12" },
    { id: 3, senderId: partner.id, text: "Nie ma problemu. Pamiętaj proszę o jego ulubionej smyczy.", timestamp: "10:15" },
  ]);
  
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      senderId: CURRENT_USER.id,
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputText("");
    
    // Simple mock response
    setTimeout(() => {
      const response: ChatMessage = {
        id: Date.now() + 1,
        senderId: partner.id,
        text: "Jasne, rozumiem. Do zobaczenia!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, response]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F9FB] animate-in slide-in-from-right duration-300">
      {/* Chat Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
                <img src={partner.image} className="w-10 h-10 rounded-full object-cover border border-gray-100" alt={partner.firstName} />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-accent border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h2 className="text-sm font-black text-gray-900 leading-none flex items-center gap-1">
                {partner.firstName} {partner.lastName}
                <ShieldCheck size={14} className="text-secondary" />
              </h2>
              <p className="text-[10px] text-accent font-bold uppercase tracking-tight mt-0.5">Online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <a 
            href="tel:500600700" 
            className="p-2.5 text-gray-400 hover:text-secondary hover:bg-sky-50 rounded-full transition-all"
          >
            <Phone size={20} />
          </a>
          <button className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-full">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex justify-center my-4">
            <span className="bg-white/50 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest border border-gray-100">Dzisiaj</span>
        </div>
        
        {messages.map((msg) => {
          const isMe = msg.senderId === CURRENT_USER.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm text-sm ${
                isMe 
                ? 'bg-gray-900 text-white rounded-tr-none' 
                : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
              }`}>
                <p className="leading-relaxed">{msg.text}</p>
                <div className={`text-[9px] mt-1.5 font-bold ${isMe ? 'text-gray-400 text-right' : 'text-gray-300'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 safe-area-pb">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-1.5 flex items-center focus-within:ring-2 focus-within:ring-secondary/20 transition-all">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Napisz wiadomość..." 
              className="w-full bg-transparent border-none outline-none text-sm py-2.5 placeholder-gray-400 font-medium"
            />
          </div>
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="bg-secondary text-white p-3.5 rounded-2xl shadow-lg shadow-sky-100 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};