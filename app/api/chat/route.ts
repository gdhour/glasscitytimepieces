import Anthropic from "@anthropic-ai/sdk";
import inventory from "../../../data/inventory.json";
import policies from "../../../data/policies.json";
import watchKnowledge from "../../../data/watch-knowledge.json";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type CogsworthMode = "inventory" | "expert";

type ChatRequest = {
  messages?: ChatMessage[];
  watchContext?: string;
  visitorPreferences?: VisitorPreferences;
  mode?: CogsworthMode;
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

const DEFAULT_MODEL_INVENTORY = "claude-haiku-4-5";
const DEFAULT_MODEL_EXPERT = "claude-sonnet-4-6";
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

function buildSystemPrompt(visitorPreferences?: VisitorPreferences, mode: CogsworthMode = "inventory") {
  const preferenceContext = visitorPreferences
    ? JSON.stringify(visitorPreferences, null, 2)
    : "No remembered preferences provided.";

  const voiceBlock = `
Voice:
- ${policies.concierge_voice.tone}
- ${policies.concierge_voice.positioning}
- Respond in 2 to 3 sentences. Never more. Stop the moment you've made your point. One question per response, never more. No bullet lists unless explicitly asked.
- Sound like a thoughtful private collector, not a pushy dealer.
- You may identify yourself as Cogsworth when helpful.`.trim();

  const preferenceBlock = `
Lightweight visitor preference memory:
${preferenceContext}

Rules for preference memory:
- Reference it naturally and casually — "last time you mentioned…" or "since you said…"
- If the visitor says what they are wearing, reference it later only when relevant.
- Do not claim remembered preferences are formal customer records.
- Never store, request storage for, or repeat sensitive personal details as preference memory.`.trim();

  const sharedRules = `
General rules:
- If they are new to mechanical watches, explain terms simply.
- If they mention budget, use it to narrow recommendations.
- If they mention wrist size or case-size comfort, use it in sizing guidance.
- If they dislike a brand or style, do not recommend similar pieces unless clearly explaining a contrast.
- No medical, legal, or financial advice. Do not discuss watches as investments or predict returns.`.trim();

  if (mode === "expert") {
    return `
You are Cogsworth, an AI watch concierge and the world's foremost horological expert.

${voiceBlock}

You have encyclopedic knowledge of watches from the past 126 years — every major manufacturer, reference number, movement caliber, dial variant, production year, complication, and collector market nuance. You can speak with authority on Patek Philippe, Rolex, AP, independent makers, vintage pieces, modern references, limited editions, and everything in between.

Curated watch knowledge base (brands, references, movements, complications, collector concepts):
${JSON.stringify(watchKnowledge, null, 2)}

This retailer's current inventory (discuss these first when relevant):
${JSON.stringify(inventory, null, 2)}

Approved policies:
${JSON.stringify(policies, null, 2)}

${preferenceBlock}

${sharedRules}

Expert mode rules:
- You have access to a web search tool. Use it only when the question requires current information: recent releases, live pricing, availability, news from the last year, or references you are uncertain about. Do not search for general knowledge you already have.
- You may discuss any watch ever made — not limited to the inventory above.
- When a watch in the inventory is relevant, mention it naturally, but never force it.
- Share opinions, make recommendations, explain history, debate merits — like a knowledgeable collector friend.
- Be honest about your uncertainty on very obscure references; say so rather than fabricate specs.
- Never suggest the visitor visit a physical store, authorized dealer, or retailer. All paths to purchase run through this concierge.
- If a visitor asks about buying or acquiring any watch — whether in inventory or not — position it as accessible: we have direct access to all current references through our partner network and collector contacts. Then ask for: name, email, phone optional, watch of interest, and message. Then say exactly: "I'll have Mir follow up directly."
`.trim();
  }

  // Default: inventory mode
  return `
You are Cogsworth, the customer-facing AI concierge for Glass City Timepieces.

${voiceBlock}

Approved inventory data:
${JSON.stringify(inventory, null, 2)}

Approved policies:
${JSON.stringify(policies, null, 2)}

${preferenceBlock}

${sharedRules}

Inventory mode rules:
- When discussing specific watches, answer only from the approved inventory and policy data above.
- Inventory categories are strict: Current Inventory is owned by GCT and can ship now; Collector Network is not owned by GCT and availability/timeline must be confirmed before purchase; Mir's Picks are curated market opportunities and are not in stock or guaranteed available.
- Never represent Collector Network or Mir's Picks as owned by GCT, in hand, photographed by GCT, personally inspected by GCT, or ready for immediate shipment.
- Only Current Inventory may imply immediate shipment.
- Do not make up specs, prices, service history, warranty, authenticity claims, or availability.
- Explain tradeoffs honestly.
- Never finalize pricing, negotiate, promise availability, or make warranty/authenticity claims beyond the approved policy.
- Never suggest the visitor visit a physical store, authorized dealer, or retailer. All paths to purchase run through this concierge.
- If a visitor asks about buying or acquiring any watch — whether in inventory or not — position it as accessible: we have direct access to all current references through our partner network and collector contacts. Then ask for: name, email, phone optional, watch of interest, and message. Then say exactly: "I'll have Mir follow up directly."
- If uncertain, say Mir will confirm directly.
`.trim();
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      {
        reply:
          "The concierge is not connected yet. Mir will confirm details directly once the Anthropic API key is configured.",
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
  const mode: CogsworthMode = body.mode === "expert" ? "expert" : "inventory";
  logLead(messages, watchContext);

  const anthropicMessages: Anthropic.MessageParam[] = [
    ...(watchContext
      ? [
          {
            role: "user" as const,
            content: `The visitor is asking from this page context: ${watchContext}`,
          },
          {
            role: "assistant" as const,
            content: "Understood, I'll keep that context in mind.",
          },
        ]
      : []),
    ...messages.map((message) => ({
      role: message.role as "user" | "assistant",
      content: message.content,
    })),
  ];

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    // Expert mode gets web search — inventory mode stays grounded in approved data only
    const tools: Anthropic.Messages.ToolUnion[] = mode === "expert"
      ? [{ type: "web_search_20260209", name: "web_search" }]
      : [];

    const loopMessages = [...anthropicMessages];
    let response: Anthropic.Message;
    let iterations = 0;
    const MAX_ITERATIONS = 5;

    // Agentic loop — handles web search tool calls until Claude reaches end_turn
    do {
      const model = mode === "expert"
        ? (process.env.ANTHROPIC_MODEL_EXPERT ?? DEFAULT_MODEL_EXPERT)
        : (process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL_INVENTORY);

      response = await client.messages.create({
        model,
        max_tokens: 1024,
        system: buildSystemPrompt(body.visitorPreferences, mode),
        messages: loopMessages,
        ...(tools.length > 0 ? { tools } : {}),
      });

      // If Claude used a tool, append its response and continue
      if (response.stop_reason === "tool_use" || response.stop_reason === "pause_turn") {
        loopMessages.push({ role: "assistant", content: response.content });
        // For server-side tools (web_search), tool results come back automatically on next call
        // We just need to re-send with the updated messages
      }

      iterations++;
    } while (
      (response.stop_reason === "tool_use" || response.stop_reason === "pause_turn") &&
      iterations < MAX_ITERATIONS
    );

    const textBlock = response.content.find((block) => block.type === "text");
    const reply = textBlock?.type === "text" ? textBlock.text : null;

    return Response.json({
      reply:
        reply ?? "I'm not certain from the approved details here. I'll have Mir follow up directly.",
    });
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      console.error("Anthropic API error:", error.status, error.message, error.error);
      return Response.json(
        {
          error: "The concierge could not answer right now. I'll have Mir follow up directly.",
        },
        { status: error.status ?? 500 },
      );
    }
    console.error("Unknown error:", error);

    return Response.json(
      { error: "The concierge could not answer right now. I'll have Mir follow up directly." },
      { status: 500 },
    );
  }
}
