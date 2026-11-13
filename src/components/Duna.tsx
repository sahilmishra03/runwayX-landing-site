"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ChevronRight, Play } from "lucide-react";
import { RaiseButton } from "./ui/RaiseButton";
import { FloatCard, HandNote, RisingPhone } from "./Mockups";
import { Accent } from "./Sections";
import Link from "next/link";
import AskAI from "./AskAI";

const ease = [0.22, 1, 0.36, 1] as const;

function Badge({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1 text-[12px] font-medium backdrop-blur ${
        dark ? "bg-black/[0.05] text-ink" : "bg-white/20 text-white ring-1 ring-white/25"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-[2px] bg-[#9be15d]" aria-hidden="true" />
      {children}
    </span>
  );
}

function PillButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-ink shadow-sm transition hover:shadow-md"
    >
      {children}
      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </a>
  );
}

/** Centered copy block used by the cloud sections */
function CenterCopy({
  badge, title, body, cta, href, as = "h2",
}: { badge: string; title: React.ReactNode; body: string; cta: string; href: string; as?: "h1" | "h2" }) {
  const T = as;
  return (
    <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center px-6 text-center text-white">
      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }}>
        <Badge>{badge}</Badge>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1, ease }}>
        <T className="mt-4 text-[34px] font-medium leading-[1.1] tracking-[-0.035em] min-[400px]:text-4xl sm:text-[44px]">{title}</T>
        <p className="mx-auto mt-4 max-w-[440px] text-[15px] leading-relaxed text-white/85">{body}</p>
      </motion.div>
      <motion.div className="mt-8" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2, ease }}>
        <PillButton href={href}>{cta}</PillButton>
      </motion.div>
    </div>
  );
}

/*
 * Duna-style painted edge: the painting is opaque at the top and dissolves into
 * the page along an uneven, brushed line (lower on the left, higher on the
 * right). The SVG is used as a CSS mask; turbulence roughens the edge and the
 * blur feathers it.
 */
const HERO_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1000" preserveAspectRatio="none">
    <filter id="f" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.05" numOctaves="3" seed="7"/>
      <feDisplacementMap in="SourceGraphic" scale="70"/>
      <feGaussianBlur stdDeviation="28"/>
    </filter>
    <path filter="url(#f)" fill="#fff" d="M-60 -60H1500V560C1390 590 1300 560 1190 610C1080 660 1000 640 900 680C800 720 710 690 610 720C510 750 430 735 340 765C240 795 150 790 60 815L-60 840Z"/>
  </svg>`,
)}")`;

/* ---------------- Hero ---------------- */
export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-white pb-12 pt-[60px] sm:pb-14">
      {/* Painting: "The Rocky Mountains, Lander's Peak" by Albert Bierstadt (public domain) */}
      {/* Full colour across the top ~3/4 of the screen, then a brushed edge into white */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[74%] sm:h-[80%]"
        style={{ maskImage: HERO_MASK, WebkitMaskImage: HERO_MASK, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }}
        initial={{ scale: 1.06, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease }}
      >
        <Image
          src="/images/hero-rockies.jpg"
          alt=""
          fill
          priority
          quality={92}
          sizes="100vw"
          className="object-cover object-[center_35%]"
        />
      </motion.div>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 text-center sm:px-6">
        <motion.a
          href="/#features"
          className="group inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-[12px] font-semibold text-white backdrop-blur-md transition hover:bg-black/60 sm:text-[13px]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease }}
        >
          New: AI CFO for your startup
          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </motion.a>
        <motion.h1
          className="mt-6 text-[36px] font-medium leading-[1.02] tracking-[-0.045em] text-ink min-[400px]:text-[42px] sm:text-[58px] md:text-[70px]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease }}
        >
          Know your runway,
          <br />
          not just your <Accent>spend</Accent>
        </motion.h1>
        <motion.p
          className="mx-auto mt-6 max-w-[620px] text-[17px] leading-[1.5] tracking-[-0.01em] text-ink/50 sm:text-[21px]"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease }}
        >
          RunwayX tracks every expense, calculates burn and runway in real time, and gives your team an AI CFO, all in one app.
        </motion.p>
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease }}
        >
          <RaiseButton
            href="/#pricing"
            className="px-6 py-3 text-[16px] font-semibold tracking-[-0.01em] sm:px-7 sm:py-3.5 sm:text-[18px]"
          >
            Get the app
          </RaiseButton>
          <a
            href="#demo"
            className="group inline-flex items-center gap-2.5 text-[16px] font-semibold tracking-[-0.01em] text-ink sm:text-[18px]"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-[0_6px_16px_-6px_rgba(0,0,0,0.35)] ring-1 ring-black/5 transition-transform group-hover:scale-105">
              <Play className="ml-0.5 h-3.5 w-3.5 fill-current" aria-hidden="true" />
            </span>
            Watch the tour
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Centered AI section (blue sky, middle of page) ---------------- */
export function CenterAI() {
  return (
    <section className="relative isolate overflow-hidden pt-24 sm:pt-40">
      {/* Painting: "Cloud Study" by John Constable, 1822 (public domain) */}
      <Image
        src="/images/backdrops/clouds.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-[center_60%]"
      />
      {/* Deepens the pale sky so white copy stays legible */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(24,56,86,0.62)_0%,rgba(30,66,98,0.38)_45%,rgba(20,40,60,0.18)_100%)]"
      />
      <CenterCopy
        badge="Artificial Intelligence"
        title={<>AI built for <Accent>founders.</Accent></>}
        body="RunwayX's AI CFO reads your real numbers. Ask about burn, overspend or runway and get clear answers, backed by your data."
        cta="Discover RunwayX AI"
        href="/#features"
      />
      {/* Phone rises from the section's bottom edge; its lower half is cropped by overflow-hidden */}
      {/* Phones: smaller phone, card tucked against its left edge so it stays on screen */}
      <motion.div
        className="relative z-10 mx-auto -mb-[190px] mt-12 w-[240px] sm:-mb-[230px] sm:mt-16 sm:w-[290px]"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2, ease }}
      >
        <RisingPhone screen="ai" label="RunwayX AI CFO chat" />
        <FloatCard className="-left-8 top-44 -rotate-3 sm:-left-40 sm:top-56">
          <p className="text-ink/50">Suggested saving</p>
          <p className="font-semibold">₹9k / month</p>
        </FloatCard>
        <HandNote light arrow="down-left" className="-right-56 top-6 hidden md:block lg:-right-60">
          your CFO, in your pocket
        </HandNote>
      </motion.div>
    </section>
  );
}

/* ---------------- Footer (Duna layout: link columns over the sky, legal bar over the land) ---------------- */
type FooterLink = { href: string; label: string; external?: boolean; download?: boolean };

const footerColumns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/#features", label: "Features" },
      { href: "/#how", label: "How it works" },
      { href: "/#pricing", label: "Free beta" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/#faq", label: "FAQ" },
      { href: "/security", label: "Security" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
  {
    title: "Get the app",
    links: [
      { href: "/downloads/runwayx-beta.apk", label: "Android beta (APK)", download: true },
      { href: "/#pricing", label: "iOS: coming soon" },
    ],
  },
];

const footerBottomLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
  { href: "/security", label: "Security" },
];

// Average colour of the painting's top edge, darkened so white text passes contrast
const FOOTER_SKY = "#4f6e69";

export function Footer() {
  return (
    <footer
      id="download"
      className="relative isolate flex min-h-[640px] flex-col overflow-hidden text-white sm:min-h-[700px] lg:min-h-[760px]"
      style={{ backgroundColor: FOOTER_SKY }}
    >
      {/* Painting: "Mount Corcoran" by Albert Bierstadt (public domain), anchored to the bottom */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, #000 34%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 34%)",
        }}
      >
        <Image src="/images/footer-corcoran.jpg" alt="" fill sizes="100vw" className="object-cover object-[center_70%]" />
      </div>
      {/* Light scrims: keep the sky readable at the top and the legal bar at the bottom */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(40,62,58,0.35)_0%,rgba(40,62,58,0.1)_40%,transparent_60%,rgba(0,0,0,0.45)_100%)]" />
      {/* Hairline separating the page from the footer, inset like Duna's */}
      <span aria-hidden="true" className="absolute inset-x-5 top-0 h-px bg-white/25 sm:inset-x-10" />

      {/* Link columns */}
      <div className="mx-auto w-full max-w-[1120px] px-6 pt-20 sm:pt-24">
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 [text-shadow:0_1px_12px_rgba(0,0,0,0.25)]">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h2 className="text-[18px] font-semibold tracking-[-0.02em] sm:text-[20px]">{col.title}</h2>
              <ul className="mt-5 space-y-3 text-[15px] font-medium text-white/90 sm:text-[16px]">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.download ? (
                      <a href={l.href} download className="transition-opacity hover:opacity-70">{l.label}</a>
                    ) : l.external ? (
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70">
                        {l.label}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      <Link href={l.href} className="transition-opacity hover:opacity-70">{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Legal bar over the foreground */}
      <div className="mx-auto mt-auto flex w-full max-w-[1120px] flex-col items-center gap-5 px-6 pb-8 pt-16 text-[14px] sm:text-[15px] md:flex-row md:justify-between">
        {/* Mobile: copyright on its own line, links in one row below. Desktop: one row */}
        <div className="flex flex-col items-center gap-2.5 font-medium text-white/75 md:flex-row md:gap-7">
          <p>© RunwayX 2026</p>
          <ul className="flex items-center gap-5 whitespace-nowrap md:gap-7">
            {footerBottomLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="transition-colors hover:text-white">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <AskAI variant="summary" label="Get an AI summary of RunwayX" />
      </div>
    </footer>
  );
}
