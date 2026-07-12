import { ChevronRight, Sparkles, CreditCard, Globe2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Hero({ total }: { total: number }) {
  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-background">
      {/* Ambient dark gradient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1000px 500px at 15% 10%, rgba(60,120,170,0.18), transparent 60%), radial-gradient(800px 400px at 90% 20%, rgba(194,166,51,0.10), transparent 60%), linear-gradient(180deg, #000000 0%, #060B19 60%, #000000 100%)",
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-6 pb-8 pt-5 sm:px-8 lg:pb-10 lg:pt-6">
        {/* Promo banner */}
        <PromoBanner />

        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className="mt-5 mb-5 text-[13px] text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link to="/" className="hover:text-foreground/90 transition-colors">Главная</Link>
            </li>
            <li aria-hidden className="text-white/25"><ChevronRight className="h-3 w-3" /></li>
            <li className="text-foreground/70">Виртуальные карты</li>
          </ol>
        </nav>

        {/* Hero glass panel — compact */}
        <div className="glass-strong relative overflow-hidden rounded-[24px] border border-white/10 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.5)] sm:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(500px 240px at 85% 0%, rgba(194,166,51,0.08), transparent 65%), radial-gradient(600px 300px at 0% 100%, rgba(60,120,170,0.14), transparent 65%)",
            }}
          />
          <div className="relative max-w-[960px]">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-foreground/80 backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-accent" />
              Обновлено в 2026 году
            </div>

            <h1 className="mt-4 font-sans font-light leading-[1.1] tracking-[-0.025em] text-foreground text-[30px] sm:text-[38px] lg:text-[46px]">
              Топ зарубежных виртуальных карт для оплаты{" "}
              <span className="bg-gradient-to-r from-[oklch(0.82_0.08_240)] via-[oklch(0.68_0.09_245)] to-[oklch(0.82_0.13_90)] bg-clip-text font-normal text-transparent">
                сервисов в 2026 году
              </span>
            </h1>

            <p className="mt-5 max-w-[900px] text-[16px] leading-[1.6] text-muted-foreground">
              Payqo — независимый мониторинг сервисов виртуальных карт для россиян.
              В рейтинге — {total} проверенных карт с актуальными тарифами и способами пополнения.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <a
                href="#rating"
                className="btn-pill inline-flex h-11 items-center justify-center bg-primary px-6 text-sm font-medium text-primary-foreground shadow-[0_0_24px_rgba(60,120,170,0.35)] transition-all hover:bg-primary/90 hover:shadow-[0_0_36px_rgba(60,120,170,0.55)]"
              >
                Смотреть рейтинг →
              </a>
              <Link
                to="/podbor"
                className="btn-pill inline-flex h-11 items-center justify-center border border-white/15 bg-white/[0.04] px-6 text-sm font-medium text-foreground backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/[0.08]"
              >
                Подобрать карту
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PromoBanner() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/10 px-6 py-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:px-7"
      style={{
        background:
          "linear-gradient(120deg, oklch(0.34 0.09 245) 0%, oklch(0.24 0.07 245) 45%, oklch(0.18 0.05 245) 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(360px 140px at 90% 20%, rgba(194,166,51,0.16), transparent 60%), radial-gradient(360px 160px at 10% 100%, rgba(120,180,230,0.16), transparent 60%)",
        }}
      />
      <div className="relative flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.08] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-foreground/85 backdrop-blur-md">
            <span className="h-1 w-1 rounded-full bg-accent shadow-[0_0_8px_rgba(194,166,51,0.9)]" />
            Payqo рейтинг
          </div>
          <h2 className="mt-1 font-sans text-[15px] font-normal leading-snug tracking-tight text-foreground sm:text-base">
            Ищете карту для зарубежных сервисов и оплаты за границей?
          </h2>
          <p className="mt-0.5 hidden text-xs leading-snug text-foreground/70 sm:block">
            Рабочие карты для ChatGPT, Netflix, Steam — проверены редакцией.
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-6 md:flex">
          <PromoVisual />
          <a
            href="#rating"
            className="btn-pill inline-flex h-10 shrink-0 items-center bg-foreground px-4 text-[14px] font-medium text-background transition-all hover:bg-foreground/90"
          >
            К рейтингу →
          </a>
        </div>

        <a
          href="#rating"
          className="btn-pill inline-flex h-10 shrink-0 items-center bg-foreground px-4 text-[14px] font-medium text-background transition-all hover:bg-foreground/90 md:hidden"
        >
          К рейтингу →
        </a>
      </div>
    </div>
  );
}

function PromoVisual() {
  return (
    <div className="relative flex items-center gap-3">
      <div
        className="flex h-[60px] w-[100px] flex-col justify-between rounded-xl border border-white/15 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(60,120,170,0.55), rgba(20,40,70,0.65))",
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-semibold uppercase tracking-wider text-foreground/85">Virtual</span>
          <CreditCard className="h-3 w-3 text-foreground/85" />
        </div>
        <div className="font-mono text-[10px] tracking-widest text-foreground/90">•••• 8842</div>
      </div>
      <div className="flex flex-col gap-1">
        <ServicePill>ChatGPT</ServicePill>
        <ServicePill tone="accent">
          <Globe2 className="h-2.5 w-2.5" /> 200+
        </ServicePill>
      </div>
    </div>
  );
}

function ServicePill({ children, tone }: { children: React.ReactNode; tone?: "accent" }) {
  const cls =
    tone === "accent"
      ? "border-accent/40 bg-accent/15 text-accent"
      : "border-white/15 bg-white/[0.08] text-foreground/90";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium backdrop-blur-md ${cls}`}
    >
      {children}
    </span>
  );
}
