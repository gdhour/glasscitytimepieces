"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const clockSlices = [
  {
    href: "/#concierge",
    label: "Concierge services",
    slice: "polygon(50% 50%, 0 0, 100% 0)",
    labelClassName: "left-1/2 top-[22%] -translate-x-1/2",
  },
  {
    href: "/current-inventory",
    label: "Current inventory",
    slice: "polygon(50% 50%, 100% 0, 100% 100%)",
    labelClassName: "right-[7%] top-1/2 -translate-y-1/2",
  },
  {
    href: "/personal-collection",
    label: "Personal collection",
    slice: "polygon(50% 50%, 100% 100%, 0 100%)",
    labelClassName: "bottom-[22%] left-1/2 -translate-x-1/2",
  },
  {
    href: "/legacy-inventory",
    label: "Legacy inventory",
    slice: "polygon(50% 50%, 0 100%, 0 0)",
    labelClassName: "left-[7%] top-1/2 -translate-y-1/2",
  },
] as const;

const toledoTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

const toledoPartsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false,
});

function getToledoTime(date: Date) {
  const parts = toledoPartsFormatter.formatToParts(date);
  const values = Object.fromEntries(
    parts.map((part) => [part.type, Number(part.value)]),
  );
  const hour = values.hour ?? 0;
  const minute = values.minute ?? 0;
  const second = values.second ?? 0;

  return {
    hourAngle: (hour % 12) * 30 + minute * 0.5 + second / 120,
    minuteAngle: minute * 6 + second * 0.1,
    label: toledoTimeFormatter.format(date),
  };
}

export default function ClockQuadrantNav() {
  const [timestamp, setTimestamp] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setTimestamp(Date.now());
    const frame = window.requestAnimationFrame(update);
    const interval = window.setInterval(update, 1000);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(interval);
    };
  }, []);

  const toledoTime = useMemo(
    () => (timestamp === null ? null : getToledoTime(new Date(timestamp))),
    [timestamp],
  );

  return (
    <nav
      aria-label={
        toledoTime
          ? `Collection sections, clock set to Toledo time ${toledoTime.label}`
          : "Collection sections, clock set to Toledo time"
      }
      className="relative z-20 mb-8 h-56 w-56 sm:h-64 sm:w-64 lg:h-72 lg:w-72"
    >
      <div
        className="absolute inset-0 rounded-full border border-[var(--border-strong)] bg-[rgba(9,7,12,0.42)] shadow-[0_22px_60px_rgba(0,0,0,0.34)] backdrop-blur-sm"
        aria-hidden
      />
      {clockSlices.map(({ href, label, slice, labelClassName }) => (
        <Link
          href={href}
          key={href}
          style={{ clipPath: slice }}
          className="absolute inset-0 overflow-hidden rounded-full bg-[rgba(18,13,26,0.46)] transition-colors hover:bg-[rgba(183,139,74,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--bronze)]"
        >
          <span
            className={`absolute flex w-24 items-center justify-center text-center text-[10px] font-medium uppercase leading-tight tracking-[0.12em] text-[var(--steel-bright)] transition-colors sm:w-28 sm:text-[11px] ${labelClassName}`}
          >
            {label}
          </span>
        </Link>
      ))}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-full w-px bg-[linear-gradient(180deg,transparent,var(--border-strong),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-0 top-1/2 h-px w-full bg-[linear-gradient(90deg,transparent,var(--border-strong),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[22%] h-[28%] w-[3px] -translate-x-1/2 rounded-full bg-[var(--bronze-soft)] shadow-[0_0_12px_var(--glow-bronze)] transition-transform duration-300 ease-out"
        style={{
          opacity: toledoTime ? 1 : 0,
          transform: `translateX(-50%) rotate(${toledoTime?.hourAngle ?? 0}deg)`,
          transformOrigin: "50% 100%",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[15%] h-[35%] w-px -translate-x-1/2 rounded-full bg-[var(--steel-bright)] shadow-[0_0_10px_rgba(255,255,255,0.32)] transition-transform duration-300 ease-out"
        style={{
          opacity: toledoTime ? 1 : 0,
          transform: `translateX(-50%) rotate(${toledoTime?.minuteAngle ?? 0}deg)`,
          transformOrigin: "50% 100%",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--bronze)] bg-[var(--surface-elevated)] shadow-[0_0_24px_var(--glow-bronze)]"
        aria-hidden
      />
      {toledoTime ? (
        <p className="pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 text-[9px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
          Toledo {toledoTime.label}
        </p>
      ) : null}
    </nav>
  );
}
