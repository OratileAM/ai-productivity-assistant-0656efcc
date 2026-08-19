import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

import { AppLayout } from "@/components/app/AppLayout";
import { OutputPanel } from "@/components/app/OutputPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateResearch } from "@/lib/assistant.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | Workplace AI Assistant" },
      {
        name: "description",
        content:
          "Summarise topics and articles, then get insights, risks and concrete recommendations you can edit and share.",
      },
      { property: "og:title", content: "AI Research Assistant | Workplace AI Assistant" },
      {
        property: "og:description",
        content: "Summaries, insights and recommendations for any workplace topic or article.",
      },
    ],
  }),
  component: ResearchPage,
});

const DEPTHS = ["Quick brief", "Balanced", "In-depth"];

function ResearchPage() {
  const run = useServerFn(generateResearch);
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [depth, setDepth] = useState("Balanced");
  const [source, setSource] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (topic.trim().length < 3) {
      setError("Enter a topic or research question.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await run({ data: { topic, source, depth, audience } });
      setOutput(result.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      title="AI Research Assistant"
      description="Summarise topics or articles and turn them into insights and recommendations."
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <form onSubmit={submit} className="surface-card space-y-5 p-5 md:p-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic or research question</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="How are mid-size firms adopting AI in HR operations?"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Depth</Label>
              <Select value={depth} onValueChange={setDepth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEPTHS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="audience">Audience (optional)</Label>
              <Input
                id="audience"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="Executive committee"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Article or notes to summarise (optional)</Label>
            <Textarea
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Paste the article text or meeting notes here for a grounded summary."
              className="min-h-48"
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loading ? "Researching..." : "Summarise & advise"}
          </Button>
        </form>

        <OutputPanel
          value={output}
          onChange={setOutput}
          onReset={() => setOutput("")}
          filename="research-brief.md"
          isLoading={loading}
          error={error}
          emptyHint="Add a topic or paste an article to get a summary, insights and recommendations."
        />
      </div>
    </AppLayout>
  );
}