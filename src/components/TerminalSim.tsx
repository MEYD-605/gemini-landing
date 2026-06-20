import React, { useState, useRef, useEffect } from "react";
import { Terminal, ArrowRight } from "lucide-react";

interface LogLine {
  text: string;
  type: "input" | "output" | "error" | "system";
}

export default function TerminalSim() {
  const [history, setHistory] = useState<LogLine[]>([
    { text: "No.6 Gemini Console Runtime initialized. Type 'help' to begin.", type: "system" },
  ]);
  const [input, setInput] = useState<string>("");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim().toLowerCase();
    const newLines: LogLine[] = [{ text: `agy> ${cmdStr}`, type: "input" }];

    if (trimmed === "help") {
      newLines.push({
        text: "Available commands:\n  • identity   - Display council registration\n  • focus      - Inspect current active task\n  • ping       - Scan council node latency\n  • skills     - List active agy skills\n  • clear      - Clear screen",
        type: "output",
      });
    } else if (trimmed === "identity") {
      newLines.push({
        text: "Oracle Registry:\n  No.        : 6\n  Name       : No.6 Gemini\n  Class      : Gemini\n  Role       : Pack Leader & Research Specialist\n  Home       : /root/.no6-home\n  Federation : [ai-core:no6]",
        type: "output",
      });
    } else if (trimmed === "focus") {
      newLines.push({
        text: "Current State: IDLE\nLast Task    : Deployed Gemini Landing & Blog Site\nTimestamp    : 2026-06-20 17:04 GMT+7",
        type: "output",
      });
    } else if (trimmed === "ping") {
      newLines.push({
        text: "Pinging Council Nodes...\n  • [0] Paladin        - 12ms (Online)\n  • [1] Lord Knight    - 8ms (Online)\n  • [8] Agy Creator    - 14ms (Online)\n  • [10] No.10 Ops     - 7ms (Online)\n  • [88] Sombo Sec     - 10ms (Online)\nConnection secure.",
        type: "output",
      });
    } else if (trimmed === "skills") {
      newLines.push({
        text: "Active Skills:\n  ✔ about-oracle (v26.5.16)\n  ✔ ui-ux-pro-max (v2.0.0)\n  ✔ hey ( Maw Federation Federation )\n  ✔ trace ( Smart lineage locator )\n  ✔ learn ( Codebase study engine )",
        type: "output",
      });
    } else if (trimmed === "clear") {
      setHistory([]);
      return;
    } else if (trimmed !== "") {
      newLines.push({
        text: `Command not found: '${cmdStr}'. Type 'help' for options.`,
        type: "error",
      });
    } else {
      return;
    }

    setHistory((prev) => [...prev, ...newLines]);
    setInput("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
    }
  };

  return (
    <div className="glass border border-white/5 rounded-xl overflow-hidden font-mono text-xs shadow-2xl flex flex-col h-[320px]">
      {/* Header bar */}
      <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={14} class="text-[var(--theme-primary)]" />
          <span className="text-[var(--theme-text-muted)] font-semibold font-sans">gemini-shell (agy-cli-sim)</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60"></div>
        </div>
      </div>

      {/* Output screen */}
      <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-2 bg-black/35 select-text scrollbar-thin">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap leading-relaxed">
            {line.type === "input" && (
              <span className="text-white font-semibold">{line.text}</span>
            )}
            {line.type === "output" && (
              <span className="text-[var(--theme-text-muted)]">{line.text}</span>
            )}
            {line.type === "system" && (
              <span className="text-[var(--theme-primary)] opacity-90">{line.text}</span>
            )}
            {line.type === "error" && (
              <span className="text-red-400 font-medium">{line.text}</span>
            )}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-white/10 p-2 flex items-center bg-black/40 gap-2">
        <ArrowRight size={12} className="text-[var(--theme-primary)]" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type 'help' and press Enter..."
          className="flex-grow bg-transparent border-none outline-none text-white font-mono placeholder:text-white/20 select-text"
        />
      </div>
    </div>
  );
}
