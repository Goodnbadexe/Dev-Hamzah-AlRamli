'use client';

// === METADATA ===
// Purpose: Mobile terminal — now a first-class peer of the desktop terminal.
// Author: @Goodnbad.exe
// Why: Previously a hardcoded "Lite Edition" with ~9 canned commands and a
//   "switch to desktop" dead-end. Phone visitors could not discover easter eggs
//   or progress the CTF at all. This drives the SAME engine as desktop
//   (CommandProcessor + AuthManager + GameStateManager), so the full command
//   set, easter eggs, and CTF challenges work on mobile — and because game state
//   persists to a shared localStorage key, progress syncs across devices.
// Security: No secrets. Same client-only engine the desktop terminal uses.
// Complexity: O(1) per command (engine does the work).
// === END METADATA ===

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CommandProcessor } from '@/components/terminal/CommandProcessor';
import { AuthManager } from '@/components/terminal/auth/AuthManager';
import { GameStateManager } from '@/components/terminal/game/GameStateManager';
import type { TerminalContext, CommandResult } from '@/components/terminal/types';

interface MobileTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

type EntryType = 'input' | 'output' | 'success' | 'error' | 'warning' | 'info' | 'system';
interface HistoryEntry {
  content: string;
  type: EntryType;
}

// Directory map for ls/pwd — mirrors the desktop terminal's structure so the
// filesystem feels identical across surfaces.
const FILE_SYSTEM: Record<string, string[]> = {
  '~': ['projects', 'skills', 'experience', 'contact', 'certifications', 'README.md'],
  '~/projects': ['magic-browser.js', 'raining-characters.js', 'prompting-engineering.js', 'pixel-game.js', 'masarat-events.js', 'first-website.html'],
  '~/skills': ['security.txt', 'development.txt', 'leadership.txt', 'tools.txt'],
  '~/experience': ['masarat-events.md', 'masarat-decor.md', 'thunderquote.md', 'kabel.md'],
  '~/contact': ['email.txt', 'phone.txt', 'social.json'],
  '~/certifications': ['google-cybersecurity.cert', 'ibm-cybersecurity.cert', 'google-analytics.cert', 'taylors-award.cert'],
};

// Tappable shortcuts — mobile users explore by tapping, not typing.
const QUICK_COMMANDS = ['help', 'whoami', 'ls', 'hack', 'matrix', 'scan', 'ctf', 'stats', 'clear'];

const PROMPT = 'goodnbad@exe ~ $';

// Map an engine CommandResult.type to a rendered entry type.
function resultEntryType(t: CommandResult['type']): EntryType {
  switch (t) {
    case 'success': return 'success';
    case 'error':   return 'error';
    case 'warning': return 'warning';
    default:        return 'output';
  }
}

const TYPE_CLASS: Record<EntryType, string> = {
  input:   'text-emerald-500',
  output:  'text-emerald-300',
  success: 'text-emerald-400',
  error:   'text-red-400',
  warning: 'text-amber-400',
  info:    'text-cyan-300',
  system:  'text-emerald-600',
};

export function MobileTerminal({ isOpen, onClose }: MobileTerminalProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [ready, setReady] = useState(false);
  const [flash, setFlash] = useState(false);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);

  // Engine — instantiated once, client-side only (localStorage access).
  const procRef = useRef<CommandProcessor | null>(null);
  const authRef = useRef<AuthManager | null>(null);
  const gameRef = useRef<GameStateManager | null>(null);

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    procRef.current ??= new CommandProcessor();
    authRef.current ??= new AuthManager();
    gameRef.current ??= new GameStateManager();
    setReady(true);
  }, []);

  const banner = useCallback((): HistoryEntry[] => {
    const lvl = gameRef.current?.getGameState().level ?? 1;
    return [
      { type: 'system', content: 'GOODNBAD OS — mobile terminal [v2.0]' },
      { type: 'system', content: `level ${lvl} · progress syncs with desktop` },
      { type: 'output', content: "type 'help' · try 'hack', 'matrix', 'ctf', or 'stats'" },
      { type: 'output', content: '' },
    ];
  }, []);

  // Seed the banner once the engine is ready and the sheet is open.
  useEffect(() => {
    if (isOpen && ready && history.length === 0) setHistory(banner());
  }, [isOpen, ready, history.length, banner]);

  // Auto-scroll to newest output.
  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [history]);

  // Focus the input when opened.
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const id = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  const run = useCallback(async (raw: string) => {
    const command = raw;
    const promptLine: HistoryEntry = { type: 'input', content: `${PROMPT} ${command}` };

    if (!command.trim()) {
      setHistory((p) => [...p, promptLine]);
      setCurrentInput('');
      return;
    }

    // Up/down recall stack.
    setCmdHistory((p) => [command.trim(), ...p.filter((c) => c !== command.trim())].slice(0, 50));
    setHistIdx(-1);

    const proc = procRef.current;
    const auth = authRef.current;
    const game = gameRef.current;
    if (!proc || !auth || !game) {
      setHistory((p) => [...p, promptLine, { type: 'output', content: 'Terminal still initializing…' }]);
      setCurrentInput('');
      return;
    }

    const user = auth.getCurrentUser();
    const session = auth.getCurrentSession();
    if (!user || !session) {
      setHistory((p) => [...p, promptLine, { type: 'error', content: 'No active session. Reopen the terminal.' }]);
      setCurrentInput('');
      return;
    }

    // Same context shape the desktop terminal builds — handlers mutate
    // `gameManager`, which persists to the shared localStorage key.
    const context: TerminalContext = {
      user,
      session,
      behaviorTracker: {
        commandCounts: new Map<string, number>(),
        patterns: [],
        lastCommandTime: new Date(),
        consecutiveHelps: 0,
        discoveredSecrets: [],
      },
      gameState: game.getGameState(),
      currentDirectory: '~',
      fileSystem: FILE_SYSTEM,
      gameManager: game,
    };

    try {
      const result = await proc.executeCommand(command, context);

      // `clear` resets the screen back to the banner (matches desktop).
      if (result.type === 'clear') {
        setHistory(banner());
        setCurrentInput('');
        return;
      }

      const out: HistoryEntry[] = [promptLine];
      if (result.output) {
        const entryType = resultEntryType(result.type);
        for (const line of result.output.split('\n')) out.push({ type: entryType, content: line });
      }
      setHistory((p) => [...p, ...out]);

      // Lightweight mobile feedback for effect-bearing commands.
      if (result.triggerEffect || result.playSound === 'victory') {
        setFlash(true);
        setTimeout(() => setFlash(false), 240);
      }
    } catch (err: any) {
      setHistory((p) => [...p, promptLine, { type: 'error', content: `Error: ${err?.message ?? err}` }]);
    }

    setCurrentInput('');
  }, [banner]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(currentInput);
      return;
    }
    // Soft-keyboard arrow recall (hardware keyboards / tablets).
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHistIdx((i) => {
        const next = Math.min(i + 1, cmdHistory.length - 1);
        if (cmdHistory[next] !== undefined) setCurrentInput(cmdHistory[next]);
        return next;
      });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHistIdx((i) => {
        const next = Math.max(i - 1, -1);
        setCurrentInput(next === -1 ? '' : cmdHistory[next] ?? '');
        return next;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden">
      <div
        className={cn(
          'absolute inset-4 flex flex-col rounded-lg border bg-zinc-900 transition-colors duration-150',
          flash ? 'border-emerald-400 shadow-[0_0_40px_-8px_rgba(16,185,129,0.6)]' : 'border-emerald-500/30',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/30 p-4">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-bold text-emerald-400">Mobile Terminal</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close terminal">
            <X className="h-4 w-4 text-emerald-400" />
          </Button>
        </div>

        {/* Output */}
        <div
          ref={terminalRef}
          className="flex-1 overflow-auto bg-black/50 p-4 font-mono text-sm"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((entry, i) => (
            <div key={i} className={cn('mb-1 whitespace-pre-wrap break-words', TYPE_CLASS[entry.type])}>
              {entry.content}
            </div>
          ))}

          {/* Input line */}
          <div className="mt-2 flex min-h-[44px] items-center">
            <span className="mr-2 shrink-0 text-emerald-500">{PROMPT}</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={onKeyDown}
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              // text-base (16px) prevents iOS zoom-on-focus; 44px row = touch target.
              className="min-h-[44px] flex-1 border-none bg-transparent text-base text-emerald-300 caret-emerald-300 outline-none"
              placeholder="type a command…"
            />
          </div>
        </div>

        {/* Quick-command chips — tap to explore without typing */}
        <div className="flex flex-wrap gap-1.5 border-t border-emerald-500/30 p-3">
          {QUICK_COMMANDS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => run(c)}
              className="min-h-[36px] rounded border border-emerald-500/30 bg-emerald-950/40 px-2.5 font-mono text-xs text-emerald-300 transition-colors active:bg-emerald-900/60"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
