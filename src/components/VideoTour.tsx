"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import Reveal from "./Reveal";

const SRC = "/videos/runwayx-demo.mp4";
const POSTER = "/videos/runwayx-demo-poster.jpg";

const fmt = (s: number) => {
  const t = Math.max(0, Math.floor(s || 0));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

/**
 * Full product walkthrough on a MacBook running the iOS Simulator.
 * Nothing downloads until the visitor presses play. It plays with sound,
 * since the soundtrack is part of the video. Minimal custom controls hide
 * while the video plays and the pointer is still.
 */
export default function VideoTour() {
  const video = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(81.5);
  const [show, setShow] = useState(true);

  const poke = () => {
    setShow(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShow(false), 2200);
  };
  useEffect(() => () => { if (hideTimer.current) clearTimeout(hideTimer.current); }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused || v.ended) {
      setStarted(true);
      v.play().catch(() => setPlaying(false));
      poke();
    } else v.pause();
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = video.current;
    if (!v) return;
    v.currentTime = Number(e.target.value);
    setTime(v.currentTime);
  };

  const fullscreen = () => {
    const el = box.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  const controlsVisible = !playing || show;
  const pct = dur ? (time / dur) * 100 : 0;

  return (
    <section id="demo" className="scroll-mt-24 px-4 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20">
      <Reveal className="mx-auto max-w-2xl px-2 text-center sm:px-0">
        <p className="text-sm font-medium text-ink/50">Product tour · 1:21</p>
        <h2 className="mt-3 text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl">
          See the whole app in <em className="font-serif text-[1.02em] font-light italic tracking-[-0.025em]">80 seconds</em>.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-ink/60">
          Sign in, scan a receipt, watch your runway update and ask the AI CFO a question, all on iPhone. Sound on.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 sm:mt-12">
        <div
          ref={box}
          onMouseMove={poke}
          onTouchStart={poke}
          className={`group relative overflow-hidden rounded-[18px] bg-[#efe9e1] shadow-[0_1px_2px_rgba(0,0,0,0.06),0_40px_80px_-40px_rgba(12,18,32,0.5)] ring-1 ring-black/[0.06] sm:rounded-[26px] ${playing && !show ? "cursor-none" : ""}`}
        >
          <video
            ref={video}
            className="block aspect-video w-full"
            poster={POSTER}
            preload="none"
            playsInline
            onClick={toggle}
            onPlay={() => { setPlaying(true); setEnded(false); }}
            onPause={() => setPlaying(false)}
            onEnded={() => { setPlaying(false); setEnded(true); setShow(true); }}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
            aria-label="RunwayX product tour video"
          >
            <source src={SRC} type="video/mp4" />
          </video>

          {/* Big centre button before the first play, while paused and at the end */}
          {!playing && (
            <button
              type="button"
              onClick={toggle}
              className="absolute inset-0 grid place-items-center bg-black/[0.04] focus-visible:outline-none"
              aria-label={ended ? "Replay the product tour" : started ? "Resume the product tour" : "Play the product tour, 1 minute 21 seconds, with sound"}
            >
              <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-ink shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)] ring-1 ring-black/5 backdrop-blur-md transition-transform duration-300 hover:scale-105 sm:h-20 sm:w-20">
                {ended ? <RotateCcw className="h-7 w-7" aria-hidden="true" /> : <Play className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" aria-hidden="true" />}
              </span>
            </button>
          )}

          {/* Control bar */}
          {started && (
            <div
              className={`absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-full bg-black/55 px-3 py-2 text-white backdrop-blur-xl transition-opacity duration-300 sm:inset-x-5 sm:bottom-5 sm:gap-4 sm:px-4 ${controlsVisible ? "opacity-100" : "pointer-events-none opacity-0"}`}
            >
              <button type="button" onClick={toggle} className="grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-white/15" aria-label={playing ? "Pause" : "Play"}>
                {playing ? <Pause className="h-4 w-4 fill-current" aria-hidden="true" /> : <Play className="ml-0.5 h-4 w-4 fill-current" aria-hidden="true" />}
              </button>
              <span className="w-10 shrink-0 text-[12px] font-medium tabular-nums text-white/80">{fmt(time)}</span>
              <div className="relative h-8 flex-1">
                <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/25">
                  <div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
                </div>
                <div className="pointer-events-none absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow" style={{ left: `${pct}%` }} />
                <input
                  type="range"
                  min={0}
                  max={dur || 0}
                  step={0.1}
                  value={time}
                  onChange={seek}
                  aria-label="Seek"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </div>
              <span className="hidden w-10 shrink-0 text-right text-[12px] font-medium tabular-nums text-white/60 sm:block">{fmt(dur)}</span>
              <button
                type="button"
                onClick={() => { const v = video.current; if (v) { v.muted = !v.muted; setMuted(v.muted); } }}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-white/15"
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted ? <VolumeX className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}
              </button>
              <button type="button" onClick={fullscreen} className="grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-white/15" aria-label="Full screen">
                <Maximize className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
