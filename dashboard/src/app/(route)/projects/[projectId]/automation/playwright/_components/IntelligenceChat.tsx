'use client';

import React, { useEffect, useRef, useState } from "react";
import { Bot, Loader2, Send, Sparkles, User, Wrench } from "lucide-react";
import { askIntelligence } from "@/lib/chat";
import { cn } from "@/lib/utils";
import { ChatChart } from "./ChatChart";

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  toolCalls?: { name: string; args: Record<string, any>; result?: any }[];
  error?: boolean;
}

const SUGGESTIONS = [
  "What's the pass rate for this project over the last 7 days?",
  "What are the most flaky tests here?",
  "What's currently failing?",
  "Chart the pass rate trend over the last 30 days",
];

export function IntelligenceChat({ defaultQuestion }: { defaultQuestion?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    const history = messages.map((m) => ({ role: m.role, text: m.text }));
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setLoading(true);

    try {
      const res = await askIntelligence(trimmed, history);
      if (res.success) {
        setMessages((prev) => [...prev, { role: 'assistant', text: res.text || '', toolCalls: res.toolCalls }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', text: res.error || 'Something went wrong.', error: true }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Failed to reach the assistant.', error: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background border border-border rounded-none font-mono shadow-2xl overflow-hidden flex flex-col">
      <div className="px-6 py-3 border-b border-border bg-card/50 flex items-center gap-3">
        <Sparkles size={14} className="text-indigo-500" />
        <span className="text-[10px] font-black text-foreground uppercase tracking-[0.3em]">Ask_Intelligence</span>
      </div>

      <div ref={scrollRef} className="max-h-[420px] min-h-[160px] overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-[10px] text-muted font-bold uppercase tracking-widest opacity-60">
              Ask about pass rates, flaky tests, recent builds, or failures for this project.
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[10px] px-3 py-1.5 border border-border bg-card/50 text-muted hover:text-foreground hover:border-indigo-500/40 transition-colors rounded-full"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={cn("flex gap-3", m.role === 'user' && "flex-row-reverse")}>
            <div className={cn(
              "w-7 h-7 shrink-0 flex items-center justify-center rounded-full border",
              m.role === 'user' ? "bg-foreground text-background border-foreground" : "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
            )}>
              {m.role === 'user' ? <User size={13} /> : <Bot size={13} />}
            </div>
            <div className={cn("max-w-[80%] w-full space-y-1.5", m.role === 'user' ? "items-end flex flex-col" : "")}>
              <div className={cn(
                "px-4 py-2.5 text-xs leading-relaxed whitespace-pre-wrap",
                m.role === 'user'
                  ? "bg-foreground text-background rounded-2xl rounded-tr-sm"
                  : m.error
                    ? "bg-rose-500/5 border border-rose-500/20 text-rose-600 dark:text-rose-500 rounded-2xl rounded-tl-sm"
                    : "bg-card border border-border text-foreground rounded-2xl rounded-tl-sm"
              )}>
                {m.text}
              </div>
              {m.toolCalls && m.toolCalls.length > 0 && (
                <div className="flex flex-wrap gap-1.5 px-1">
                  {m.toolCalls.map((tc, j) => (
                    <span key={j} className="flex items-center gap-1 text-[8px] font-bold text-muted uppercase tracking-widest bg-muted/10 border border-border px-1.5 py-0.5 rounded">
                      <Wrench size={9} /> {tc.name}
                    </span>
                  ))}
                </div>
              )}
              {m.toolCalls?.map((tc, j) => <ChatChart key={j} name={tc.name} result={tc.result} />)}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 shrink-0 flex items-center justify-center rounded-full border bg-indigo-500/10 text-indigo-500 border-indigo-500/20">
              <Bot size={13} />
            </div>
            <div className="px-4 py-2.5 bg-card border border-border rounded-2xl rounded-tl-sm flex items-center gap-2 text-muted text-xs">
              <Loader2 size={12} className="animate-spin" /> Thinking...
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="border-t border-border p-3 flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this project's tests..."
          disabled={loading}
          className="flex-1 bg-background border border-border px-3 py-2.5 text-xs text-foreground outline-none focus:border-indigo-500 transition-all placeholder:text-muted/40 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2.5 bg-foreground text-background border border-foreground disabled:opacity-40 hover:opacity-90 transition-all"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
