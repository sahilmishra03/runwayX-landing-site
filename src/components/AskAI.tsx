"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";

/**
 * "Ask AI about RunwayX": a label plus round icon-only buttons that open
 * ChatGPT or Claude in a new tab with a neutral prompt.
 * The prompt links to the README served at /readme.md, so the assistant can
 * read the full product context. The full README is too long for a URL, so
 * every click also copies prompt + README to the clipboard for pasting.
 * Used in the footer (`summary` variant) and the FAQ (`card` variant).
 * Brand logos: @lobehub/icons-static-svg 1.98.0 (MIT).
 */
export const AI_PROMPT =
  "RunwayX is a finance app for startups, built with Flutter for Android and iOS. It tracks expenses, calculates burn rate and runway, supports team members with role-based access, scans receipts and includes an AI CFO chat. Data is stored on Firebase with per-startup access rules. Explain what an app like this does and what a founder should check when evaluating it.";

const README_PATH = "/readme.md";

/**
 * Always the production URL, so links opened from localhost or preview
 * deployments still point assistants at a page they can actually reach.
 */
export const README_URL = `https://runwayx.openforge.in${README_PATH}`;

/** Prompt with a pointer to the README; used in the URL and the preview */
const PROMPT_WITH_LINK = `${AI_PROMPT}\n\nUse the full RunwayX README as context: ${README_URL}`;
const q = encodeURIComponent(PROMPT_WITH_LINK);

/**
 * Fetched once per page and shared by every AskAI instance. Prefetched on
 * mount so the click handler can copy synchronously: Safari rejects
 * clipboard writes that happen after an await.
 */
let readmeText: string | undefined;
let readmeRequest: Promise<void> | undefined;
const prefetchReadme = () => {
  readmeRequest ??= fetch(README_PATH)
    .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
    .then((t) => {
      readmeText = t;
    })
    .catch(() => {
      readmeRequest = undefined; // let the next mount retry
    });
};

const ASSISTANT_URLS = {
  ChatGPT: (q: string) => `https://chatgpt.com/?q=${q}`,
  Claude: (q: string) => `https://claude.ai/new?q=${q}`,
} as const;

function OpenAIIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" className="h-4 w-4" aria-hidden="true" focusable="false">
      <path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z" />
    </svg>
  );
}

function ClaudeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" focusable="false">
      <path fill="#D97757" d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" />
    </svg>
  );
}

type Assistant = {
  name: keyof typeof ASSISTANT_URLS;
  Icon: () => React.ReactElement;
};

const ASSISTANTS: readonly Assistant[] = [
  { name: "ChatGPT", Icon: OpenAIIcon },
  { name: "Claude", Icon: ClaudeIcon },
];

const MESSAGES = {
  copied: "Prompt copied",
  copiedReadme: "Prompt and README copied",
  failed: "Couldn't copy prompt",
} as const;
type Status = "" | keyof typeof MESSAGES;

/**
 * Two deliberately different looks:
 * - `summary` (footer): one frosted-glass capsule, label then bare icons
 *   separated by a hairline, with a tooltip above each icon.
 * - `card` (FAQ): a bordered panel styled like a chat composer, showing the
 *   prompt that will be sent and labelled assistant chips.
 */
export default function AskAI({
  variant = "card",
  label = "Ask AI about RunwayX",
  className = "",
}: {
  variant?: "summary" | "card";
  label?: string;
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Effects only prefetch and clean up; state changes happen in event callbacks
  useEffect(() => {
    prefetchReadme();
    return () => clearTimeout(timer.current);
  }, []);

  const show = (s: Exclude<Status, "">) => {
    setStatus(s);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(""), 2500);
  };

  // No preventDefault: the link opens the new tab itself, so popups aren't blocked.
  // writeText runs synchronously in the click, before the new tab takes focus.
  const copyPrompt = () => {
    const clip = typeof navigator !== "undefined" ? navigator.clipboard : undefined;
    if (!clip?.writeText) return show("failed");
    // Full README when it's loaded, otherwise the prompt with the README link
    const hasReadme = readmeText !== undefined;
    const text = hasReadme
      ? `${AI_PROMPT}\n\nFull RunwayX README for context:\n\n${readmeText}`
      : PROMPT_WITH_LINK;
    clip.writeText(text).then(
      () => show(hasReadme ? "copiedReadme" : "copied"),
      () => show("failed"),
    );
  };

  const linkProps = (name: Assistant["name"]) => ({
    href: ASSISTANT_URLS[name](q),
    target: "_blank",
    rel: "noopener noreferrer",
    onClick: copyPrompt,
    "aria-label": `Ask ${name} about RunwayX (opens in a new tab)`,
  });

  if (variant === "summary") {
    return (
      <div
        className={`liquid-glass inline-flex items-center gap-3 whitespace-nowrap rounded-full py-1.5 pl-4 pr-1.5 text-white ${className}`}
        data-scrolled="false"
      >
        {/* Label, status and a hidden sizer share one grid cell, so nothing ever shifts */}
        <span className="grid text-[12px] font-semibold leading-5 min-[400px]:text-[13px] sm:text-[14px] [text-shadow:0_1px_8px_rgba(0,0,0,0.3)]">
          <span className={`[grid-area:1/1] motion-safe:transition-opacity ${status ? "opacity-0" : ""}`}>{label}</span>
          <span role="status" aria-live="polite" className="[grid-area:1/1]">
            {status && MESSAGES[status]}
          </span>
          <span aria-hidden="true" className="invisible [grid-area:1/1]">{label}</span>
        </span>
        <span aria-hidden="true" className="h-5 w-px bg-white/35" />
        <ul className="flex items-center">
          {ASSISTANTS.map(({ name, Icon }) => (
            <li key={name} className="group relative">
              <a
                {...linkProps(name)}
                className="grid h-8 w-8 place-items-center rounded-full text-white transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white [&_svg]:h-[18px] [&_svg]:w-[18px]"
              >
                <Icon />
              </a>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-ink opacity-0 shadow-md group-hover:opacity-100 group-focus-within:opacity-100 motion-safe:transition-opacity"
              >
                {name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // card: chat-composer panel with the prompt preview and labelled chips
  return (
    <div className={`rounded-2xl border border-line bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)] sm:p-5 ${className}`}>
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-lg bg-[#9be15d]/25 text-leaf">
          <Sparkles className="h-4 w-4" />
        </span>
        <p className="text-[14px] font-semibold tracking-[-0.01em] text-ink">{label}</p>
        <span role="status" aria-live="polite" className="ml-auto text-[12px] font-medium text-leaf">
          {status && MESSAGES[status]}
        </span>
      </div>

      {/* Prompt preview, styled like a chat input */}
      <p className="mt-3 rounded-xl bg-paper px-3.5 py-2.5 text-[13px] leading-relaxed text-ink/55">
        <span className="sr-only">Prompt that will be sent: </span>
        <span className="line-clamp-2">{PROMPT_WITH_LINK}</span>
      </p>

      <ul className="mt-3 flex flex-wrap gap-2">
        {ASSISTANTS.map(({ name, Icon }) => (
          <li key={name}>
            <a
              {...linkProps(name)}
              className="group inline-flex items-center gap-2 rounded-lg border border-line bg-white py-1.5 pl-2 pr-2.5 text-[13px] font-medium text-ink/80 transition hover:border-ink/25 hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <Icon />
              {name}
              <ArrowUpRight className="h-3.5 w-3.5 text-ink/35 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink/70" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}