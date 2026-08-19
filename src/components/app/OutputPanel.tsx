import { Check, Copy, Download, RotateCcw } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function OutputPanel({
  value,
  onChange,
  onReset,
  filename,
  isLoading,
  error,
  emptyHint,
}: {
  value: string;
  onChange: (next: string) => void;
  onReset: () => void;
  filename: string;
  isLoading: boolean;
  error: string | null;
  emptyHint: string;
}) {
  const [copied, setCopied] = useState(false);

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

  return (
    <section className="surface-card flex min-h-[28rem] flex-col p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">AI draft</h2>
          <p className="text-xs text-muted-foreground">Fully editable before you use it.</p>
        </div>
        {value && !isLoading && (
          <div className="flex flex-wrap gap-2">
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
        <div className="mt-5 flex-1 animate-pulse space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-4 rounded bg-muted" style={{ width: `${95 - i * 6}%` }} />
          ))}
        </div>
      ) : value ? (
        <Textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-5 min-h-[24rem] flex-1 resize-y bg-card font-sans text-sm leading-relaxed"
          aria-label="Editable AI output"
        />
      ) : (
        <div className="mt-5 flex flex-1 items-center justify-center rounded-xl border border-dashed border-border px-6 text-center text-sm text-muted-foreground">
          {emptyHint}
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Responsible AI: this draft is a suggestion, not professional advice. Verify names, dates and
        figures before sending.
      </p>
    </section>
  );
}