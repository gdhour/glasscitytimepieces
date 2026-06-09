"use client";

import { useState, useRef, useCallback } from "react";

type VoiceState = "idle" | "listening" | "unsupported";

export function useVoiceInput(onTranscript: (text: string) => void) {
  const [voiceState, setVoiceState] = useState<VoiceState>(() => {
    if (typeof window === "undefined") return "idle";
    return "webkitSpeechRecognition" in window || "SpeechRecognition" in window
      ? "idle"
      : "unsupported";
  });

  const recognitionRef = useRef<InstanceType<typeof window.SpeechRecognition> | null>(null);

  const start = useCallback(() => {
    if (voiceState === "unsupported") return;

    const SpeechRecognition =
      (window as typeof window & { webkitSpeechRecognition?: typeof window.SpeechRecognition })
        .webkitSpeechRecognition ?? window.SpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setVoiceState("listening");

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join("");
      if (event.results[event.results.length - 1].isFinal) {
        onTranscript(transcript);
      }
    };

    recognition.onerror = () => setVoiceState("idle");
    recognition.onend = () => setVoiceState("idle");

    recognitionRef.current = recognition;
    recognition.start();
  }, [voiceState, onTranscript]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setVoiceState("idle");
  }, []);

  const toggle = useCallback(() => {
    if (voiceState === "listening") {
      stop();
    } else {
      start();
    }
  }, [voiceState, start, stop]);

  return { voiceState, toggle };
}
