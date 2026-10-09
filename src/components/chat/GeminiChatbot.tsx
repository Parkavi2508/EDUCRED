import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Minimize2,
  Maximize2,
  Loader2,
  ChevronDown,
  Zap,
  Brain,
  ShieldCheck,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
}

type ComplexityMode = 'general' | 'complex' | 'fast';

interface GeminiChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hello ${currentUser?.name || 'Educator'}! I am EduCred's Gemini Assistant. I can help you prepare evidence documents, navigate credit recognition rules, verify lesson plan date eligibility, or formulate clarification responses. How can I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.5-flash',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [complexity, setComplexity] = useState<ComplexityMode>('general');
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Model metadata according to user instructions
  const modelInfo = {
    general: {
      name: 'gemini-3.5-flash',
      label: 'Gemini 3.5 Flash',
      tag: 'General Tasks',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />,
      desc: 'Ideal for balanced, high-quality guidance on contributions & credits.',
    },
    complex: {
      name: 'gemini-3.1-pro-preview',
      label: 'Gemini 3.1 Pro',
      tag: 'Complex Analysis',
      icon: <Brain className="w-3.5 h-3.5 text-purple-500" />,
      desc: 'Deep reasoning for appeals, policy exceptions & rubric evaluations.',
    },
    fast: {
      name: 'gemini-3.1-flash-lite',
      label: 'Gemini 3.1 Flash-Lite',
      tag: 'Fast Responses',
      icon: <Zap className="w-3.5 h-3.5 text-emerald-500" />,
      desc: 'Ultra-low latency for quick criteria lookups & formatting checks.',
    },
  };

  const currentModel = modelInfo[complexity];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const systemInstruction = `You are EduCred's Official AI Academic Advisor and Verification Assistant.
Current User: ${currentUser?.name || 'Educator'} (${currentUser?.role || 'teacher'})
Institution: ${currentUser?.institutionName || 'National Academy of Secondary Education'}

Your responsibilities:
1. Explain how educational activities (Lesson Planning, Student Mentoring, Assessments, Workshops, Research, etc.) map to recognition credits.
2. Guide educators on preparing high-integrity evidence with clear dates and signatures.
3. Clarify institutional date rules (e.g. October 9 reference date with 3-day lead window, same-day submission restrictions).
4. Assist teachers in answering checker clarification requests politely and constructively.
5. Provide structured, practical advice formatted with clear paragraphs and bullet points.`;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, text: m.text })),
          systemInstruction,
          complexity,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'model',
        text: data.reply || 'I have analyzed your request. How else may I assist?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.model || currentModel.name,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: 'err-' + Date.now(),
        role: 'model',
        text: `I encountered an issue communicating with the service. Please try again or switch model mode. (${err.message})`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: currentModel.name,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'model',
        text: 'Conversation reset. How can I assist with your EduCred contributions today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: currentModel.name,
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden transition-all duration-200 ${
        isExpanded
          ? 'w-[90vw] md:w-[680px] h-[80vh] max-h-[800px]'
          : 'w-[92vw] sm:w-[420px] h-[580px]'
      }`}
    >
      {/* Chatbot Header */}
      <div className="bg-[#192A56] text-white p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#F7D794] text-[#192A56] flex items-center justify-center font-black text-sm shadow-xs">
            E
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight">EduCred Assistant</span>
              <span className="px-2 py-0.2 rounded text-[10px] font-semibold bg-white/15 text-[#F7D794]">
                Gemini
              </span>
            </div>
            <div className="text-[10px] text-slate-300 flex items-center gap-1.5 mt-0.5">
              {currentModel.icon}
              <span className="font-mono">{currentModel.name}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearChat}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title={isExpanded ? 'Minimize' : 'Expand'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Model Selection Bar (per instructions: 3 models for different tasks) */}
      <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center justify-between text-xs">
        <span className="text-[11px] font-semibold text-slate-600">Model Mode:</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setComplexity('general')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              complexity === 'general'
                ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="gemini-3.5-flash for general tasks"
          >
            General (Flash)
          </button>
          <button
            onClick={() => setComplexity('complex')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              complexity === 'complex'
                ? 'bg-white text-purple-900 font-bold shadow-xs border border-purple-200'
                : 'text-slate-600 hover:text-purple-900'
            }`}
            title="gemini-3.1-pro-preview for complex reasoning & appeals"
          >
            Pro (Complex)
          </button>
          <button
            onClick={() => setComplexity('fast')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              complexity === 'fast'
                ? 'bg-white text-emerald-900 font-bold shadow-xs border border-emerald-200'
                : 'text-slate-600 hover:text-emerald-900'
            }`}
            title="gemini-3.1-flash-lite for fast speed"
          >
            Lite (Fast)
          </button>
        </div>
      </div>

      {/* Message Thread (Scrollable) */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FCFBFB]">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                  isUser
                    ? 'bg-[#192A56] text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1">
                <span>{m.timestamp}</span>
                {!isUser && m.modelUsed && (
                  <>
                    <span>•</span>
                    <span className="font-mono text-[9px] text-slate-500">{m.modelUsed}</span>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 w-fit">
            <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
            <span className="font-medium">
              Thinking with {currentModel.name}...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      {messages.length <= 2 && (
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[11px]">
          <button
            onClick={() => handleSend('How are recognition credits calculated for mentoring?')}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 whitespace-nowrap"
          >
            💡 How credits are calculated
          </button>
          <button
            onClick={() => handleSend('What is the lesson plan lead-time date rule?')}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 whitespace-nowrap"
          >
            📅 Lead-time date rules
          </button>
          <button
            onClick={() => handleSend('How do I respond to a clarification request from a checker?')}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 whitespace-nowrap"
          >
            💬 Clarification advice
          </button>
        </div>
      )}

      {/* Input Field */}
      <div className="p-3 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${currentModel.label}...`}
            className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#192A56]/20 transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-[#192A56] hover:bg-[#121f42] text-white disabled:opacity-40 transition-all shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
