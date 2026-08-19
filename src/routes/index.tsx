import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarClock,
  Mail,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";

import { AppLayout } from "@/components/app/AppLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate workplace tasks with AI: generate professional emails, plan and prioritise your day, and summarise research into actionable insights.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "One workspace for AI-drafted emails, prioritised daily plans and research briefs you can edit.",
      },
    ],
  }),
  component: Index,
});

const TOOLS = [
  {
    to: "/email" as const,
    icon: Mail,
    name: "Smart Email Generator",
    copy: "Professional email drafts in formal, casual, persuasive and other tones, with the key points you supply.",
  },
  {
    to: "/planner" as const,
    icon: CalendarClock,
    name: "AI Task Planner",
    copy: "Turn a messy list into a prioritised, time-blocked day with delegation and deferral advice.",
  },
  {
    to: "/research" as const,
    icon: BookOpenCheck,
    name: "AI Research Assistant",
    copy: "Summarise topics or pasted articles, then get insights, risks and concrete recommendations.",
  },
];

const STEPS = [
  { title: "Give a short brief", copy: "Structured fields turn into a carefully engineered prompt." },
  { title: "AI drafts the work", copy: "Consistent, professional output in a predictable format." },
  { title: "Edit and ship", copy: "Every draft is editable, copyable and exportable." },
];

function Index() {
  return (
    <AppLayout
      title="Dashboard"
      description="Your AI workspace for emails, planning and research."
    >
      <section className="surface-card relative overflow-hidden p-6 md:p-10">
        <div className="brand-gradient pointer-events-none absolute -right-24 -top-24 size-64 rounded-full opacity-15" />
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" />
          Powered by Lovable AI
        </span>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold text-foreground md:text-4xl">
          Automate the busywork, <span className="text-brand-gradient">keep the judgement</span>
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
          Three assistants for the tasks that eat a professional&apos;s day: writing emails, planning
          priorities and digesting information. Structured prompts in, editable drafts out.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/email">
              Draft an email <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/planner">Plan my day</Link>
          </Button>
        </div>
      </section>

      <section className="mt-6 grid gap-5 md:grid-cols-3">
        {TOOLS.map(({ to, icon: Icon, name, copy }) => (
          <Link
            key={to}
            to={to}
            className="surface-card group flex flex-col p-5 transition-shadow hover:shadow-[var(--shadow-elevated)]"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-foreground">{name}</h3>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{copy}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              Open tool
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="surface-card p-5 md:p-6">
          <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Wand2 className="size-4.5 text-primary" />
            How it works
          </h3>
          <ol className="mt-4 grid gap-4 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="rounded-xl border border-border bg-card p-4">
                <span className="text-xs font-semibold text-primary">Step {i + 1}</span>
                <p className="mt-1 text-sm font-medium text-foreground">{step.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{step.copy}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="surface-card p-5 md:p-6">
          <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <ShieldCheck className="size-4.5 text-primary" />
            Responsible AI
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>Every output is a draft for a human to review, edit and approve.</li>
            <li>AI can be wrong: verify names, dates, figures and commitments.</li>
            <li>Never paste confidential or personal data into prompts.</li>
            <li>Accountability for anything you send stays with you, not the model.</li>
          </ul>
        </div>
      </section>
    </AppLayout>
  );
}
