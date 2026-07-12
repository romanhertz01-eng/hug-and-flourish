type BlogCoverProps = {
  title: string;
  category?: string | null;
  emoji?: string | null;
  size?: "sm" | "md" | "lg";
};

// Deterministic dark-glass tint from title
function pickTone(seed: string): { grad: string; ring: string } {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const tones = [
    {
      grad:
        "radial-gradient(60% 50% at 20% 20%, rgba(60,120,170,0.55), transparent 70%), radial-gradient(50% 50% at 80% 80%, rgba(194,166,51,0.25), transparent 70%)",
      ring: "border-primary/30",
    },
    {
      grad:
        "radial-gradient(60% 60% at 80% 20%, rgba(194,166,51,0.40), transparent 70%), radial-gradient(60% 60% at 10% 90%, rgba(60,120,170,0.35), transparent 70%)",
      ring: "border-accent/30",
    },
    {
      grad:
        "radial-gradient(70% 60% at 50% 0%, rgba(60,120,170,0.50), transparent 70%), radial-gradient(50% 40% at 100% 100%, rgba(194,166,51,0.20), transparent 70%)",
      ring: "border-white/10",
    },
    {
      grad:
        "radial-gradient(60% 60% at 30% 80%, rgba(90,150,200,0.45), transparent 70%), radial-gradient(40% 40% at 90% 10%, rgba(194,166,51,0.30), transparent 70%)",
      ring: "border-primary/25",
    },
  ];
  return tones[h % tones.length];
}

export function BlogCover({ title, category, emoji, size = "md" }: BlogCoverProps) {
  const tone = pickTone(title);
  const heights = { sm: "aspect-[16/9]", md: "aspect-[16/9]", lg: "aspect-[21/9]" };
  const titleSize = {
    sm: "text-base sm:text-lg",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl md:text-4xl",
  };
  return (
    <div
      className={`glass relative overflow-hidden rounded-2xl border ${tone.ring} ${heights[size]}`}
      aria-hidden={emoji ? undefined : true}
    >
      <div className="absolute inset-0" style={{ background: tone.grad }} aria-hidden />
      <div className="relative flex h-full items-center justify-center px-6 py-8">
        <span
          className={`text-center font-bold leading-tight tracking-tight text-foreground ${titleSize[size]}`}
        >
          {title}
        </span>
      </div>
      {category && (
        <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent backdrop-blur-md">
          {category}
        </div>
      )}
      {emoji && (
        <div className="absolute right-3 bottom-3 text-lg opacity-90" aria-hidden>
          {emoji}
        </div>
      )}
    </div>
  );
}
