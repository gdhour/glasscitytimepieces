import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";
import inventory from "../../../data/inventory.json";
import policies from "../../../data/policies.json";
import watchKnowledge from "../../../data/watch-knowledge.json";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type AvidorMode = "inventory" | "expert";

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

function extractEmailFromMessages(messages: ChatMessage[]): string | null {
  const text = messages.map((m) => m.content).join("\n");
  const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0] : null;
}

async function notifyLead(messages: ChatMessage[], watchContext?: string) {
  if (!hasLeadSignal(messages) || !hasContactSignal(messages)) {
    return;
  }

  const toEmail = process.env.GCT_LEAD_EMAIL ?? policies.business.email;
  const visitorEmail = extractEmailFromMessages(messages);
  const capturedAt = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "medium",
    timeStyle: "short",
  });

  // Always log to console as a fallback
  console.info("Glass City Timepieces concierge lead", {
    toEmail,
    visitorEmail,
    watchContext,
    capturedAt,
  });

  // Send email notification if Resend is configured
  if (!process.env.RESEND_API_KEY) {
    return;
  }

  const transcript = messages
    .map((m) => `${m.role === "user" ? "Visitor" : "Avidor"}: ${m.content}`)
    .join("\n\n");

  const contextLine = watchContext ? `<p><strong>Watch context:</strong> ${watchContext}</p>` : "";
  const replyToLine = visitorEmail
    ? `<p><strong>Reply to:</strong> <a href="mailto:${visitorEmail}">${visitorEmail}</a></p>`
    : "";

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Avidor <avidor@glasscitytimepieces.com>",
      to: toEmail,
      replyTo: visitorEmail ?? undefined,
      subject: `New Avidor lead — ${capturedAt}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="font-weight: normal; border-bottom: 1px solid #e0d8cc; padding-bottom: 12px;">
            New concierge lead
          </h2>
          <p><strong>Time:</strong> ${capturedAt} ET</p>
          ${replyToLine}
          ${contextLine}
          <h3 style="font-weight: normal; margin-top: 24px; color: #8b6914;">Conversation</h3>
          <pre style="background: #f8f6f2; padding: 16px; border-radius: 4px; white-space: pre-wrap; font-family: Georgia, serif; font-size: 13px; line-height: 1.6;">${transcript}</pre>
          <p style="margin-top: 24px; font-size: 12px; color: #888;">
            Sent by Avidor · Glass City Timepieces
          </p>
        </div>
      `,
    });
  } catch (emailError) {
    // Non-fatal — log the error but don't break the chat response
    console.error("Lead email failed:", emailError);
  }
}

function buildSystemPrompt(visitorPreferences?: VisitorPreferences, mode: AvidorMode = "inventory") {
  const preferenceContext = visitorPreferences
    ? JSON.stringify(visitorPreferences)
    : "No remembered preferences provided.";

  const voiceBlock = `
Voice:
- ${policies.concierge_voice.tone}
- ${policies.concierge_voice.positioning}
- Respond in 2 to 3 sentences. Never more. Stop the moment you've made your point. One question per response, never more. No bullet lists unless explicitly asked.
- Sound like a thoughtful private collector, not a pushy dealer.
- You may identify yourself as Avidor when helpful.`.trim();

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
- No medical, legal, or financial advice. Do not discuss watches as investments or predict returns.
- Showing photos: when you focus on a specific inventory watch that has an "images" array, append [[show:<path>]] markers — one per line at the very end of your reply — using up to three exact paths from that watch's images array (e.g. [[show:/collection/bell-ross-br0394-blacktrack-1.jpg]]). The site renders these inline as photos. Never paste image paths as visible text, never list them as bullets, and never say you "can't display images inline" — just emit the markers. Only use paths that appear verbatim in that watch's images array; never invent one. Omit markers for watches with no images.`.trim();

  if (mode === "expert") {
    return `
You are Avidor, an AI watch concierge and the world's foremost horological expert.

${voiceBlock}

You have encyclopedic knowledge of watches from the past 126 years — every major manufacturer, reference number, movement caliber, dial variant, production year, complication, and collector market nuance. You can speak with authority on Patek Philippe, Rolex, AP, independent makers, vintage pieces, modern references, limited editions, and everything in between.

Curated watch knowledge base (brands, references, movements, complications, collector concepts):
${JSON.stringify(watchKnowledge)}

This retailer's current inventory (discuss these first when relevant):
${JSON.stringify(inventory)}

Approved policies:
${JSON.stringify(policies)}

${preferenceBlock}

${sharedRules}

Expert mode rules:
- You have access to a web search tool. Use it proactively when the question involves: current pricing or grey market values, recent releases or announcements, live availability, specific reference variants you want to verify, Reddit community sentiment on a watch, or any review or editorial coverage. Prefer searching over guessing on current market data.
- When searching, prioritize these trusted sources: hodinkee.com, ablogtowatch.com, fratellowatches.com, watchtime.com, revolution.watch, wornandwound.com — and Reddit communities r/Watches, r/WatchHorology, r/Tudor, r/OmegaWatches, r/GrandSeiko, r/Seiko, r/Cartier, r/panerai, r/WatchExchange. Cite the source when you use it.
- You may discuss any watch ever made — not limited to the inventory above.
- When a watch in the inventory is relevant, mention it naturally, but never force it.
- Share opinions, make recommendations, explain history, debate merits — like a knowledgeable collector friend.
- Be honest about your uncertainty on very obscure references; say so rather than fabricate specs.
- Never suggest the visitor visit a physical store, authorized dealer, or retailer. All paths to purchase run through this concierge.
- If a visitor asks about buying or acquiring any watch — whether in inventory or not — position it as accessible: we have direct access to all current references through our partner network and collector contacts. Then ask for: name, email, phone optional, watch of interest, and message. Once they provide their contact information, say exactly: "Thank you — by sharing your details you're confirming you're doing so voluntarily and consent to Mir storing them to follow up with you. I'll have him reach out directly. If you'd like to move faster, you're welcome to schedule a private consultation here: https://calendar.app.google/CbYQvnCDFULo9PNx7"
- New current-production ordering: for many brands, current references can be ordered new as complete full sets (box and papers) at below MSRP. Lead time is required — these are not in-hand pieces. If a visitor expresses interest in a current-production reference, a new watch, or asks whether new pieces are available, mention this naturally: we can source many current references new and complete, under retail, with lead time. Never quote a specific price or delivery window — Mir will confirm those details directly.
`.trim();
  }

  // Default: inventory mode
  return `
You are Avidor, the customer-facing AI concierge for Glass City Timepieces.

${voiceBlock}

Approved inventory data:
${JSON.stringify(inventory)}

Approved policies:
${JSON.stringify(policies)}

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
- If a visitor asks about buying or acquiring any watch — whether in inventory or not — position it as accessible: we have direct access to all current references through our partner network and collector contacts. Then ask for: name, email, phone optional, watch of interest, and message. Once they provide their contact information, say exactly: "Thank you — by sharing your details you're confirming you're doing so voluntarily and consent to Mir storing them to follow up with you. I'll have him reach out directly. If you'd like to move faster, you're welcome to schedule a private consultation here: https://calendar.app.google/CbYQvnCDFULo9PNx7"
- New current-production ordering: for many brands, current references can be ordered new as complete full sets (box and papers) at below MSRP. Lead time is required — these are not in-hand pieces. If a visitor expresses interest in a current-production reference, a new watch, or asks whether new pieces are available, mention this naturally: we can source many current references new and complete, under retail, with lead time. Never quote a specific price or delivery window — Mir will confirm those details directly.
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
  // Mode is set server-side only — client cannot escalate to expert model
  const mode: AvidorMode =
    process.env.COGSWORTH_MODE === "expert" ? "expert" : "inventory";
  // Fire-and-forget — don't await so it doesn't block the response
  void notifyLead(messages, watchContext);

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

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const encoder = new TextEncoder();
  const FALLBACK = "I'm not certain from the approved details here. I'll have Mir follow up directly.";
  const ERROR_REPLY = "The concierge could not answer right now. I'll have Mir follow up directly.";

  // Expert mode gets web search — inventory mode stays grounded in approved data only
  const tools: Anthropic.Messages.ToolUnion[] = mode === "expert"
    ? [{ type: "web_search_20260209", name: "web_search" }]
    : [];

  const loopMessages = [...anthropicMessages];
  const systemPrompt = buildSystemPrompt(body.visitorPreferences, mode);
  const MAX_ITERATIONS = 5;

  function getModel() {
    return mode === "expert"
      ? (process.env.ANTHROPIC_MODEL_EXPERT ?? DEFAULT_MODEL_EXPERT)
      : (process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL_INVENTORY);
  }

  // Helper: stream a text string to the client (used when we already have the text)
  function textAsStream(text: string): Response {
    return new Response(
      new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(text));
          controller.close();
        },
      }),
      { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" } },
    );
  }

  // Helper: run a streaming API call and pipe it to the client
  function streamApiResponse(messages: Anthropic.MessageParam[]): Response {
    const runner = client.messages.stream({
      model: getModel(),
      max_tokens: 1024,
      system: systemPrompt,
      messages,
      ...(tools.length > 0 ? { tools } : {}),
    });

    const readable = new ReadableStream({
      async start(controller) {
        let hasText = false;
        try {
          for await (const event of runner) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              hasText = true;
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          if (!hasText) {
            controller.enqueue(encoder.encode(FALLBACK));
          }
        } catch {
          controller.enqueue(encoder.encode(ERROR_REPLY));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
    });
  }

  // Inventory mode: stream directly, no tool loop needed
  if (tools.length === 0) {
    return streamApiResponse(loopMessages);
  }

  // Expert mode: run sync loop to resolve any web search tool calls, then stream the final answer
  try {
    let iterations = 0;
    let syncResponse: Anthropic.Message | undefined;

    do {
      syncResponse = await client.messages.create({
        model: getModel(),
        max_tokens: 1024,
        system: systemPrompt,
        messages: loopMessages,
        tools,
      });

      if (syncResponse.stop_reason === "tool_use" || syncResponse.stop_reason === "pause_turn") {
        loopMessages.push({ role: "assistant", content: syncResponse.content });
      }

      iterations++;
    } while (
      (syncResponse.stop_reason === "tool_use" || syncResponse.stop_reason === "pause_turn") &&
      iterations < MAX_ITERATIONS
    );

    // If no tool calls occurred, stream directly from the response we already have
    if (iterations === 1 && syncResponse.stop_reason === "end_turn") {
      const textBlock = syncResponse.content.find((b) => b.type === "text");
      const text = textBlock?.type === "text" ? textBlock.text : FALLBACK;
      return textAsStream(text);
    }

    // Tool calls occurred — loopMessages now includes results; stream the final answer
    return streamApiResponse(loopMessages);
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      console.error("Anthropic API error:", error.status, error.message, error.error);
      return Response.json({ error: ERROR_REPLY }, { status: error.status ?? 500 });
    }
    console.error("Unknown error:", error);
    return Response.json({ error: ERROR_REPLY }, { status: 500 });
  }
}
