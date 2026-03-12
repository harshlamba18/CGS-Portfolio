import { useEffect } from "react";

export default function Loader({ onFinish, duration = 4500 }) {
  useEffect(() => {
    const t = setTimeout(() => {
      onFinish?.();
    }, duration);
    return () => clearTimeout(t);
  }, [onFinish, duration]);

  const text = "Welcome to my Portfolio".split("");

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-[#02040a] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(56,189,248,0.14)_0%,rgba(99,102,241,0.1)_38%,transparent_72%)]" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#02040a]/15 via-[#02040a]/35 to-[#02040a]/55" />
      <div className="pointer-events-none absolute inset-0 opacity-16 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[100%_4px]" />

      <div className="relative w-[min(92vw,740px)] rounded-4xl border border-white/10 bg-white/5 backdrop-blur-2xl px-8 md:px-12 py-12 md:py-14 flex flex-col items-center shadow-[0_0_50px_rgba(99,102,241,0.12)]">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-300/25 bg-indigo-300/10 px-4 py-1.5 text-[10px] font-mono tracking-[0.35em] uppercase text-indigo-100">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-300 animate-pulse" />
          System Boot
        </div>

        <div className="relative mb-12">
          <div className="absolute -inset-8 rounded-full bg-cyan-400/10 blur-2xl loader-orb-pulse" />
          <div className="banter-loader relative z-10">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="banter-loader__box" />
            ))}
          </div>
        </div>

        <h2 className="loader-title text-center text-2xl md:text-3xl font-black tracking-[0.16em] md:tracking-[0.2em] uppercase">
          {text.map((char, i) => (
            <span
              key={i}
              className="inline-block opacity-0 animate-[portfolioText_0.6s_forwards]"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h2>

        <p className="mt-3 text-[10px] font-mono uppercase tracking-[0.38em] text-slate-400">
          Loading Experience
        </p>
      </div>
    </div>
  );
}