import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ChatMessage } from '../types';
import { storageService } from '../lib/storage';
import {
  Bot,
  Send,
  User,
  Sparkles,
  RotateCcw,
  KeyRound,
  Info,
  Loader2,
  CheckCircle2,
  Flame,
  Dumbbell,
  Utensils
} from 'lucide-react';

interface CoachPageProps {
  userProfile: UserProfile | null;
}

export const CoachPage: React.FC<CoachPageProps> = ({ userProfile }) => {
  const userId = userProfile?.id || 'guest';
  const defaultWelcomeMessage: ChatMessage = {
    id: 'welcome',
    userId,
    role: 'model',
    text: `Namaste ${userProfile?.name || 'Athlete'}! I am your personal FitMood AI Coach. Ask me for custom 10-minute home workouts, calisthenics form correction, budget Indian protein sources, or how to train when motivation is low!`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: new Date().toISOString()
  };

  const [messages, setMessages] = useState<ChatMessage[]>([defaultWelcomeMessage]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [apiKeyNotice, setApiKeyNotice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const loadHistory = async () => {
      try {
        setIsLoadingHistory(true);
        const saved = await storageService.getChatMessages(userId);
        if (isMounted) {
          if (saved && saved.length > 0) {
            setMessages(saved);
          } else {
            setMessages([defaultWelcomeMessage]);
          }
        }
      } catch (err) {
        console.warn('Failed to load chat history:', err);
      } finally {
        if (isMounted) setIsLoadingHistory(false);
      }
    };

    loadHistory();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const quickPrompts = [
    { title: '10-Min Home Routine', text: 'Give me a 10-minute beginner home workout.' },
    { title: 'Fix Push-Up Flare', text: 'How do I fix elbow flare during push-ups?' },
    { title: 'Cheap Indian Protein', text: 'What are the best cheap Indian vegetarian protein meals under ₹30?' },
    { title: 'Tired Today', text: 'I am feeling tired and stressed today: what workout or mobility should I do?' },
    { title: 'Squat Depth & Knees', text: 'How do I squat deeper without my knees caving in?' }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      userId,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);
    setApiKeyNotice(null);

    await storageService.saveChatMessage(userId, userMsg);

    try {
      const response = await fetch('/api/gemini/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, text: m.text })),
          userContext: {
            name: userProfile?.name,
            goal: userProfile?.fitnessGoal,
            diet: userProfile?.dietaryPreference,
            limitations: userProfile?.limitations,
            level: userProfile?.level,
            xp: userProfile?.xp
          }
        })
      });

      const data = await response.json();

      if (data.status === 'missing_key') {
        setApiKeyNotice('GEMINI_API_KEY is not configured in environment settings. Built-in guidance mode is active.');
      }

      const modelReply = data.reply || "Keep your form steady and breathe deeply through your diaphragm!";

      const modelMsg: ChatMessage = {
        id: `model_${Date.now()}`,
        userId,
        role: 'model',
        text: modelReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: new Date().toISOString(),
        isFallback: Boolean(data.isFallback)
      };

      setMessages((prev) => [...prev, modelMsg]);
      await storageService.saveChatMessage(userId, modelMsg);
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        userId,
        role: 'model',
        text: 'Network offline or server busy. Core form reminder: Control the lowering phase for 2 seconds, keep your core braced, and breathe through each rep!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: new Date().toISOString(),
        isError: true
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      await storageService.saveChatMessage(userId, fallbackMsg);
    } finally {
      setIsSending(false);
    }
  };

  const handleClearChat = async () => {
    if (confirm('Start a fresh conversation with FitMood AI Coach?')) {
      await storageService.clearChatMessages(userId);
      setMessages([
        {
          id: `welcome_${Date.now()}`,
          userId,
          role: 'model',
          text: `Welcome to a new chat session! What fitness goal or question should we focus on?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          createdAt: new Date().toISOString()
        }
      ]);
      setApiKeyNotice(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-lime-400" />
            <span>Interactive AI Fitness Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>FitMood AI Coach</span>
            <span className="text-xs px-2.5 py-1 rounded-xl bg-lime-400 text-slate-950 font-black">Gemini</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time home workout tailoring, calisthenics form correction, and affordable Indian nutrition estimates.
          </p>
        </div>

        <button
          onClick={handleClearChat}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition-all self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Suggested Quick Prompt Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(q.text)}
            disabled={isSending}
            className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-lime-400/40 text-left transition-all hover:scale-102 group disabled:opacity-50"
          >
            <div className="text-[11px] font-bold text-white group-hover:text-lime-400 transition-colors">
              {q.title}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
              Ask coach →
            </div>
          </button>
        ))}
      </div>

      {/* Main Chat Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
        {/* API Key Notice */}
        {apiKeyNotice && (
          <div className="px-5 py-2.5 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{apiKeyNotice}</span>
            </div>
            <button
              onClick={() => setApiKeyNotice(null)}
              className="text-amber-400 font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {isLoadingHistory ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-2 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-lime-400" />
              <span className="text-xs">Loading saved conversations...</span>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-lime-400 to-emerald-400 text-slate-950 flex items-center justify-center shrink-0 mt-0.5 font-bold shadow-md shadow-lime-400/20">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-lime-400 text-slate-950 font-medium rounded-tr-xs'
                        : msg.isError
                        ? 'bg-rose-950/40 border border-rose-800/80 text-rose-200 rounded-tl-xs'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <div className="flex items-center justify-between gap-3 mt-2 pt-1 border-t border-white/5">
                      {msg.isFallback && !isUser && (
                        <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          <span>Built-in Guidance</span>
                        </span>
                      )}
                      <span
                        className={`text-[10px] ml-auto ${
                          isUser ? 'text-slate-800/80' : 'text-slate-500'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-9 h-9 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {isSending && (
            <div className="flex gap-3 items-center text-xs text-slate-400 p-3 rounded-2xl bg-slate-950/40 border border-slate-800/60">
              <div className="w-7 h-7 rounded-xl bg-lime-400/20 text-lime-400 flex items-center justify-center shrink-0 border border-lime-400/30">
                <Loader2 className="w-4 h-4 animate-spin text-lime-400" />
              </div>
              <span className="italic text-slate-300">FitMood Coach is preparing your fitness advice...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about workouts, meal ideas, form correction, or motivation..."
              disabled={isSending}
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              aria-label="Send message"
              className="px-5 py-3 rounded-2xl bg-lime-400 hover:bg-lime-300 disabled:opacity-40 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-lime-400/20 transition-all flex items-center gap-2 shrink-0 hover:scale-102 active:scale-98"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Send</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
