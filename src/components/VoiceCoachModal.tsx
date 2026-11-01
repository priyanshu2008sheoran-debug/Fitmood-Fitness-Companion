import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { Button } from './Button';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  RotateCcw,
  Square,
  Bot,
  User,
  Zap,
  HelpCircle,
  Radio,
  Sliders,
  ChevronRight
} from 'lucide-react';

interface VoiceCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
}

interface VoiceTurn {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
}

export const VoiceCoachModal: React.FC<VoiceCoachModalProps> = ({
  isOpen,
  onClose,
  userProfile
}) => {
  // Voice & Conversation States
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [autoListen, setAutoListen] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState<'Puck' | 'Kore' | 'Zephyr' | 'Fenrir'>('Puck');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const [conversation, setConversation] = useState<VoiceTurn[]>([
    {
      id: 'welcome',
      sender: 'coach',
      text: `Hey ${userProfile?.name || 'Athlete'}! I'm Coach Milo in live voice mode. Ask me about push-up form, joint-safe workouts, or high-protein meals. Tap the mic to talk!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Audio & Speech Recognition references
  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const conversationEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll transcript
  useEffect(() => {
    if (isOpen) {
      conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation, liveTranscript, isThinking]);

  // Soundwave visualizer animation
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const renderWave = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const centerY = height / 2;
      const numBars = 32;
      const barWidth = 3;
      const spacing = (width - numBars * barWidth) / (numBars - 1);

      // Determine amplitude based on status
      let baseAmp = 4;
      if (isListening) baseAmp = 18;
      else if (isSpeaking) baseAmp = 26;
      else if (isThinking) baseAmp = 12;

      for (let i = 0; i < numBars; i++) {
        const factor = Math.sin((i / numBars) * Math.PI);
        const wave = Math.sin(phase + (i * 0.35)) * Math.cos(phase * 0.7 + (i * 0.2));
        const amp = (baseAmp * factor * Math.abs(wave)) + (isSpeaking || isListening ? 6 : 2);

        const x = i * (barWidth + spacing);
        const yTop = centerY - amp;
        const barHeight = Math.max(4, amp * 2);

        // Color based on active state
        if (isSpeaking) {
          ctx.fillStyle = '#f97316'; // Coach speaking
        } else if (isListening) {
          ctx.fillStyle = '#22c55e'; // User speaking
        } else if (isThinking) {
          ctx.fillStyle = '#38bdf8'; // Gemini thinking
        } else {
          ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
        }

        ctx.beginPath();
        ctx.roundRect(x, yTop, barWidth, barHeight, 2);
        ctx.fill();
      }

      phase += isSpeaking ? 0.18 : isListening ? 0.14 : isThinking ? 0.08 : 0.03;
      animFrameRef.current = requestAnimationFrame(renderWave);
    };

    renderWave();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, isListening, isSpeaking, isThinking]);

  // Stop playback / speech synthesis
  const stopAllAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Play spoken text via Gemini Audio (WAV) or Web Speech API fallback
  const speakText = (text: string, base64Audio?: string | null) => {
    stopAllAudio();
    if (isMuted) return;

    if (base64Audio) {
      try {
        const audioSrc = `data:audio/wav;base64,${base64Audio}`;
        const audio = new Audio(audioSrc);
        audioPlayerRef.current = audio;

        audio.onplay = () => setIsSpeaking(true);
        audio.onended = () => {
          setIsSpeaking(false);
          if (autoListen) {
            setTimeout(() => startListening(), 400);
          }
        };
        audio.onerror = () => {
          console.warn('WAV playback failed, falling back to Web Speech Synthesis');
          fallbackWebSpeech(text);
        };
        audio.play().catch((err) => {
          console.warn('Audio play error:', err);
          fallbackWebSpeech(text);
        });
        return;
      } catch (e) {
        console.warn('Audio element error:', e);
      }
    }

    fallbackWebSpeech(text);
  };

  const fallbackWebSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    const cleanText = text.replace(/[*#_~`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = selectedVoice === 'Fenrir' ? 0.9 : selectedVoice === 'Kore' ? 1.15 : 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const preferred =
        voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))) ||
        voices.find((v) => v.lang.startsWith('en'));
      if (preferred) utterance.voice = preferred;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (autoListen) {
        setTimeout(() => startListening(), 400);
      }
    };
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Web Speech Recognition setup
  const startListening = () => {
    stopAllAudio();
    setErrorNotice(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorNotice('Voice input is not supported in this browser. Please type or use Chrome/Edge/Safari.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setLiveTranscript('');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setLiveTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorNotice('Microphone access was denied. Please allow microphone permissions in your browser bar.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start recognition:', err);
      setIsListening(false);
      setErrorNotice('Could not start microphone.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    if (liveTranscript.trim()) {
      handleSendVoiceMessage(liveTranscript.trim());
    }
  };

  // Process user message
  const handleSendVoiceMessage = async (text: string) => {
    if (!text || isThinking) return;

    const userTurn: VoiceTurn = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversation((prev) => [...prev, userTurn]);
    setLiveTranscript('');
    setIsThinking(true);
    setErrorNotice(null);

    try {
      const res = await fetch('/api/gemini/voice-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          voice: selectedVoice,
          userContext: {
            name: userProfile?.name,
            goal: userProfile?.fitnessGoal,
            diet: userProfile?.dietaryPreference,
            xp: userProfile?.xp,
            streak: userProfile?.streakDays
          },
          history: conversation.slice(-6).map((c) => ({
            role: c.sender === 'user' ? 'user' : 'model',
            text: c.text
          }))
        })
      });

      const data = await res.json();
      const replyText = data.reply || "Keep moving with control and breathe easy!";

      const coachTurn: VoiceTurn = {
        id: `c_${Date.now()}`,
        sender: 'coach',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setConversation((prev) => [...prev, coachTurn]);
      speakText(replyText, data.audioData);
    } catch (err: any) {
      console.error('Voice conversation error:', err);
      const fallbackReply = "Stay locked in! Smooth reps, tight core, and steady breathing!";
      setConversation((prev) => [
        ...prev,
        {
          id: `c_${Date.now()}`,
          sender: 'coach',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      speakText(fallbackReply);
    } finally {
      setIsThinking(false);
    }
  };

  // Quick voice prompts
  const sampleVoicePrompts = [
    'How do I master my first pull-up?',
    'What should I eat post-workout on a budget?',
    'Check my bodyweight squat form',
    'Low motivation today, what should I do?'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md">
      <div
        className="w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden max-h-[92vh]"
        style={{
          backgroundColor: 'var(--app-card, #ffffff)',
          color: 'var(--app-text-primary, #0f172a)'
        }}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg tracking-tight">
                  Coach Milo Live Voice
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-xs">
                  Gemini Live
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time spoken fitness coaching with Gemini TTS & Web Speech
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio Mute / Unmute Button */}
            <button
              onClick={() => {
                if (!isMuted && isSpeaking) stopAllAudio();
                setIsMuted(!isMuted);
              }}
              title={isMuted ? 'Unmute Coach' : 'Mute Coach'}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                stopAllAudio();
                if (recognitionRef.current) recognitionRef.current.abort();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Central Visualizer & Status Area */}
        <div className="px-6 py-6 bg-slate-50/70 dark:bg-slate-950/40 border-b border-slate-200/80 dark:border-slate-800/80 flex flex-col items-center justify-center text-center">
          {/* Animated Coach Avatar & Dynamic Halo */}
          <div className="relative mb-3">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                isSpeaking
                  ? 'ring-8 ring-orange-500/30 scale-105 shadow-xl shadow-orange-500/20'
                  : isListening
                  ? 'ring-8 ring-emerald-500/30 scale-105 shadow-xl shadow-emerald-500/20'
                  : isThinking
                  ? 'ring-8 ring-sky-500/30 animate-pulse'
                  : 'ring-4 ring-slate-200 dark:ring-slate-800'
              }`}
              style={{
                backgroundColor: isSpeaking
                  ? 'var(--btn-primary-bg)'
                  : isListening
                  ? '#16a34a'
                  : 'var(--btn-secondary-bg)',
                color: isSpeaking ? 'var(--btn-primary-text)' : '#ffffff'
              }}
            >
              {isThinking ? (
                <Sparkles className="w-10 h-10 animate-spin" />
              ) : isSpeaking ? (
                <Volume2 className="w-10 h-10 animate-pulse" />
              ) : isListening ? (
                <Mic className="w-10 h-10 animate-bounce" />
              ) : (
                <Bot className="w-10 h-10" />
              )}
            </div>

            {/* Live Indicator Pill */}
            <span
              className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full text-white shadow-xs ${
                isSpeaking
                  ? 'bg-orange-500'
                  : isListening
                  ? 'bg-emerald-500'
                  : isThinking
                  ? 'bg-sky-500'
                  : 'bg-slate-500'
              }`}
            >
              {isSpeaking
                ? 'Speaking'
                : isListening
                ? 'Listening'
                : isThinking
                ? 'Thinking...'
                : 'Ready'}
            </span>
          </div>

          {/* Canvas Soundwave Equalizer */}
          <canvas
            ref={canvasRef}
            width={320}
            height={44}
            className="w-72 h-11 mx-auto my-1"
          />

          {/* Spoken Status or Live Transcript */}
          <div className="min-h-12 flex items-center justify-center px-4 max-w-lg">
            {liveTranscript ? (
              <p className="text-sm font-semibold italic text-emerald-600 dark:text-emerald-400">
                "{liveTranscript}"
              </p>
            ) : isListening ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 animate-pulse">
                Listening to you... Speak naturally into your microphone.
              </p>
            ) : isSpeaking ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                  Coach Milo is speaking
                </span>
                <button
                  onClick={stopAllAudio}
                  className="px-2 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-bold hover:bg-rose-600 cursor-pointer flex items-center gap-1"
                >
                  <Square className="w-2.5 h-2.5 fill-white" />
                  <span>Interrupt</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tap the microphone below to start a live voice conversation.
              </p>
            )}
          </div>

          {errorNotice && (
            <div className="mt-2 text-xs font-semibold text-rose-500 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20 max-w-md">
              {errorNotice}
            </div>
          )}
        </div>

        {/* Scrollable Conversation History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 min-h-[160px] max-h-[300px]">
          {conversation.map((turn) => {
            const isUser = turn.sender === 'user';
            return (
              <div
                key={turn.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 font-bold"
                    style={{
                      backgroundColor: 'var(--btn-primary-bg)',
                      color: 'var(--btn-primary-text)'
                    }}
                  >
                    M
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl max-w-[82%] text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'rounded-tr-none'
                      : 'rounded-tl-none border border-slate-200/80 dark:border-slate-800/80'
                  }`}
                  style={
                    isUser
                      ? {
                          backgroundColor: 'var(--btn-secondary-bg)',
                          color: 'var(--btn-secondary-text)'
                        }
                      : {
                          backgroundColor: 'var(--app-bg-subtle, #f8fafc)',
                          color: 'var(--app-text-primary)'
                        }
                  }
                >
                  <p>{turn.text}</p>
                  <div className="mt-1 flex items-center justify-between text-[10px] opacity-70">
                    <span>{turn.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => speakText(turn.text)}
                        className="ml-2 hover:underline cursor-pointer flex items-center gap-1 font-bold"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Replay</span>
                      </button>
                    )}
                  </div>
                </div>
                {isUser && (
                  <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs shrink-0 font-bold">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={conversationEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-5 py-2.5 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none bg-slate-50/50 dark:bg-slate-950/20">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 shrink-0">
            Ask:
          </span>
          {sampleVoicePrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendVoiceMessage(prompt)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-orange-500 text-slate-700 dark:text-slate-300 hover:text-orange-500 whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Bottom Interactive Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Voice & Auto-Listen Settings */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
              <span>Voice:</span>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value as any)}
                className="px-2 py-1 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer"
              >
                <option value="Puck">Puck (Energetic)</option>
                <option value="Kore">Kore (Motivating)</option>
                <option value="Zephyr">Zephyr (Focused)</option>
                <option value="Fenrir">Fenrir (Bold)</option>
              </select>
            </div>

            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 cursor-pointer">
              <input
                type="checkbox"
                checked={autoListen}
                onChange={(e) => setAutoListen(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-orange-500 focus:ring-orange-500"
              />
              <span>Hands-free loop</span>
            </label>
          </div>

          {/* Big Tap to Speak Action Button */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isListening ? (
              <Button
                variant="destructive"
                size="md"
                fullWidth
                onClick={stopListening}
                leftIcon={<Square className="w-4 h-4 fill-white" />}
              >
                Done Speaking
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={startListening}
                isLoading={isThinking}
                loadingText="Coach Thinking..."
                leftIcon={<Mic className="w-4 h-4" />}
              >
                Tap to Speak
              </Button>
            )}

            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setConversation([
                  {
                    id: 'reset',
                    sender: 'coach',
                    text: "Conversation refreshed. What would you like to work on now?",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ]);
                stopAllAudio();
              }}
              title="Reset Voice Chat"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
