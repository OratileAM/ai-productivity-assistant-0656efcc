import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { callGateway } from "./ai.server";
import { buildEmailPrompt, buildPlannerPrompt, buildResearchPrompt } from "./prompts";

const EmailInput = z.object({
  recipient: z.string().max(200).optional().default(""),
  cc: z.string().max(500).optional().default(""),
  bcc: z.string().max(500).optional().default(""),
  purpose: z.string().min(3).max(4000),
  tone: z.string().min(2).max(40),
  length: z.string().min(2).max(40),
  keyPoints: z.string().max(4000).optional().default(""),
});

const PlannerInput = z.object({
  role: z.string().max(200).optional().default(""),
  workHours: z.string().max(100).optional().default("09:00 - 17:00"),
  tasks: z.string().min(3).max(6000),
  month: z.string().max(20).optional().default("January"),
  year: z.string().max(10).optional().default("2026"),
});

const ResearchInput = z.object({
  topic: z.string().min(3).max(500),
  source: z.string().max(20000).optional().default(""),
  depth: z.string().max(40).optional().default("Balanced"),
  audience: z.string().max(200).optional().default(""),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const { system, prompt } = buildEmailPrompt(data);
    return callGateway(system, prompt);
  });

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlannerInput.parse(input))
  .handler(async ({ data }) => {
    const { system, prompt } = buildPlannerPrompt(data);
    return callGateway(system, prompt);
  });

export const generateResearch = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchInput.parse(input))
  .handler(async ({ data }) => {
    const { system, prompt } = buildResearchPrompt(data);
    return callGateway(system, prompt);
  });