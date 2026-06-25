import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Send, GraduationCap, HelpCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface MentorChatProps {
  currentSandboxState?: {
    likes: number;
    comments: number;
    shares: number;
    followers: number;
    calculatedRate: number;
  };
}

const STARTER_QUESTIONS = [
  "Why do we divide by follower count in the formula?",
  "What makes LinkedIn average the highest engagement?",
  "How do I load my own CSV file in Python using pandas?",
  "What is the difference between a bar chart and a pivot table?"
];

export default function MentorChat({ currentSandboxState }: MentorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I am Professor Taylor, your personal Data Analytics Mentor. 🎓\n\nI have created a synthetic dataset representing 300 social media posts for a small business. Together, we are going to learn how to clean, calculate, and analyze social media metrics using Python and basic statistics.\n\nAsk me anything! For example, you can ask about the **Engagement Rate formula**, how to use the **pandas** library, or what our **content recommendations** mean for a business. What are you curious about?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setErrorMsg(null);
    const userMsgId = Date.now().toString();
    const newUserMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send message history + context to our server-side API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...messages, newUserMessage].map(m => ({ role: m.role, content: m.content })),
          currentSandboxState
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to connect with the Mentor. Let\'s try again!');
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error("[Chat Component] Error:", err);
      setErrorMsg(err.message || 'Connecting with the AI Mentor failed. Please check if your GEMINI_API_KEY is configured.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div id="mentor-chat-root" className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-[520px]">
      {/* Mentor Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <span className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl block">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-tight">Professor Taylor</h3>
            <span className="text-xs text-slate-400">Data Analytics Mentor (Active AI)</span>
          </div>
        </div>
        
        {/* Help tooltip */}
        <div className="flex items-center gap-1 text-slate-400 text-xs">
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Ask about Python, formulas, or strategies</span>
        </div>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto pr-1 mb-4 space-y-4" id="messages-window">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${
              msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
            id={`message-${msg.id}`}
          >
            <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm'
                : 'bg-slate-100 text-slate-700 rounded-tl-none whitespace-pre-wrap'
            }`}>
              {msg.content}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
              {msg.timestamp}
            </span>
          </div>
        ))}
        
        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex flex-col max-w-[80%] mr-auto items-start" id="loading-bubble">
            <div className="bg-slate-100 text-slate-500 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-2 text-xs sm:text-sm">
              <RefreshCw className="h-4 w-4 animate-spin text-indigo-500" />
              <span>Taylor is writing an explanation...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Starter chips */}
      {messages.length === 1 && !isLoading && (
        <div className="mb-3" id="suggestions-area">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Click to ask a quick starter question:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {STARTER_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200/60 rounded-xl text-xs text-slate-600 font-medium transition cursor-pointer text-left"
                id={`btn-starter-${idx}`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Bar */}
      {errorMsg && (
        <div className="mb-3 p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl flex items-start gap-2" id="error-bar">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Mentor connection issue:</span> {errorMsg}
            <div className="mt-1 font-semibold text-rose-900">
              *Make sure to paste your GEMINI_API_KEY in the Secrets panel under Settings in the AI Studio sidebar, then restart the server!
            </div>
          </div>
        </div>
      )}

      {/* Input box */}
      <form onSubmit={handleFormSubmit} className="flex gap-2" id="chat-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask Professor Taylor a question..."
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 disabled:opacity-60 transition"
          id="chat-input-text"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl transition cursor-pointer shrink-0"
          id="btn-chat-send"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
