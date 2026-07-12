import { useState, type SyntheticEvent } from "react";
import { initials } from "@/lib/cards";

export function CardLogo({
  name,
  logoUrl,
  logoDomain,
  size = 40,
  className = "",
  rounded = "rounded-xl",
}: {
  name: string;
  logoUrl?: string | null;
  logoDomain?: string | null;
  size?: number;
  className?: string;
  rounded?: string;
}) {
  // 0 = try logo_url, 1 = try favicon, 2 = plate fallback
  const [stage, setStage] = useState<0 | 1 | 2>(logoUrl ? 0 : logoDomain ? 1 : 2);

  const src =
    stage === 0
      ? (logoUrl ?? "")
      : stage === 1
        ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(logoDomain ?? "")}&sz=64`
        : "";

  const advance = () => setStage((s) => (s === 0 ? (logoDomain ? 1 : 2) : 2));

  const handleLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    if (e.currentTarget.naturalWidth === 0) advance();
  };

  if (stage === 2 || !src) {
    const label = initials(name);
    const fontPx = Math.max(10, Math.round(size * 0.36));
    return (
      <div
        style={{ width: size, height: size, fontSize: fontPx }}
        className={`glass inline-flex shrink-0 select-none items-center justify-center border border-white/10 font-sans font-medium text-foreground ${rounded} ${className}`}
        aria-hidden
      >
        {label}
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`glass inline-flex shrink-0 items-center justify-center overflow-hidden border border-white/10 ${rounded} ${className}`}
      aria-hidden
    >
      <img
        src={src}
        alt=""
        aria-hidden
        width={Math.round(size * 0.7)}
        height={Math.round(size * 0.7)}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={advance}
        onLoad={handleLoad}
        className="object-contain"
        style={{ width: Math.round(size * 0.7), height: Math.round(size * 0.7) }}
      />
    </div>
  );
}
