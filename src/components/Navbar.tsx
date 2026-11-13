"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Labels match the section each link scrolls to
const links = [
  { href: "/#features", label: "Features" },
  { href: "/#how", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

/**
 * Runway mark + wordmark on a transparent background. Light backgrounds use the
 * ink mark; dark backgrounds (`light`) use the light mark with the bright-green
 * chevron. The mark is decorative, so the wordmark beside it carries the name.
 */
export function Logo({ light = false, priority = false }: { light?: boolean; priority?: boolean }) {
  return (
    <span className={`flex items-center gap-2 ${light ? "text-white" : "text-ink"}`}>
      {/* Mark height ~1.6x the wordmark cap so the two read as one unit */}
      <Image
        src={light ? "/logo-mark.png" : "/logo-nav.png"}
        alt=""
        width={512}
        height={512}
        priority={priority}
        className={light ? "h-10 w-10 shrink-0" : "h-8 w-8 shrink-0 sm:h-9 sm:w-9"}
      />
      <span className="text-[20px] font-semibold leading-none tracking-[-0.03em] sm:text-[22px]">RunwayX</span>
    </span>
  );
}

/**
 * Floating glass navbar: slides in on load, hides while scrolling down and
 * returns on scroll up, and a pill follows the hovered link.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hover, setHover] = useState<string | null>(null);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 400 && y > prev && !open);
  });

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 flex flex-col items-center px-4 pt-3 sm:px-5 sm:pt-4"
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: hidden ? -90 : 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Compact floating pill, sized to its content (lbrty.ai shape) */}
      <nav
        aria-label="Main"
        data-scrolled={scrolled || open}
        className="liquid-glass flex max-w-full items-center gap-1 rounded-full p-2 sm:px-3"
      >
        <Link
          href="/#top"
          aria-label="RunwayX home"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full transition hover:bg-white/30 sm:h-9 sm:w-9"
        >
          <Image src="/logo-nav.png" alt="" width={512} height={512} priority className="h-7 w-7 object-contain sm:h-8 sm:w-8" />
        </Link>

        <span aria-hidden="true" className="mx-1 h-5 w-px bg-ink/15" />

        <ul className="hidden items-center gap-1 text-sm font-medium tracking-[-0.01em] text-ink/75 md:flex" onMouseLeave={() => setHover(null)}>
          {links.map((l) => (
            <li key={l.label} className="relative">
              <Link
                href={l.href}
                onMouseEnter={() => setHover(l.label)}
                onFocus={() => setHover(l.label)}
                className="relative z-10 block whitespace-nowrap rounded-full px-3 py-2 transition-colors hover:text-ink"
              >
                {l.label}
              </Link>
              {hover === l.label && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-xl bg-white/80 shadow-sm ring-1 ring-black/5"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
            </li>
          ))}
        </ul>

        <Link
          href="/#pricing"
          className="group relative overflow-hidden whitespace-nowrap rounded-full bg-[#140d0b] px-3 py-2 text-xs font-semibold tracking-[-0.01em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition hover:bg-black/80 sm:mx-1 sm:text-sm"
        >
          <span className="relative z-10">Get the app</span>
          {/* Shine sweep */}
          <span
            aria-hidden="true"
            className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 transition-transform duration-700 group-hover:translate-x-[400%]"
          />
        </Link>

        <button
          type="button"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink/75 transition hover:bg-white/30 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            id="mobile-nav"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            data-scrolled="true"
            className="liquid-glass mt-2 w-full max-w-[280px] rounded-3xl p-2 md:hidden"
          >
            {links.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-[15px] font-medium text-ink/75 transition-colors hover:bg-white/40 hover:text-ink"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
