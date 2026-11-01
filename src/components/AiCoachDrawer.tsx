import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ChatMessage } from '../types';
import { storageService } from '../lib/storage';
import {
  MessageSquare,
  Send,
  X,
  Sparkles,
  Bot,
  User,
  Loader2,
  Trash2,
  RotateCcw,
  AlertTriangle,
  Info,
  KeyRound,
  Mic
} from 'lucide-react';

interface AiCoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onOpenVoiceCoach?: () => void;
}

export const AiCoachDrawer: React.FC<AiCoachDrawerProps> = ({
  isOpen,
  onClose,
  userProfile,
  onOpenVoiceCoach
}) => {
  const userId = userProfile?.id || 'guest';
  const defaultWelcomeMessage: ChatMessage = {
    id: 'welcome',
    userId,
    role: 'model',
    text: `Hey ${userProfile?.name || 'there'}! I'm your FitMood Coach. Need real-time tips on push-up form, joint-safe regressions, or high-protein Indian meals on a budget? Ask away!`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: new Date().toISOString()
  };

  const [messages, setMessages] = useState<ChatMessage[]>([defaultWelcomeMessage]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [apiKeyNotice, setApiKeyNotice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from storage
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

    if (isOpen) {
      loadHistory();
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen, userId]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSending, isOpen]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Give me a 10-minute beginner home workout',
    'How do I fix elbow flare during push-ups?',
    'Best cheap Indian protein meals under ₹30?',
    'Low motivation today: what should I do?',
    'Easiest way to master my first full squat?'
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

    // Save user message to persistent storage
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
        setApiKeyNotice('GEMINI_API_KEY is not configured in environment settings. Built-in guidance mode active.');
      }

      const modelReply = data.reply || "Keep your form steady, breathe through your diaphragm, and let's keep moving!";

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
          text: `Welcome to a new chat session, ${userProfile?.name || 'friend'}! What fitness or nutrition topic are we tackling right now?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          createdAt: new Date().toISOString()
        }
      ]);
      setApiKeyNotice(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-lime-400 to-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-lime-400/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-white text-base">FitMood AI Coach</h3>
                <span className="text-[10px] px-2 py-0.5 bg-lime-400/20 border border-lime-400/30 text-lime-400 font-bold rounded-full">
                  Gemini
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Home Calisthenics & Affordable Indian Nutrition</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenVoiceCoach && (
              <button
                onClick={() => {
                  onClose();
                  onOpenVoiceCoach();
                }}
                title="Switch to Live Voice Conversation"
                aria-label="Switch to Voice Mode"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl btn-primary text-xs font-bold cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden sm:inline">Voice Mode</span>
              </button>
            )}

            <button
              onClick={handleClearChat}
              title="Start New Chat"
              aria-label="New Chat"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              aria-label="Close Coach"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* API Key Notice Banner if applicable */}
        {apiKeyNotice && (
          <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-[11px] text-amber-300 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{apiKeyNotice}</span>
            </div>
            <button
              onClick={() => setApiKeyNotice(null)}
              className="text-amber-400 font-bold hover:underline ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoadingHistory ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-2 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-lime-400" />
              <span className="text-xs">Loading conversation history...</span>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-lime-400/20 text-lime-400 flex items-center justify-center shrink-0 mt-0.5 border border-lime-400/30">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-lime-400 text-slate-950 font-medium rounded-tr-xs'
                        : msg.isError
                        ? 'bg-rose-950/40 border border-rose-800/80 text-rose-200 rounded-tl-xs'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <div className="flex items-center justify-between gap-3 mt-1.5 pt-1 border-t border-white/5">
                      {msg.isFallback && !isUser && (
                        <span className="text-[9px] text-amber-400 font-semibold flex items-center gap-0.5">
                          <Info className="w-2.5 h-2.5" />
                          <span>Built-in Guidance</span>
                        </span>
                      )}
                      <span
                        className={`text-[9px] ml-auto ${
                          isUser ? 'text-slate-800/80' : 'text-slate-500'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {isSending && (
            <div className="flex gap-2.5 items-center text-xs text-slate-400 p-2 rounded-2xl bg-slate-950/40 border border-slate-800/60">
              <div className="w-7 h-7 rounded-xl bg-lime-400/20 text-lime-400 flex items-center justify-center shrink-0 border border-lime-400/30">
                <Loader2 className="w-4 h-4 animate-spin text-lime-400" />
              </div>
              <span className="italic text-slate-300">FitMood Coach is analyzing your exercise & nutrition question...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2.5 border-t border-slate-800/80 bg-slate-950/40">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-lime-400" />
            <span>Suggested Questions:</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                disabled={isSending}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-[11px] text-slate-300 font-medium border border-slate-700/60 transition-colors shrink-0 disabled:opacity-50 hover:text-white hover:border-lime-400/50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about workout schedules, push-up form, high-protein diet..."
              disabled={isSending}
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              aria-label="Send message"
              className="p-3 rounded-2xl btn-primary disabled:opacity-40 font-bold shadow-md transition-all shrink-0 hover:scale-102 active:scale-98 cursor-pointer"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
