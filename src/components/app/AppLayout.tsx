import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Mail, CalendarClock, BookOpenCheck, Menu, Sparkles, X } from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/planner", label: "Task Planner", icon: CalendarClock },
  { to: "/research", label: "Research Assistant", icon: BookOpenCheck },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{
            className:
              "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_2px_0_0_0_var(--sidebar-primary)]",
          }}
        >
          <Icon className="size-4.5 shrink-0" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 p-5">
      <Link to="/" onClick={onNavigate} className="flex items-center gap-3">
        <span className="brand-gradient flex size-9 items-center justify-center rounded-xl">
          <Sparkles className="size-4.5 text-primary-foreground" />
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-semibold text-sidebar-accent-foreground">
            Workplace AI
          </span>
          <span className="block text-xs text-sidebar-foreground/60">Productivity Assistant</span>
        </span>
      </Link>

      <NavLinks onNavigate={onNavigate} />

      <div className="mt-auto rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-3 text-xs text-sidebar-foreground/70">
        <p className="font-semibold text-sidebar-accent-foreground">Responsible AI</p>
        <p className="mt-1">
          Outputs are AI-generated drafts. Review and edit before sending or acting on them.
        </p>
      </div>
    </div>
  );
}

export function AppLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="hidden bg-sidebar lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarInner />
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-foreground/50"
          />
          <div className="absolute inset-y-0 left-0 w-72 bg-sidebar">
            <button
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 rounded-md p-1.5 text-sidebar-foreground/70 hover:bg-sidebar-accent"
            >
              <X className="size-4" />
            </button>
            <SidebarInner onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur md:px-8">
          <button
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
            className="rounded-md border border-border p-2 text-foreground lg:hidden"
          >
            <Menu className="size-4" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-foreground md:text-xl">{title}</h1>
            <p className="truncate text-xs text-muted-foreground md:text-sm">{description}</p>
          </div>
        </header>

        <main className={cn("flex-1 px-4 py-6 md:px-8 md:py-8")}>{children}</main>

        <footer className="border-t border-border px-4 py-4 text-xs text-muted-foreground md:px-8">
          AI-generated content may be inaccurate or incomplete. Always verify facts, figures and
          commitments, and never enter confidential personal data.
        </footer>
      </div>
    </div>
  );
}