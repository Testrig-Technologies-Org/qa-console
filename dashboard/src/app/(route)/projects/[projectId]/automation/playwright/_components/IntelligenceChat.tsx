'use client';

import React, { useEffect, useRef, useState } from "react";
import { Bot, Coins, Loader2, Send, Sparkles, Square, ThumbsDown, ThumbsUp, User, Wrench } from "lucide-react";
import { askIntelligence, getChatHistory, getTokenUsageStats, submitChatFeedback } from "@/lib/chat";
import { cn } from "@/lib/utils";
import { ChatChart } from "./ChatChart";
import { chatChartKind } from "@/lib/chat-chart-types";

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  question?: string; // the user question this assistant message answered, needed for feedback
  toolCalls?: { name: string; args: Record<string, any>; result?: any }[];
  error?: boolean;
  feedback?: 'up' | 'down';
}

const SUGGESTIONS = [
  "What's the pass rate for this project over the last 7 days?",
  "What are the most flaky tests here?",
  "Chart the pass rate trend over the last 30 days",
  "Chart test count by browser",
];

interface IntelligenceChatProps {
  defaultQuestion?: string;
  projectId?: number;
  onChartPinned?: () => void;
}

export function IntelligenceChat({ projectId, onChartPinned }: IntelligenceChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<{ totalTokens: number; requests: number } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // askIntelligence runs as a server action — there's no signal to actually cancel the in-flight
  // Gemini/DB call server-side. Stop instead abandons the client's wait immediately (unblocks the
  // UI right away) and this ref lets the eventual real response get silently discarded rather than
  // popping into the chat after the user already gave up on it.
  const requestIdRef = useRef(0);
  const stopResolverRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const refreshUsage = () => {
    getTokenUsageStats(7).then((res) => {
      if (res.success) setUsage({ totalTokens: res.totalTokens ?? 0, requests: res.requests ?? 0 });
    });
  };

  useEffect(() => { refreshUsage(); }, []);

  useEffect(() => {
    setHistoryLoaded(false);
    getChatHistory(projectId).then((res) => {
      if (res.success) setMessages(res.messages as ChatMessage[]);
      setHistoryLoaded(true);
    });
  }, [projectId]);

  const send = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    const myRequestId = ++requestIdRef.current;
    const history = messages.map((m) => ({ role: m.role, text: m.text }));
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setLoading(true);

    const stopped = new Promise<'stopped'>((resolve) => {
      stopResolverRef.current = () => resolve('stopped');
    });

    try {
      const outcome = await Promise.race([
        askIntelligence(trimmed, history, projectId).then((res) => ({ kind: 'response' as const, res })),
        stopped.then((kind) => ({ kind })),
      ]);

      // A newer question (or another Stop) has already superseded this one — don't append a
      // late-arriving response into the middle of a conversation that's moved on.
      if (requestIdRef.current !== myRequestId) return;

      if (outcome.kind === 'stopped') {
        setMessages((prev) => [...prev, { role: 'assistant', text: 'Stopped.', error: true }]);
      } else if (outcome.res.success) {
        setMessages((prev) => [...prev, { role: 'assistant', text: outcome.res.text || '', question: trimmed, toolCalls: outcome.res.toolCalls }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', text: outcome.res.error || 'Something went wrong.', error: true }]);
      }
    } catch {
      if (requestIdRef.current === myRequestId) {
        setMessages((prev) => [...prev, { role: 'assistant', text: 'Failed to reach the assistant.', error: true }]);
      }
    } finally {
      if (requestIdRef.current === myRequestId) setLoading(false);
      stopResolverRef.current = null;
      refreshUsage();
    }
  };

  const handleStop = () => {
    stopResolverRef.current?.();
  };

  const rate = async (index: number, rating: 'up' | 'down') => {
    const msg = messages[index];
    if (!msg.question || msg.feedback) return;

    let comment: string | undefined;
    if (rating === 'down') {
      comment = window.prompt("What was wrong with this answer? (optional)") || undefined;
    }

    setMessages((prev) => prev.map((m, i) => (i === index ? { ...m, feedback: rating } : m)));
    await submitChatFeedback(msg.question, msg.text, rating, comment);
  };

  return (
    <div className="bg-background border border-border rounded-lg font-mono shadow-2xl overflow-hidden flex flex-col">
      <div className="px-6 py-3 border-b border-border bg-card/50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Sparkles size={14} className="text-indigo-500" />
          <span className="text-[10px] font-black text-foreground tracking-wide">Ask Intelligence</span>
        </div>
        {usage && usage.requests > 0 && (
          <span className="flex items-center gap-1.5 text-[9px] font-bold text-muted tracking-wide" title="LLM token usage, last 7 days">
            <Coins size={11} className="opacity-60" /> {usage.totalTokens.toLocaleString()} tokens · 7d
          </span>
        )}
      </div>

      <div ref={scrollRef} className="max-h-[420px] min-h-[160px] overflow-y-auto p-6 space-y-4">
        {historyLoaded && messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-[10px] text-muted font-bold tracking-wide opacity-60">
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
                    <span key={j} className="flex items-center gap-1 text-[8px] font-bold text-muted tracking-wide bg-muted/10 border border-border px-1.5 py-0.5 rounded">
                      <Wrench size={9} /> {tc.name}
                    </span>
                  ))}
                </div>
              )}
              {/* Only the LAST chart-capable call in this turn renders — if the model called
                  get_chart_data more than once (e.g. correcting itself mid-turn), showing every
                  call would display a stale/wrong chart alongside the right one. */}
              {(() => {
                const lastChart = m.toolCalls ? [...m.toolCalls].reverse().find((tc) => chatChartKind(tc.name, tc.args)) : undefined;
                return lastChart
                  ? <ChatChart name={lastChart.name} args={lastChart.args} result={lastChart.result} projectId={projectId} onPinned={onChartPinned} />
                  : null;
              })()}
              {m.role === 'assistant' && !m.error && m.question && (
                <div className="flex items-center gap-1.5 px-1">
                  <button
                    onClick={() => rate(i, 'up')}
                    disabled={!!m.feedback}
                    title="Good answer"
                    className={cn(
                      "p-1 rounded transition-colors disabled:cursor-default",
                      m.feedback === 'up' ? "text-emerald-500" : "text-muted/50 hover:text-emerald-500 disabled:hover:text-muted/50"
                    )}
                  >
                    <ThumbsUp size={11} />
                  </button>
                  <button
                    onClick={() => rate(i, 'down')}
                    disabled={!!m.feedback}
                    title="Bad answer"
                    className={cn(
                      "p-1 rounded transition-colors disabled:cursor-default",
                      m.feedback === 'down' ? "text-rose-500" : "text-muted/50 hover:text-rose-500 disabled:hover:text-muted/50"
                    )}
                  >
                    <ThumbsDown size={11} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 shrink-0 flex items-center justify-center rounded-full border bg-indigo-500/10 text-indigo-500 border-indigo-500/20">
              <Bot size={13} />
            </div>
            <div className="px-4 py-2.5 bg-card border border-border rounded-2xl rounded-tl-sm flex items-center gap-3 text-muted text-xs">
              <span className="flex items-center gap-2"><Loader2 size={12} className="animate-spin" /> Thinking...</span>
              <button
                onClick={handleStop}
                className="flex items-center gap-1 text-[9px] font-bold tracking-wide text-rose-500 hover:text-rose-400 transition-colors"
              >
                <Square size={9} fill="currentColor" /> Stop
              </button>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); if (!loading) send(input); }}
        className="border-t border-border p-3 flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this project's tests..."
          disabled={loading}
          className="flex-1 bg-background border border-border px-3 py-2.5 text-xs text-foreground outline-none focus:border-indigo-500 transition-all placeholder:text-muted/40 disabled:opacity-50"
        />
        {loading ? (
          <button
            type="button"
            onClick={handleStop}
            title="Stop"
            className="p-2.5 bg-rose-500/10 text-rose-500 border border-rose-500/30 hover:bg-rose-500/20 transition-all"
          >
            <Square size={14} fill="currentColor" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 bg-foreground text-background border border-foreground disabled:opacity-40 hover:opacity-90 transition-all"
          >
            <Send size={14} />
          </button>
        )}
      </form>
    </div>
  );
}
