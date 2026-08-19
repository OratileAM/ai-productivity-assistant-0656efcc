import { Check, Copy, Download, RefreshCw, RotateCcw } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const DAY_LINE = /^DAY\s*(\d{1,2})\s*(?:::|:|-|\|)\s*(.+)$/i;
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function parsePlan(value: string) {
  const days = new Map<number, string[]>();
  const notes: string[] = [];
  let inNotes = false;

  for (const raw of value.split("\n")) {
    const line = raw.trim().replace(/^[-*]\s*/, "");
    if (!line) continue;
    if (/^#{1,6}\s/.test(line)) {
      inNotes = true;
      notes.push(line.replace(/^#{1,6}\s*/, ""));
      continue;
    }
    const match = DAY_LINE.exec(line);
    if (match) {
      const day = Number(match[1]);
      const text = match[2]!.trim();
      const list = days.get(day) ?? [];
      list.push(text);
      days.set(day, list);
      inNotes = false;
      continue;
    }
    if (inNotes) notes.push(line);
  }

  return { days, notes };
}

export function MonthCalendarOutput({
  value,
  onChange,
  onReset,
  onRegenerate,
  filename,
  isLoading,
  error,
  emptyHint,
  month,
  year,
}: {
  value: string;
  onChange: (next: string) => void;
  onReset: () => void;
  onRegenerate: () => void;
  filename: string;
  isLoading: boolean;
  error: string | null;
  emptyHint: string;
  month: number;
  year: number;
}) {
  const [copied, setCopied] = useState(false);
  const [rawMode, setRawMode] = useState(false);
  const [activeDay, setActiveDay] = useState<number | null>(null);

  const { days, notes } = parsePlan(value);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const monthLabel = new Date(year, month, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const download = () => {
    const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateDay = (day: number, text: string) => {
    const next = new Map(days);
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length) next.set(day, lines);
    else next.delete(day);

    const serialized = [...next.entries()]
      .sort((a, b) => a[0] - b[0])
      .flatMap(([d, items]) => items.map((item) => `DAY ${d} :: ${item}`));
    if (notes.length) serialized.push("", "## Notes & Delegation", ...notes.slice(1).map((n) => `- ${n}`));
    onChange(serialized.join("\n"));
  };

  return (
    <section className="surface-card flex min-h-[28rem] flex-col p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">AI draft — {monthLabel}</h2>
          <p className="text-xs text-muted-foreground">
            Click any day to edit its plan directly in the calendar.
          </p>
        </div>
        {value && !isLoading && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setRawMode((v) => !v)}>
              {rawMode ? "Calendar view" : "Text view"}
            </Button>
            <Button variant="outline" size="sm" onClick={copy}>
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button variant="outline" size="sm" onClick={download}>
              <Download className="size-4" />
              Export
            </Button>
            <Button variant="ghost" size="sm" onClick={onReset}>
              <RotateCcw className="size-4" />
              Clear
            </Button>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {isLoading ? (
        <div className="mt-5 grid flex-1 grid-cols-7 gap-1.5">
          {[...Array(35)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-md bg-muted" />
          ))}
        </div>
      ) : !value ? (
        <div className="mt-5 flex flex-1 items-center justify-center rounded-xl border border-dashed border-border px-6 text-center text-sm text-muted-foreground">
          {emptyHint}
        </div>
      ) : rawMode ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-5 min-h-[24rem] flex-1 resize-y bg-card font-sans text-sm leading-relaxed"
          aria-label="Editable AI plan"
        />
      ) : (
        <div className="mt-5 flex-1">
          <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {WEEKDAYS.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="mt-1.5 grid grid-cols-7 gap-1.5">
            {[...Array(firstWeekday)].map((_, i) => (
              <div key={`pad-${i}`} className="rounded-md bg-muted/40" />
            ))}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const items = days.get(day) ?? [];
              const isActive = activeDay === day;
              return (
                <div
                  key={day}
                  className={`min-h-24 rounded-md border p-1.5 text-left transition-colors ${
                    items.length ? "border-primary/30 bg-accent/50" : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">{day}</span>
                    {!isActive && (
                      <button
                        type="button"
                        onClick={() => setActiveDay(day)}
                        className="text-[10px] text-primary hover:underline"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  {isActive ? (
                    <Textarea
                      autoFocus
                      defaultValue={items.join("\n")}
                      onBlur={(e) => {
                        updateDay(day, e.target.value);
                        setActiveDay(null);
                      }}
                      className="mt-1 min-h-20 resize-y bg-card text-[11px] leading-snug"
                      aria-label={`Plan for day ${day}`}
                    />
                  ) : (
                    <ul className="mt-1 space-y-1">
                      {items.map((item, idx) => (
                        <li key={idx} className="text-[11px] leading-snug text-muted-foreground">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          {notes.length > 1 && (
            <div className="mt-4 rounded-lg border border-border bg-secondary/40 p-3">
              <p className="text-sm font-semibold text-foreground">{notes[0]}</p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
                {notes.slice(1).map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex items-end justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Responsible AI: this draft is a suggestion, not professional advice. Verify names, dates
          and figures before sending.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRegenerate}
          disabled={isLoading}
          title="Edit again"
          className="shrink-0"
        >
          <RefreshCw className={isLoading ? "size-4 animate-spin" : "size-4"} />
          Edit again
        </Button>
      </div>
    </section>
  );
}
