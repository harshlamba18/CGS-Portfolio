import { useEffect } from "react";

export default function Loader({ onFinish, duration = 4500 }) {
  useEffect(() => {
    const t = setTimeout(() => {
      onFinish?.();
    }, duration);
    return () => clearTimeout(t);
  }, [onFinish, duration]);

  const text = "Welcome to CGS Portfolio".split("");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background:
          "linear-gradient(180deg,#040616 0%, #07051a 35%, #040316 65%, #01000a 100%)",
      }}
      className="flex items-center justify-center overflow-hidden"
    >
      <div className="loader-bg pointer-events-none absolute inset-0" />

      
      <div
        className="pointer-events-none absolute inset-0 opacity-16"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px)',
          backgroundSize: '100% 4px',
        }}
      />

      <div className="relative w-[min(92vw,740px)] rounded-4xl border px-8 md:px-12 py-12 md:py-14 flex flex-col items-center" style={{ borderColor: 'rgba(255,182,193,0.12)', background: 'rgba(255,250,252,0.02)', backdropFilter: 'blur(10px)', boxShadow: '0 0 40px rgba(255,105,180,0.06)' }}>
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-mono tracking-[0.35em] uppercase"
            style={{
              border: '1px solid rgba(255,106,180,0.14)',
              background: 'rgba(255,106,180,0.04)',
              color: 'rgba(255,240,245,0.98)',
            }}
          >
          <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: 'linear-gradient(180deg,#ff6ab4,#6b8bff)' }} />
          System Boot
        </div>

        <div className="relative mb-12">
            <div
              className="absolute -inset-8 rounded-full blur-2xl loader-orb-pulse"
              style={{ background: 'radial-gradient(circle,#ff6ab4cc 0%, #6b8bff22 40%, transparent 62%)' }}
            />
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

        <p className="mt-3 text-[10px] font-mono uppercase tracking-[0.38em] text-slate-400" style={{ color: 'rgba(255,220,230,0.9)' }}>
          Loading Experience
        </p>
      </div>
    </div>
  );
}