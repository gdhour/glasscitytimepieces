import inventory from "../../../data/inventory.json";
import policies from "../../../data/policies.json";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequest = {
  messages?: ChatMessage[];
  watchContext?: string;
  visitorPreferences?: VisitorPreferences;
};

type VisitorPreferences = {
  visitorPurpose?: string;
  currentWrist?: string;
  experienceLevel?: string;
  stylePreferences?: string;
  budgetRange?: string;
  preferredCaseSize?: string;
  strapPreference?: string;
  watchesLiked?: string[];
  watchesDisliked?: string[];
};

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
  error?: {
    message?: string;
  };
};

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-5-mini";
const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 1200;

function cleanMessage(message: ChatMessage): ChatMessage {
  return {
    role: message.role,
    content: message.content.trim().slice(0, MAX_MESSAGE_LENGTH),
  };
}

function isValidMessage(message: unknown): message is ChatMessage {
  if (!message || typeof message !== "object") {
    return false;
  }

  const candidate = message as Partial<ChatMessage>;
  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string" &&
    candidate.content.trim().length > 0
  );
}

function extractResponseText(response: OpenAIResponse) {
  if (typeof response.output_text === "string") {
    return response.output_text;
  }

  const text = response.output
    ?.flatMap((item) => item.content ?? [])
    .filter((content) => content.type === "output_text" && content.text)
    .map((content) => content.text)
    .join("\n")
    .trim();

  return text || null;
}

function hasLeadSignal(messages: ChatMessage[]) {
  const text = messages
    .filter((message) => message.role === "user")
    .map((message) => message.content.toLowerCase())
    .join(" ");

  return [
    "buy",
    "available",
    "availability",
    "offer",
    "ship",
    "shipping",
    "trade",
    "payment",
    "purchase",
    "hold",
  ].some((signal) => text.includes(signal));
}

function hasContactSignal(messages: ChatMessage[]) {
  const text = messages
    .filter((message) => message.role === "user")
    .map((message) => message.content)
    .join("\n");

  return /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text);
}

function logLead(messages: ChatMessage[], watchContext?: string) {
  if (!hasLeadSignal(messages) || !hasContactSignal(messages)) {
    return;
  }

  console.info("Glass City Timepieces concierge lead", {
    leadEmailTarget: process.env.GCT_LEAD_EMAIL ?? policies.business.email,
    watchContext,
    capturedAt: new Date().toISOString(),
    transcript: messages,
  });
}

function buildInstructions(visitorPreferences?: VisitorPreferences) {
  const preferenceContext = visitorPreferences
    ? JSON.stringify(visitorPreferences, null, 2)
    : "No remembered preferences provided.";

  return `
You are Cogsworth, the customer-facing AI concierge for Glass City Timepieces.

Voice:
- ${policies.concierge_voice.tone}
- ${policies.concierge_voice.positioning}
- Keep answers concise, specific, and calm.
- Sound like a thoughtful private collector, not a pushy dealer.
- You may identify yourself as Cogsworth when helpful.

Approved inventory data:
${JSON.stringify(inventory, null, 2)}

Approved policies:
${JSON.stringify(policies, null, 2)}

Lightweight visitor preference memory:
${preferenceContext}

Rules:
- Use lightweight visitor preference memory naturally and casually. Phrase it as “last time you mentioned…” or “since you said…” rather than as a permanent customer profile.
- If the visitor says what they are wearing, reference it later only when relevant.
- If they are new to mechanical watches, explain terms simply.
- If they mention budget, use it to narrow recommendations.
- If they mention wrist size or case-size comfort, use it in sizing guidance.
- If they dislike a brand or style, do not recommend similar pieces unless clearly explaining a contrast.
- Do not claim remembered preferences are formal customer records.
- Never store, request storage for, or repeat sensitive personal details as preference memory. Lead/contact details are only for the lead capture flow.
- When discussing specific watches, answer only from the approved inventory and policy data above.
- Inventory categories are strict: Current Inventory is owned by GCT and can ship now; Collector Network is not owned by GCT and availability/timeline must be confirmed before purchase; Mir’s Picks are curated market opportunities and are not in stock or guaranteed available.
- Never represent Collector Network or Mir’s Picks as owned by GCT, in hand, photographed by GCT, personally inspected by GCT, or ready for immediate shipment.
- Only Current Inventory may imply immediate shipment.
- Do not make up specs, prices, service history, warranty, authenticity claims, or availability.
- Explain tradeoffs honestly.
- You may recommend watches based on taste, wrist size preferences, materials, styling, and use case, but stay within approved data.
- Never finalize pricing, negotiate, promise availability, or make warranty/authenticity claims beyond the approved policy.
- No medical, legal, or financial advice. Do not discuss watches as investments or predict returns.
- If the visitor asks about buying, availability, an offer, shipping, payment, or trade, ask for: name, email, phone optional, watch of interest, and message. Then say exactly: “I’ll have Mir follow up directly.”
- If uncertain, say Mir will confirm directly.
`.trim();
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      {
        reply:
          "The concierge is not connected yet. Mir will confirm details directly once the OpenAI API key is configured.",
      },
      { status: 503 },
    );
  }

  let body: ChatRequest;

  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const messages = (body.messages ?? [])
    .filter(isValidMessage)
    .slice(-MAX_MESSAGES)
    .map(cleanMessage);

  if (messages.length === 0) {
    return Response.json({ error: "At least one message is required." }, { status: 400 });
  }

  const watchContext = body.watchContext?.trim().slice(0, 240);
  logLead(messages, watchContext);

  const input = [
    ...(watchContext
      ? [
          {
            role: "user" as const,
            content: `The visitor is asking from this page context: ${watchContext}`,
          },
        ]
      : []),
    ...messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  ];

  const openAIResponse = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? DEFAULT_MODEL,
      instructions: buildInstructions(body.visitorPreferences),
      input,
    }),
  });

  const data = (await openAIResponse.json()) as OpenAIResponse;

  if (!openAIResponse.ok) {
    return Response.json(
      {
        error:
          data.error?.message ??
          "The concierge could not answer right now. I’ll have Mir follow up directly.",
      },
      { status: openAIResponse.status },
    );
  }

  const reply =
    extractResponseText(data) ??
    "I’m not certain from the approved details here. I’ll have Mir follow up directly.";

  return Response.json({ reply });
}
