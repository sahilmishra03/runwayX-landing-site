"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  Bot, Check, Download, Flame, Hourglass, Plus, Receipt, ScanLine, Users,
} from "lucide-react";
import Reveal from "./Reveal";
import { FloatCard, HandNote, PhoneMockup, type Screen } from "./Mockups";
import DemoPlayer from "./Demo";
import AskAI from "./AskAI";

// Smooth ease-in-out for the FAQ accordion (no snap at either end)
const FAQ_EASE = [0.65, 0, 0.35, 1] as const;

/** Italic serif accent word inside headlines */
export function Accent({ children }: { children: React.ReactNode }) {
  return <em className="font-serif text-[1.02em] font-light italic tracking-[-0.025em]">{children}</em>;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-ink/50">{children}</p>;
}
function H2({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`mt-3 text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl ${className}`}>{children}</h2>;
}


/* ---------------- Painted backdrops ---------------- */
type Art = { src: string; pos: string };

// Public-domain paintings via Wikimedia Commons, edge-trimmed and resized to 2400px:
// valley: Bierstadt, Looking Down Yosemite Valley (1865) · sierra: Bierstadt, Among the Sierra Nevada (1868)
// twilight: Church, Twilight in the Wilderness (1860) · oxbow: Cole, The Oxbow (1836) · clouds: Constable, Cloud Study (1822)
const ART = {
  valley: { src: "/images/backdrops/yosemite-down.jpg", pos: "center 45%" },
  sierra: { src: "/images/backdrops/sierra.jpg", pos: "40% 35%" },
  twilight: { src: "/images/backdrops/twilight.jpg", pos: "center 40%" },
  oxbow: { src: "/images/backdrops/oxbow.jpg", pos: "65% center" },
  clouds: { src: "/images/backdrops/clouds.jpg", pos: "center" },
} satisfies Record<string, Art>;

/** Panel with a painting behind its content and a soft vignette. */
function Backdrop({ art, className = "", pos, children }: { art: Art; className?: string; pos?: string; children: React.ReactNode }) {
  return (
    // translateZ keeps the rounded clip on its own layer so no image pixels leak at the edges
    <div className={`relative isolate overflow-hidden [transform:translateZ(0)] ${className}`}>
      <Image src={art.src} alt="" fill quality={92} sizes="(min-width: 1100px) 1050px, 100vw" className="-z-20 object-cover" style={{ objectPosition: pos ?? art.pos }} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_50%_45%,rgba(0,0,0,0)_45%,rgba(0,0,0,0.25)_100%)]" />
      {children}
    </div>
  );
}

/**
 * Lays a fixed-size composition out at its design size and scales it down to
 * fit narrower columns, so phones, cards and notes keep their exact placement
 * on every screen. Height comes from CSS (aspect-ratio) so it's right before
 * hydration; only the scale factor needs measuring.
 */
function ScaleToFit({ width, height, children }: { width: number; height: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div ref={ref} className="relative w-full" style={{ aspectRatio: `${width} / ${height}`, maxHeight: height }}>
      <div
        className="absolute left-1/2 top-0"
        style={{ width, height, transform: `translateX(-50%) scale(${scale})`, transformOrigin: "top center" }}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------------- Intro + big mockup ---------------- */
export function Intro() {
  return (
    <section className="px-4 py-16 sm:px-8 sm:py-24">
      <Reveal className="mx-auto max-w-2xl px-2 text-center sm:px-0">
        <Eyebrow>One app for your startup&apos;s money</Eyebrow>
        <H2>Stop guessing. Start seeing where every <Accent>rupee</Accent> goes.</H2>
        <p className="mx-auto mt-5 max-w-lg text-ink/60">
          Spreadsheets break, accounting tools are built for accountants. RunwayX is built for founders who need answers in seconds.
        </p>
      </Reveal>
      <Reveal delay={0.15} className="mt-10 sm:mt-16">
        {/* Extra bottom padding on lg+ makes room for the phone that overlaps the dashboard */}
        <Backdrop
          art={ART.valley}
          className="rounded-[20px] px-3 pb-8 pt-8 sm:rounded-[28px] sm:px-7 sm:pb-12 sm:pt-12 lg:pb-20"
        >
          <DemoPlayer />
        </Backdrop>
      </Reveal>
    </section>
  );
}

/* ---------------- Feature grid ---------------- */
const grid = [
  { icon: Receipt, title: "Expense tracking", body: "Log every spend in seconds with categories, notes and receipts." },
  { icon: Flame, title: "Burn rate", body: "Monthly burn updates automatically as expenses come in." },
  { icon: Hourglass, title: "Runway estimation", body: "Know exactly how many months of cash you have left." },
  { icon: Users, title: "Team management", body: "Invite co-founders and staff with role-based access." },
  { icon: ScanLine, title: "Receipt scanning", body: "Snap a bill and RunwayX extracts amount, vendor and date." },
  { icon: Bot, title: "AI CFO", body: "Ask questions about your finances and get clear answers." },
];
export function Features() {
  return (
    <section id="features" className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24">
      <Reveal>
        <Eyebrow>Features</Eyebrow>
        <H2 className="max-w-xl">Everything your startup&apos;s <Accent>finances</Accent> need.</H2>
      </Reveal>
      <div className="mt-12 grid overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3 [&>*]:bg-paper" style={{ gap: 1 }}>
        {grid.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.05}>
            <div className="group h-full p-6 transition hover:bg-white sm:p-7">
              <f.icon className="h-6 w-6 text-ink/70 transition group-hover:text-leaf" aria-hidden="true" />
              <h3 className="mt-6 text-lg font-semibold sm:mt-8">{f.title}</h3>
              <p className="mt-1.5 text-ink/60">{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Alternating rows ---------------- */
const rows = [
  {
    eyebrow: "Expenses",
    title: "Every rupee, accounted for.",
    body: "Add expenses manually or scan a receipt. RunwayX categorises spend, attaches files and keeps a searchable history so month-end is never a scramble.",
    points: ["Smart categories", "Receipt & file attachments", "Search and filter in a tap"],
    label: "Expenses screen",
    note: "snap, done!",
  },
  {
    eyebrow: "Burn & runway",
    title: "See the cliff before you reach it.",
    body: "Live burn rate and runway projections based on your real funds and spending, with signals that tell you when to act.",
    points: ["Monthly burn trends", "Runway in months", "Funds & funding rounds"],
    label: "Runway screen",
    note: "know before it's late",
  },
  {
    eyebrow: "Team",
    title: "Your whole team, one ledger.",
    body: "Bring co-founders and employees in. Everyone reports expenses, admins approve, and budgets stay under control per category.",
    points: ["Role-based access", "Category budgets", "Expense reports"],
    label: "Team screen",
    note: "everyone in sync",
  },
];

/**
 * A different composition per row: in hand, fanned pair, tilted with cards.
 * Notes sit in empty space with arrows pointing at the phone, never on top of it.
 */
/*
 * Every visual is designed on a 420x620 canvas (phones plus the float cards and
 * notes around them) and sits fully inside its backdrop. ScaleToFit shrinks the
 * whole canvas on narrow screens. Float cards only overlap the phone's bezel
 * edge, and the note sits in the empty sky above.
 */
const ROW_W = 420;
const ROW_H = 620;
function RowVisual(props: { i: number; label: string; note: string }) {
  return (
    <ScaleToFit width={ROW_W} height={ROW_H}>
      <div className="flex h-full items-end">
        <RowComposition {...props} />
      </div>
    </ScaleToFit>
  );
}

function RowComposition({ i, label, note }: { i: number; label: string; note: string }) {
  if (i === 0)
    return (
      <div className="relative mx-auto h-[620px] w-[250px]">
        <div className="absolute inset-x-0 bottom-0 -rotate-[3deg]">
          <PhoneMockup bare screen="scan" label={label} />
        </div>
        <FloatCard className="-right-[78px] bottom-[170px] rotate-2">
          <p className="text-ink/50">Auto-filled</p>
          <p className="font-semibold">₹1,300 · Food</p>
        </FloatCard>
        <HandNote className="-left-14 top-0" arrow="down-right">{note}</HandNote>
      </div>
    );
  if (i === 1)
    return (
      <div className="relative mx-auto h-[620px] w-[370px]">
        <div className="absolute bottom-[16px] left-0 w-[205px] -rotate-[7deg]">
          <PhoneMockup bare screen="home" label="Home screen" />
        </div>
        <div className="absolute bottom-0 right-0 w-[235px] rotate-[5deg]">
          <PhoneMockup bare screen="runway" label={label} />
        </div>
        <HandNote light className="left-2 top-0" arrow="down-right">{note}</HandNote>
      </div>
    );
  return (
    <div className="relative mx-auto h-[620px] w-[250px]">
      <div className="absolute inset-x-0 bottom-0 rotate-[3deg]">
        <PhoneMockup bare screen="team" label={label} />
      </div>
      <FloatCard className="-left-[84px] top-[170px] -rotate-2">
        <p className="text-ink/50">Neha added</p>
        <p className="font-semibold">₹4,200 · Lunch</p>
      </FloatCard>
      <FloatCard className="-right-[80px] bottom-[120px] rotate-2">
        <p className="text-ink/50">Approved by</p>
        <p className="font-semibold">Aisha</p>
      </FloatCard>
      <HandNote className="-left-14 top-0" arrow="down-right">{note}</HandNote>
    </div>
  );
}

const ROW_ART = [ART.sierra, ART.twilight, ART.oxbow];
export function Showcase() {
  return (
    <section className="divide-y divide-line border-y border-line">
      {rows.map((r, i) => (
        <div key={r.title} className="grid items-center gap-10 px-4 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-12">
          <Reveal className={i % 2 ? "lg:order-2" : ""}>
            <Backdrop art={ROW_ART[i]} className="rounded-[20px] px-2 py-8 sm:rounded-3xl sm:px-6 sm:py-10">
              <RowVisual i={i} label={r.label} note={r.note} />
            </Backdrop>
          </Reveal>
          <Reveal delay={0.1} className="px-1 sm:px-0">
            <Eyebrow>{r.eyebrow}</Eyebrow>
            <H2>{r.title}</H2>
            <p className="mt-5 max-w-md text-ink/60">{r.body}</p>
            <ul className="mt-6 space-y-3">
              {r.points.map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-ink text-white">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      ))}
    </section>
  );
}

/* ---------------- How it works ---------------- */
const steps: { n: string; title: string; body: string; label: string; screen: Screen; tilt: string }[] = [
  { n: "01", title: "Create your startup", body: "Sign up, add your company and opening funds in under a minute.", label: "Home screen", screen: "home", tilt: "-rotate-3" },
  { n: "02", title: "Log what you spend", body: "Add expenses or scan receipts. Your team can too.", label: "Expenses screen", screen: "expenses", tilt: "rotate-2" },
  { n: "03", title: "Watch your runway", body: "Burn, runway and AI insights update automatically.", label: "AI CFO screen", screen: "ai", tilt: "-rotate-2" },
];
export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24">
      <Reveal className="text-center">
        <Eyebrow>How it works</Eyebrow>
        <H2>Up and running in <Accent>three</Accent> steps.</H2>
      </Reveal>
      {/* Two columns on tablets (third card spans both), staggered three-up on desktop */}
      <div className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((s, i) => (
          <Reveal
            key={s.n}
            delay={i * 0.1}
            className={["lg:mt-16", "lg:mt-8", "md:col-span-2 lg:col-span-1 lg:mt-0"][i]}
          >
            <div className="h-full rounded-2xl border border-line bg-white p-5 transition-shadow hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.25)] sm:p-6">
              <span className="font-serif text-2xl italic text-ink/40">{s.n}</span>
              <h3 className="mt-2 text-xl font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-ink/60">{s.body}</p>
              <Backdrop art={ART.clouds} pos={["15% 20%", "55% 70%", "90% 35%"][i]} className="mt-6 grid h-[420px] place-items-center rounded-2xl sm:h-[480px]">
                <div className={`w-[176px] transition-transform duration-500 hover:rotate-0 sm:w-[198px] ${s.tilt}`}>
                  <PhoneMockup bare screen={s.screen} label={s.label} />
                </div>
              </Backdrop>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Stats ---------------- */
export function Stats() {
  const s = [
    { v: "10s", l: "to log an expense" },
    { v: "0", l: "spreadsheets needed" },
    { v: "24/7", l: "AI CFO on call" },
    { v: "100%", l: "of spend visible" },
  ];
  return (
    // Explicit borders per cell: a 2x2 grid on phones, one row of four from md
    <section className="grid grid-cols-2 border-b border-line md:grid-cols-4">
      {s.map((x, i) => (
        <Reveal
          key={x.l}
          delay={i * 0.06}
          className={`border-line px-5 py-10 sm:px-8 sm:py-12 ${i % 2 === 0 ? "border-r" : ""} ${i === 1 ? "md:border-r" : ""} ${i >= 2 ? "border-t md:border-t-0" : ""}`}
        >
          <p className="text-4xl font-medium tracking-[-0.04em] sm:text-5xl">{x.v}</p>
          <p className="mt-2 text-sm text-ink/55">{x.l}</p>
        </Reveal>
      ))}
    </section>
  );
}

/* ---------------- Pricing ---------------- */
/** Public beta APK served from /public/downloads. Update APK_VERSION when the file is replaced. */
export const APK_URL = "/downloads/runwayx-beta.apk";
export const APK_VERSION = "1.0.0 beta · 69 MB";

const betaFeats = [
  "Every feature unlocked",
  "Unlimited expenses and receipt scans",
  "Burn, runway and cash projection",
  "Teams, payroll and budgets",
  "AI CFO insights and chat",
];
export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 border-t border-line px-5 py-16 sm:px-8 sm:py-24">
      <Reveal className="text-center">
        <Eyebrow>Pricing</Eyebrow>
        <H2>Free while we&apos;re in <Accent>beta</Accent>.</H2>
        <p className="mx-auto mt-5 max-w-md text-ink/60">
          Join the Android beta and use all of RunwayX at no cost. No card, no trial timer.
        </p>
      </Reveal>
      <Reveal delay={0.08} className="mx-auto mt-10 max-w-[460px] sm:mt-12">
        <div className="flex flex-col rounded-3xl border border-ink bg-ink p-7 text-white shadow-[0_40px_80px_-40px_rgba(12,18,32,0.6)] sm:p-8">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Beta</p>
            <span className="rounded-full bg-[#9be15d] px-2.5 py-1 text-[12px] font-semibold text-ink">Android</span>
          </div>
          <p className="mt-5 text-5xl font-medium tracking-tight">Free</p>
          <p className="mt-1 text-sm text-white/55">During the beta testing period</p>
          <ul className="mt-7 space-y-3 text-[15px]">
            {betaFeats.map((f) => (
              <li key={f} className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-[#9be15d]" aria-hidden="true" /> {f}
              </li>
            ))}
          </ul>
          <a
            href={APK_URL}
            download
            className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-[15px] font-semibold text-ink transition hover:bg-white/85"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download the beta APK
          </a>
          <p className="mt-3 text-center text-[12.5px] text-white/50">{APK_VERSION} · Android 7.0 or later</p>
        </div>
        <p className="mx-auto mt-5 max-w-sm text-center text-[13px] leading-relaxed text-ink/50">
          Open the file on your phone and allow installs from your browser when Android asks. iOS is coming after the beta.
        </p>
      </Reveal>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
const faqs = [
  { q: "Who is RunwayX for?", a: "Founders and small startup teams who want clarity on spend, burn and runway without hiring a finance team." },
  { q: "How is runway calculated?", a: "RunwayX divides your available funds by your average monthly burn, using your real logged expenses." },
  { q: "Is my financial data secure?", a: "Data is stored on Firebase with per-startup access rules. Only members you invite can see your numbers." },
  { q: "Can my team add expenses?", a: "Yes. Invite members with roles; they can log expenses and admins can review them." },
  { q: "Which platforms are supported?", a: "The free beta is on Android now: download the APK from the pricing section. RunwayX is built with Flutter, and the iOS app follows after the beta." },
  { q: "Is the beta really free?", a: "Yes. Every feature is free for beta testers on Android, with no card and no trial timer." },
];
export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="scroll-mt-24 grid gap-8 border-t border-line px-5 py-16 sm:px-8 sm:py-24 md:grid-cols-[1fr_1.4fr] md:gap-10">
      <Reveal>
        <Eyebrow>FAQ</Eyebrow>
        <H2>Questions, <Accent>answered.</Accent></H2>
      </Reveal>
      <div>
        <div className="divide-y divide-line border-y border-line">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left font-medium"
              >
                {f.q}
                <motion.span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full ring-1 ring-line"
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.45, ease: FAQ_EASE }}
                >
                  <Plus className="h-4 w-4 text-ink/60" aria-hidden="true" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  // Height animates on a padding-free wrapper, so there's no jump at the end
                  <motion.div
                    id={`faq-${i}`}
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                      transition: { height: { duration: 0.45, ease: FAQ_EASE }, opacity: { duration: 0.3, delay: 0.08 } },
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                      transition: { height: { duration: 0.38, ease: FAQ_EASE }, opacity: { duration: 0.18 } },
                    }}
                    className="overflow-hidden will-change-[height]"
                  >
                    <motion.p
                      initial={{ y: -6 }}
                      animate={{ y: 0, transition: { duration: 0.45, ease: FAQ_EASE } }}
                      exit={{ y: -6, transition: { duration: 0.3, ease: FAQ_EASE } }}
                      className="max-w-xl pb-5 pr-4 text-ink/60 sm:pr-10"
                    >
                      {f.a}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        </div>
        <AskAI variant="card" label="Something else? Ask AI" className="mt-6" />
      </div>
    </section>
  );
}

