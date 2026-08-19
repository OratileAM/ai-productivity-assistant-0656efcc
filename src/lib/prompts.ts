const RESPONSIBLE_AI =
  "Never invent facts, names, figures, quotes, or citations. If information is missing, mark it clearly with a bracketed placeholder such as [confirm date]. Keep language inclusive, professional, and free of sensitive personal data.";

export function buildEmailPrompt(input: {
  recipient: string;
  cc?: string;
  bcc?: string;
  purpose: string;
  tone: string;
  length: string;
  keyPoints: string;
}) {
  const system = [
    "You are an expert workplace communication assistant writing business email drafts.",
    "Always return: an optional 'Cc:' and 'Bcc:' line when recipients are supplied, then a line starting with 'Subject:' followed by the email body.",
    "Use plain text, no markdown headings, no commentary about yourself.",
    RESPONSIBLE_AI,
  ].join(" ");

  const prompt = [
    `Recipient / audience: ${input.recipient || "not specified"}`,
    input.cc ? `Cc: ${input.cc}` : "",
    input.bcc ? `Bcc: ${input.bcc}` : "",
    `Tone: ${input.tone}`,
    `Length: ${input.length}`,
    `Purpose of the email: ${input.purpose}`,
    input.keyPoints ? `Key points that must appear:\n${input.keyPoints}` : "",
    "Write one polished email draft with a clear subject line, greeting, structured body, a specific call to action, and a professional sign-off using [Your Name].",
  ]
    .filter(Boolean)
    .join("\n\n");

  return { system, prompt };
}

export function buildPlannerPrompt(input: {
  role: string;
  workHours: string;
  tasks: string;
  month: string;
  year: string;
}) {
  const system = [
    "You are an executive productivity planner building MONTHLY plans for managers and professionals.",
    "Return ONLY lines in this exact machine-readable format, one per planned calendar day: 'DAY <day number> :: <priority label> - <time block> - <task>'. Use several lines for the same day when needed. Priority labels are Critical/High/Medium/Low.",
    "After the day lines, you may add a final section starting with '## Notes & Delegation' containing bullets on what to delegate, defer or drop.",
    "Respect realistic limits: keep each day achievable, include buffer time, and spread deadlines sensibly across the month.",
    RESPONSIBLE_AI,
  ].join(" ");

  const prompt = [
    `Role: ${input.role || "professional"}`,
    `Month being planned: ${input.month} ${input.year}`,
    `Available working hours: ${input.workHours || "09:00 - 17:00"}`,
    `Tasks, meetings and deadlines (each line is 'Day <number> | <task>'):\n${input.tasks}`,
    "Build the plan across the days of that month, keeping tasks on the day supplied where one is given.",
  ]
    .filter(Boolean)
    .join("\n\n");

  return { system, prompt };
}

export function buildResearchPrompt(input: {
  topic: string;
  source: string;
  depth: string;
  audience: string;
}) {
  const system = [
    "You are a rigorous business research analyst.",
    "Return markdown with these sections: '## Summary' (3-5 sentences), '## Key Insights' (bullets), '## Opportunities & Risks' (two short bullet lists), '## Recommendations' (numbered, action oriented), '## Open Questions' (bullets on what still needs verification).",
    "When source text is provided, ground every claim in it and say so when the source does not cover something.",
    RESPONSIBLE_AI,
  ].join(" ");

  const prompt = [
    `Topic or question: ${input.topic}`,
    `Depth: ${input.depth || "Balanced"}`,
    input.audience ? `Audience: ${input.audience}` : "",
    input.source ? `Source material to summarise:\n"""\n${input.source}\n"""` : "No source text supplied — rely on general, widely accepted knowledge and flag uncertainty.",
  ]
    .filter(Boolean)
    .join("\n\n");

  return { system, prompt };
}