'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Loader2, Sparkles, RefreshCw, ShieldCheck, HelpCircle } from 'lucide-react';
import { useAccount } from 'wagmi';
import { OwnlyLogoMark } from '@/components/OwnlyLogo';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

/**
 * Sanitizes and cleans AI output so no raw markdown asterisks (**) or hashes (#) appear.
 * Renders bold segments as clean styled spans.
 */
function renderCleanContent(text: string) {
  if (!text) return null;

  // Clean raw markdown code blocks or header symbols
  let cleaned = text.replace(/###?\s*/g, '').replace(/```[\s\S]*?```/g, '');

  // Split by bold patterns (**text**)
  const parts = cleaned.split(/(\*\*.*?\*\*|\*.*?\*)/g);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const content = part.slice(2, -2);
      return (
        <strong key={idx} className="font-bold text-white">
          {content}
        </strong>
      );
    } else if (part.startsWith('*') && part.endsWith('*')) {
      const content = part.slice(1, -1);
      return (
        <em key={idx} className="italic text-monad-light">
          {content}
        </em>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

export const OwnlyChatWidget: React.FC = () => {
  const { isConnected } = useAccount();

  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: 'Hello! I am Ownly AI, your assistant for digital passports, IPFS document storage, and Monad Testnet verifications. How can I help you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // If user is not connected with Web3 wallet, do not display the chat widget
  if (!isConnected) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build message payload for API
      const conversationPayload = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));
      conversationPayload.push({ role: 'user', content: query });

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationPayload }),
      });

      if (!res.ok) {
        throw new Error('Failed to reach Ownly AI service');
      }

      const data = await res.json();
      let aiText = data.reply || 'I am ready to assist with your digital passports on Monad.';

      // Strip any residual raw asterisks if LLM produced them despite prompt
      aiText = aiText.replace(/\*\*/g, '');

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Chat widget error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'I apologize, but I encountered a momentary connection issue. Please feel free to ask again!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const QUICK_PROMPTS = [
    'How do I upload a document to IPFS?',
    'How does SHA-256 verification work?',
    'How to transfer product ownership?',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25 }}
            className="w-[360px] sm:w-[420px] h-[520px] rounded-2xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden mb-4 backdrop-blur-xl"
          >
            {/* Chat Window Header */}
            <div className="p-4 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-border flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="h-9 w-9 rounded-xl bg-monad-purple/20 border border-monad-purple/40 flex items-center justify-center">
                    <OwnlyLogoMark size={28} />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-zinc-950 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Ownly AI
                    <span className="px-1.5 py-0.5 rounded-full bg-monad-purple/10 text-monad-purple border border-monad-purple/30 text-[9px] font-semibold">
                      Assistant
                    </span>
                  </h3>
                  <p className="text-[10px] text-zinc-400">Monad Passport & IPFS Vault Guide</p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() =>
                    setMessages([
                      {
                        id: 'welcome-1',
                        sender: 'ai',
                        text: 'Hello! I am Ownly AI, your assistant for digital passports, IPFS document storage, and Monad Testnet verifications. How can I help you today?',
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      },
                    ])
                  }
                  title="Clear conversation"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat Message Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end space-x-2`}
                >
                  {msg.sender === 'ai' && (
                    <div className="h-6 w-6 rounded-lg bg-monad-purple/20 border border-monad-purple/40 flex items-center justify-center shrink-0 mb-1">
                      <Bot className="h-3.5 w-3.5 text-monad-purple" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 shadow-sm space-y-1 ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-monad-purple to-monad-darkPurple text-white rounded-br-none'
                        : 'bg-zinc-950 border border-border text-zinc-200 rounded-bl-none'
                    }`}
                  >
                    <div className="leading-relaxed whitespace-pre-wrap">{renderCleanContent(msg.text)}</div>
                    <span className="block text-[9px] opacity-60 text-right">{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center space-x-2 text-zinc-400">
                  <div className="h-6 w-6 rounded-lg bg-monad-purple/20 border border-monad-purple/40 flex items-center justify-center shrink-0">
                    <Loader2 className="h-3.5 w-3.5 text-monad-purple animate-spin" />
                  </div>
                  <div className="rounded-2xl bg-zinc-950 border border-border px-3.5 py-2 text-xs text-zinc-400 flex items-center gap-1.5">
                    <span>Ownly AI is thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Pills */}
            <div className="px-3 py-2 bg-zinc-950/60 border-t border-border flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[10px]">
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isLoading}
                  className="whitespace-nowrap rounded-lg bg-zinc-900 border border-border px-2.5 py-1 text-zinc-300 hover:text-white hover:border-monad-purple/50 transition-colors shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Footer Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-zinc-950 border-t border-border flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask Ownly AI anything about your vault..."
                disabled={isLoading}
                className="flex-1 rounded-xl bg-card border border-border px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-monad-purple"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="h-9 w-9 rounded-xl bg-gradient-to-r from-monad-purple to-monad-darkPurple hover:from-monad-light hover:to-monad-purple text-white flex items-center justify-center shadow-md shadow-monad-glow disabled:opacity-50 transition-all shrink-0"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button Launcher */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-monad-purple to-monad-darkPurple text-white font-bold text-xs shadow-xl shadow-monad-glow border border-monad-purple/50 transition-all duration-300"
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <>
            <div className="relative">
              <OwnlyLogoMark size={22} />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <span>Ownly AI Assistant</span>
          </>
        )}
      </motion.button>
    </div>
  );
};
