const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

export type GatewayResult = { text: string };

export async function callGateway(system: string, prompt: string): Promise<GatewayResult> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured (missing API key).");

  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
    },
    body: JSON.stringify({
      model: "google/gemini-3.7-flash",
      stream: false,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    if (response.status === 429) {
      throw new Error("The AI service is busy right now. Please try again in a moment.");
    }
    if (response.status === 402) {
      throw new Error(
        "AI credits are exhausted for this workspace. Add credits in Lovable to continue.",
      );
    }
    if (response.status === 403) {
      throw new Error("AI access is blocked by workspace policy. Contact your workspace admin.");
    }
    throw new Error(`AI request failed (${response.status}). ${detail.slice(0, 300)}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("The AI returned an empty response. Please try again.");
  return { text };
}