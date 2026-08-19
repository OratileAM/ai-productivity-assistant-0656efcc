import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Plus, Sparkles, X } from "lucide-react";
import { useState } from "react";

import { AppLayout } from "@/components/app/AppLayout";
import { OutputPanel } from "@/components/app/OutputPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateEmail } from "@/lib/assistant.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | Workplace AI Assistant" },
      {
        name: "description",
        content:
          "Generate professional workplace emails in formal, casual, persuasive and other tones, then edit the draft before sending.",
      },
      { property: "og:title", content: "Smart Email Generator | Workplace AI Assistant" },
      {
        property: "og:description",
        content: "AI-drafted business emails with tone control and fully editable output.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Formal", "Casual", "Persuasive", "Friendly", "Apologetic", "Assertive", "Concise"];
const LENGTHS = ["Short", "Medium", "Detailed"];

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [purpose, setPurpose] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState("Formal");
  const [length, setLength] = useState("Medium");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (purpose.trim().length < 3) {
      setError("Describe what the email should achieve.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await run({ data: { recipient, cc, bcc, purpose, tone, length, keyPoints } });
      setOutput(result.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    void generate();
  };

  return (
    <AppLayout
      title="Smart Email Generator"
      description="Draft professional emails with the right tone in seconds."
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <form onSubmit={submit} className="surface-card space-y-5 p-5 md:p-6">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient / audience</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. Head of Operations, external client"
            />
          </div>

          <div className="space-y-3 rounded-xl border border-border bg-secondary/40 p-3">
            <div className="flex items-center justify-between gap-3">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Additional recipients
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline" size="sm" aria-label="Add recipient field">
                    <Plus className="size-4" />
                    Add
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => setShowCc(true)}>Cc</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setShowBcc(true)}>Bcc</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {!showCc && !showBcc && (
              <p className="text-xs text-muted-foreground">
                Use the add button to include Cc or Bcc recipients.
              </p>
            )}

            {showCc && (
              <div className="space-y-2">
                <Label htmlFor="cc">Cc</Label>
                <div className="flex gap-2">
                  <Input
                    id="cc"
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    placeholder="finance@company.com"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Remove Cc"
                    onClick={() => {
                      setShowCc(false);
                      setCc("");
                    }}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>
            )}

            {showBcc && (
              <div className="space-y-2">
                <Label htmlFor="bcc">Bcc</Label>
                <div className="flex gap-2">
                  <Input
                    id="bcc"
                    value={bcc}
                    onChange={(e) => setBcc(e.target.value)}
                    placeholder="records@company.com"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Remove Bcc"
                    onClick={() => {
                      setShowBcc(false);
                      setBcc("");
                    }}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Length</Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LENGTHS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">What should this email achieve?</Label>
            <Textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Request a two-week extension on the Q3 reporting deadline and propose a new timeline."
              className="min-h-28"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="points">Key points to include (optional)</Label>
            <Textarea
              id="points"
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              placeholder="- Data migration delayed one week&#10;- Draft ready 14 Sept&#10;- Offer a review call"
              className="min-h-24"
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loading ? "Drafting email..." : "Generate email"}
          </Button>
        </form>

        <OutputPanel
          value={output}
          onChange={setOutput}
          onReset={() => setOutput("")}
          filename="email-draft.txt"
          isLoading={loading}
          error={error}
          onRegenerate={() => void generate()}
          emptyHint="Fill in the brief and your editable email draft will appear here."
        />
      </div>
    </AppLayout>
  );
}
