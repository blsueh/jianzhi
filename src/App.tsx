import { useEffect, useMemo, useRef, useState } from "react";
import { ZODIAC, type Zodiac } from "./data";

/* ------------------------------------------------------------------ */
/* 滚动渐入                                                            */
/* ------------------------------------------------------------------ */
function useInView<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ------------------------------------------------------------------ */
/* 圆形邮戳徽标                                                        */
/* ------------------------------------------------------------------ */
function SealBadge() {
  return (
    <div className="relative h-44 w-44 shrink-0 sm:h-56 sm:w-56 float-soft">
      <svg viewBox="0 0 200 200" className="h-full w-full spin-slow text-gold-soft">
        <defs>
          <path id="sealCircle" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
        </defs>
        <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <text className="seal-text" fill="currentColor" fontSize="13" fontWeight={600}>
          <textPath href="#sealCircle" startOffset="0">
            · 赣脉元生 · JIANGXI · 瑞昌剪纸 · FOLK PAPERCUT · 特种邮票 ·
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="grid h-20 w-20 place-items-center rounded-full border border-gold/60 bg-vermilion-deep/90 text-paper shadow-[0_0_30px_rgba(197,54,31,0.45)] sm:h-24 sm:w-24">
          <span className="font-calli text-4xl leading-none sm:text-5xl">赣</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 图片缺失时的占位邮票（保持整页美观）                                */
/* ------------------------------------------------------------------ */
function StampFallback({ z }: { z: Zodiac }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-between bg-paper p-4 text-vermilion-deep">
      <div className="font-song text-sm font-bold tracking-wide">
        赣脉元生
        <div className="font-latin text-xs font-semibold tracking-[0.3em] text-vermilion">CHINA</div>
      </div>
      <div className="grid flex-1 place-items-center">
        <span className="font-calli text-[7rem] leading-none drop-shadow-[0_6px_10px_rgba(142,36,23,0.25)]">
          {z.han}
        </span>
      </div>
      <div className="font-song text-xs tracking-wide text-ink-3">
        赣脉元生 · <span className="font-latin">Jiang Xi</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 单枚邮票                                                            */
/* ------------------------------------------------------------------ */
function StampCard({
  z,
  index,
  onOpen,
}: {
  z: Zodiac;
  index: number;
  onOpen: () => void;
}) {
  const { ref, inView } = useInView<HTMLButtonElement>();
  const [failed, setFailed] = useState(false);
  const rot = useMemo(() => (((index * 37) % 45) / 10 - 2.2).toFixed(2), [index]);

  return (
    <button
      ref={ref}
      onClick={onOpen}
      style={{ ["--rot" as string]: `${rot}deg`, animationDelay: `${(index % 4) * 90}ms` }}
      className={`stamp-card reveal ${inView ? "is-in" : ""} group relative block w-full cursor-pointer rounded-[3px] bg-ink-2 p-3 text-left ring-1 ring-white/5`}
    >
      {/* 顶部金线 */}
      <span className="gold-rule absolute left-3 right-3 top-0 z-10 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

      {/* 邮票画面 */}
      <div className="relative aspect-square overflow-hidden rounded-[2px] bg-paper">
        {failed ? (
          <StampFallback z={z} />
        ) : (
          <img
            src={`/zodiac/${z.key}.jpg`}
            alt={`${z.han} · ${z.en}`}
            loading="lazy"
            onError={() => setFailed(true)}
           className="stamp-img h-full w-full object-cover"
          />
        )}
        {/* hover 暗角 */}
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      {/* 信息条 */}
      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <span className="font-latin text-xs text-gold/70">{z.num}</span>
          <span className="font-calli text-3xl leading-none text-paper">{z.han}</span>
          <span className="font-song text-sm text-vermilion">{z.branch}</span>
        </div>
        <div className="text-right leading-tight">
          <div className="font-latin text-base italic text-paper-dim">{z.en}</div>
          <div className="font-latin text-xs tracking-widest text-gold/70">{z.year}</div>
        </div>
      </div>

      {/* 底部性状 */}
      <div className="mt-2 border-t border-white/5 pt-2 font-song text-[11px] tracking-[0.25em] text-paper-dim/70">
        {z.trait}
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* 地支跑马灯                                                          */
/* ------------------------------------------------------------------ */
function BranchMarquee() {
  const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const row = [...branches, ...branches, ...branches];
  return (
    <div className="relative overflow-hidden border-y border-gold/15 bg-ink-2/60 py-3">
      <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
        {row.map((b, i) => (
          <span key={i} className="flex items-center gap-10 font-calli text-2xl text-paper/30">
            {b}
            <span className="text-vermilion/50">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 放大 Lightbox                                                       */
/* ------------------------------------------------------------------ */
function Lightbox({
  index,
  onClose,
  onPrev,
  onNext,
}: {
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const [failed, setFailed] = useState(false);
  const z = ZODIAC[index];

  useEffect(() => setFailed(false), [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/92 p-4 backdrop-blur-md sm:p-8"
    >
      {/* 顶部计数 */}
      <div className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 font-latin text-sm tracking-[0.4em] text-gold/80">
        {z.num} / 12
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-gold/30 text-paper/80 transition hover:border-gold hover:bg-gold/10 hover:text-gold sm:left-8 sm:h-14 sm:w-14"
        aria-label="上一枚"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-gold/30 text-paper/80 transition hover:border-gold hover:bg-gold/10 hover:text-gold sm:right-8 sm:h-14 sm:w-14"
        aria-label="下一枚"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      <div onClick={(e) => e.stopPropagation()} className="flex max-w-5xl flex-col items-center gap-6 md:flex-row md:items-stretch md:gap-10">
        {/* 大图 */}
        <div key={z.key} className="seal-stamp relative aspect-square w-[78vw] max-w-[440px] overflow-hidden rounded-[3px] bg-paper shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] ring-1 ring-gold/30">
          {failed ? (
            <StampFallback z={z} />
          ) : (
            <img
              src={`/zodiac/${z.key}.jpg`}
              alt={`${z.han} · ${z.en}`}
              onError={() => setFailed(true)}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {/* 信息面板 */}
        <div className="w-full max-w-sm text-paper md:w-72">
          <div className="font-latin text-sm tracking-[0.35em] text-gold/80">EARTHLY BRANCH · {z.pinyin}</div>
          <div className="mt-2 flex items-end gap-4">
            <span className="font-calli text-8xl leading-none text-paper">{z.han}</span>
            <div className="pb-2">
              <div className="font-song text-2xl text-vermilion">{z.branch}年</div>
              <div className="font-latin text-xl italic text-paper-dim">{z.en}</div>
            </div>
          </div>
          <div className="mt-5 h-px w-full bg-gradient-to-r from-gold/60 to-transparent" />
          <dl className="mt-5 space-y-2 font-song text-sm text-paper-dim">
            <div className="flex justify-between"><dt className="text-paper/50">序号 No.</dt><dd className="font-latin tracking-widest text-gold">{z.num}</dd></div>
            <div className="flex justify-between"><dt className="text-paper/50">最近年份</dt><dd className="font-latin tracking-widest text-gold">{z.year}</dd></div>
            <div className="flex justify-between"><dt className="text-paper/50">生肖性状</dt><dd className="text-paper">{z.trait}</dd></div>
            <div className="flex justify-between"><dt className="text-paper/50">题材</dt><dd className="text-paper">赣脉元生 · 瑞昌剪纸</dd></div>
          </dl>
          <p className="mt-5 font-song text-xs leading-relaxed text-paper-dim/70">
            十二枚特种邮票，取瑞昌民间剪纸之意象，以朱砂一色剪出岁序流转。
          </p>
          <button
            onClick={() => {
        // zodiac 是当前生肖的英文/拼音标识，比如 "shu"、"niu"、"gou"
        // 你需要根据你当前组件的生肖变量来传递
              window.location.href = `/papercut.html?zodiac=${z.key}`;
        // 如果 papercut.html 在 public 目录下，路径就是 /papercut.htmljianzhi\papercut.html
            }}
           className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-[4px] border border-gold/25 bg-vermilion-deep/80 px-5 py-3 font-song text-sm tracking-[0.15em] text-paper/90 transition-all duration-300 hover:border-gold/50 hover:bg-vermilion-deep hover:text-paper hover:shadow-[0_0_20px_rgba(197,54,31,0.3)]"
>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
             <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
              <line x1="20" y1="4" x2="8.12" y2="15.88" />
              <line x1="14.47" y1="14.48" x2="20" y2="20" />
              <line x1="8.12" y1="8.12" x2="12" y2="12" />
            </svg>
            体验剪纸
          </button>
        </div>
      </div>

      <button
        onClick={onClose}
        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-gold/30 text-paper/80 transition hover:rotate-90 hover:border-gold hover:text-gold"
        aria-label="关闭"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 主应用                                                              */
/* ------------------------------------------------------------------ */
export default function App() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* 背景层 */}
      <div className="pointer-events-none fixed inset-0 -z-10 ink-vignette" />
      <div className="pointer-events-none fixed inset-0 -z-10 paper-grain opacity-[0.12]" />
      {/* 散落印章装饰 */}
      <div className="pointer-events-none fixed -left-10 top-1/3 -z-10 h-40 w-40 rounded-full bg-vermilion/10 blur-3xl" />
      <div className="pointer-events-none fixed -right-16 bottom-10 -z-10 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />

      {/* 顶部细栏 */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 pt-6 font-song text-[11px] tracking-[0.3em] text-paper-dim/70 sm:px-8">
        <span>瑞昌剪纸 · 生肖专题邮册</span>
        <span className="hidden font-latin tracking-[0.4em] text-gold/70 sm:inline">CHINA POST · ZODIAC SERIES</span>
        <span>GMYS</span>
      </header>

      {/* 主标题区 */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-10 pt-10 sm:px-8 lg:grid-cols-[1fr_auto] lg:gap-16 lg:pt-16">
        <div>
          <div className="mb-5 flex items-center gap-3 font-latin text-xs uppercase tracking-[0.45em] text-gold/80">
            <span className="h-px w-10 bg-gold/60" />
            Ruichang Cultural Heritage Paper-cut
          </div>
          <h1 className="font-calli text-7xl leading-[0.95] text-paper sm:text-8xl lg:text-9xl">
            瑞昌<span className="text-vermilion">剪纸</span>
          </h1>
          <p className="mt-6 max-w-xl font-song text-base leading-relaxed text-paper-dim/85 sm:text-lg">
            瑞昌剪纸非遗数字特展・十二生肖系列邮票。一剪刻红韵，方寸藏岁时，
            记录十二地支岁月流转。取材江西瑞昌民间传统剪纸，宣纸为底，手工镂刻纹样。
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 font-song text-sm text-paper-dim/70">
            <span className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full bg-vermilion" />朱砂剪纸</span>
            <span className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full bg-gold" />齿孔成形</span>
            <span className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full bg-paper" />宣纸为底</span>
          </div>
        </div>
        <SealBadge />
      </section>

      <BranchMarquee />

      {/* 邮票网格 */}
      <main className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-calli text-3xl text-paper sm:text-4xl">
            邮票全册 <span className="font-latin text-lg italic text-gold/70">/ Full Sheet</span>
          </h2>
          <span className="font-latin text-sm tracking-[0.3em] text-paper-dim/60">12 STAMPS</span>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-7 lg:grid-cols-4">
          {ZODIAC.map((z, i) => (
            <StampCard key={z.key} z={z} index={i} onOpen={() => setActive(i)} />
          ))}
        </div>

        
      </main>

      {/* 页脚落款 */}
      <footer className="border-t border-gold/15 bg-ink-2/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-10 sm:flex-row sm:px-8">
          <div className="font-song text-sm text-paper-dim/70">
            赣脉元生 · <span className="font-latin italic">Jiangxi Folk Papercut</span> · 瑞昌剪纸
          </div>
          <div className="flex items-center gap-3">
            {["赣", "脉", "生"].map((c) => (
              <span
                key={c}
                className="grid h-10 w-10 place-items-center rounded-[4px] bg-vermilion-deep/90 font-calli text-xl text-paper shadow-[0_4px_10px_rgba(142,36,23,0.4)]"
              >
                {c}
              </span>
            ))}
          </div>
          <div className="font-latin text-xs tracking-[0.35em] text-gold/70">© GMYS</div>
        </div>
      </footer>

      {active !== null && (
        <Lightbox
          index={active}
          onClose={() => setActive(null)}
          onPrev={() => setActive((p) => (p === null ? p : (p + 11) % 12))}
          onNext={() => setActive((p) => (p === null ? p : (p + 1) % 12))}
        />
      )}
    </div>
  );
}
