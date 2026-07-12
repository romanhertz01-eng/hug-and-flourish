import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Apple, Smartphone, Zap, ArrowUpRight, ShieldCheck } from "lucide-react";
import type { Card } from "@/lib/cards";
import { initials } from "@/lib/cards";
import { noWrapMoney } from "@/lib/format";
import { getCardServiceSlugs, getTableServiceSlugs } from "@/lib/services";
import { ServicePreview, ServicesModal } from "./ServicesModal";

type SortKey = "rank" | "price" | "speed";

type ChipId = string;

type Chip = {
  id: ChipId;
  label: string;
  test: (c: Card) => boolean;
};

function buildChips(cards: Card[]): Chip[] {
  const chips: Chip[] = [];
  // Payment systems
  const paySystems = new Map<string, number>();
  for (const c of cards) {
    const ps = (c.payment_system ?? "").trim();
    if (!ps) continue;
    // split combined like "Visa/Mastercard"
    for (const part of ps.split(/[\/,]|\s+и\s+/i).map((s) => s.trim()).filter(Boolean)) {
      paySystems.set(part, (paySystems.get(part) ?? 0) + 1);
    }
  }
  for (const [ps] of Array.from(paySystems.entries()).sort((a, b) => b[1] - a[1])) {
    chips.push({
      id: `ps:${ps}`,
      label: ps,
      test: (c) => new RegExp(ps.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(c.payment_system ?? ""),
    });
  }
  // SBP
  if (cards.some((c) => (c.topup_methods ?? []).some((m) => /сбп/i.test(m)))) {
    chips.push({
      id: "sbp",
      label: "СБП-пополнение",
      test: (c) => (c.topup_methods ?? []).some((m) => /сбп/i.test(m)),
    });
  }
  // Apple Pay
  if (cards.some((c) => c.apple_pay)) {
    chips.push({ id: "applepay", label: "Apple Pay", test: (c) => c.apple_pay });
  }
  // Countries
  const countries = new Map<string, number>();
  for (const c of cards) {
    const cc = (c.issuer_country ?? "").trim();
    if (!cc) continue;
    countries.set(cc, (countries.get(cc) ?? 0) + 1);
  }
  for (const [country] of Array.from(countries.entries()).sort((a, b) => b[1] - a[1])) {
    chips.push({
      id: `country:${country}`,
      label: country,
      test: (c) => c.issuer_country === country,
    });
  }
  return chips;
}

export function RatingSection({ cards, withControls = false }: { cards: Card[]; withControls?: boolean }) {
  const [activeChip, setActiveChip] = useState<ChipId | null>(null);
  const [sort, setSort] = useState<SortKey>("rank");
  const sectionRef = useRef<HTMLElement | null>(null);

  const chips = useMemo(() => (withControls ? buildChips(cards) : []), [cards, withControls]);

  useEffect(() => {
    if (!withControls) return;
    function onApply(e: Event) {
      const detail = (e as CustomEvent<{ chip?: ChipId }>).detail;
      if (!detail) return;
      if (detail.chip) setActiveChip(detail.chip);
      requestAnimationFrame(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    window.addEventListener("erapay:apply-filter", onApply as EventListener);
    return () => window.removeEventListener("erapay:apply-filter", onApply as EventListener);
  }, [withControls]);

  const filtered = useMemo(() => {
    if (!withControls) return cards;
    const chip = chips.find((f) => f.id === activeChip);
    const list = chip ? cards.filter(chip.test) : cards;
    const sorted = [...list].sort((a, b) => {
      if (sort === "price") {
        const av = a.issue_cost_rub ?? Number.POSITIVE_INFINITY;
        const bv = b.issue_cost_rub ?? Number.POSITIVE_INFINITY;
        if (av !== bv) return av - bv;
        return a.rank - b.rank;
      }
      if (sort === "speed") {
        const av = a.issue_speed_minutes ?? Number.POSITIVE_INFINITY;
        const bv = b.issue_speed_minutes ?? Number.POSITIVE_INFINITY;
        if (av !== bv) return av - bv;
        return a.rank - b.rank;
      }
      return a.rank - b.rank;
    });
    return sorted;
  }, [cards, chips, activeChip, sort, withControls]);

  const activeChipObj = chips.find((c) => c.id === activeChip) ?? null;

  return (
    <section ref={sectionRef} id="rating" className="scroll-mt-20 border-b border-white/5 bg-background">
      <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-6 flex flex-col gap-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-accent">Рейтинг · 2026</div>
          <h2 className="font-sans text-3xl font-light tracking-tight text-foreground sm:text-4xl">
            15 зарубежных виртуальных карт — от лучших к нишевым
          </h2>
        </div>

        {withControls && (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="-mx-4 flex-1 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
                <div className="flex min-w-max items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveChip(null)}
                    aria-pressed={activeChip === null}
                    className={`btn-pill inline-flex h-9 items-center border px-4 text-xs font-medium backdrop-blur-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                      activeChip === null
                        ? "border-primary/60 bg-primary text-primary-foreground shadow-[0_0_20px_rgba(60,120,170,0.4)]"
                        : "border-white/10 bg-white/[0.04] text-foreground/75 hover:border-white/25 hover:bg-white/[0.08] hover:text-foreground"
                    }`}
                  >
                    Все {cards.length}
                  </button>
                  {chips.map((f) => {
                    const active = activeChip === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setActiveChip(active ? null : f.id)}
                        aria-pressed={active}
                        className={`btn-pill inline-flex h-9 items-center whitespace-nowrap border px-4 text-xs font-medium backdrop-blur-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                          active
                            ? "border-primary/60 bg-primary text-primary-foreground shadow-[0_0_20px_rgba(60,120,170,0.4)]"
                            : "border-white/10 bg-white/[0.04] text-foreground/75 hover:border-white/25 hover:bg-white/[0.08] hover:text-foreground"
                        }`}
                      >
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-xs text-muted-foreground">
                  Сортировка:
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="btn-pill h-9 border border-white/10 bg-white/[0.04] px-3 text-xs font-medium text-foreground backdrop-blur-md focus:border-primary/60 focus:outline-none"
                >
                  <option value="rank" className="bg-black text-foreground">по рейтингу</option>
                  <option value="price" className="bg-black text-foreground">по цене выпуска</option>
                  <option value="speed" className="bg-black text-foreground">по скорости выпуска</option>
                </select>
              </div>
            </div>
            {activeChipObj && (
              <div className="mb-4 text-xs text-muted-foreground">
                Показано {filtered.length} из {cards.length}
              </div>
            )}
          </>
        )}

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-xl">
            <p className="mb-4 text-sm text-muted-foreground">Под этот фильтр карт нет</p>
            <button
              type="button"
              onClick={() => setActiveChip(null)}
              className="btn-pill inline-flex h-9 items-center border border-white/15 bg-white/[0.04] px-4 text-xs font-semibold text-foreground hover:border-white/30 hover:bg-white/[0.08]"
            >
              Сбросить фильтр
            </button>
          </div>
        ) : (
          <>
        {/* Desktop table — glass island */}
        <div className="hidden overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl lg:block">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="w-14 py-4 pl-5">№</th>
                <th className="py-4 pr-4">Сервис</th>
                <th className="min-w-[110px] px-2.5 py-4">Выпуск</th>
                <th className="px-2.5 py-4">Обслуж.</th>
                <th className="px-2.5 py-4">Пополнение</th>
                <th className="min-w-[120px] px-2.5 py-4">Лимит/мес</th>
                <th className="px-2.5 py-4">Скорость</th>
                <th className="hidden px-2.5 py-4 2xl:table-cell">Сервисы</th>
                <th className="px-2.5 py-4">Оценка</th>
                <th className="sticky right-0 bg-[oklch(0.14_0.02_240)] py-4 pl-3 pr-5"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <TableRow key={c.id} card={c} first={i === 0 && sort === "rank" && activeChip === null} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="grid gap-3 lg:hidden">
          {filtered.map((c, i) => (
            <MobileCard key={c.id} card={c} first={i === 0 && sort === "rank" && activeChip === null} />
          ))}
        </div>
          </>
        )}
      </div>
    </section>
  );
}

function TableRow({ card, first }: { card: Card; first: boolean }) {
  const [modalOpen, setModalOpen] = useState(false);
  const serviceSlugs = useMemo(
    () => getCardServiceSlugs(card.slug, card.supported_services_count ?? 0),
    [card.slug, card.supported_services_count],
  );
  const tableSlugs = useMemo(
    () => getTableServiceSlugs(card.slug, serviceSlugs, 3),
    [card.slug, serviceSlugs],
  );
  return (
    <tr className="group relative border-b border-white/8 last:border-b-0 transition-colors hover:bg-white/[0.03]">

      <td className="relative py-5 pl-5 align-top">
        {first && (
          <span
            className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-accent shadow-[0_0_16px_rgba(194,166,51,0.6)]"
            aria-hidden
          />
        )}
        <div
          className={`inline-flex h-9 w-9 items-center justify-center rounded-xl font-sans text-sm font-medium ${
            first
              ? "bg-gradient-to-br from-accent to-[oklch(0.6_0.13_85)] text-accent-foreground shadow-[0_0_18px_rgba(194,166,51,0.4)]"
              : "border border-white/10 bg-white/[0.04] text-foreground"
          }`}
        >
          {card.rank}
        </div>
      </td>
      <td className="py-5 pr-4 align-top">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] font-sans text-sm font-medium text-foreground">
            {initials(card.name)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Link
                to="/cards/$slug"
                params={{ slug: card.slug }}
                className="text-base font-medium text-foreground hover:text-accent"
              >
                {card.name}
              </Link>
              {card.verified && (
                <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-label="проверено" />
              )}
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              {card.payment_system} · {card.issuer_country}
            </div>
            {card.bin_country && (
              <div className="mt-0.5 font-mono text-[11px] text-muted-foreground/80">BIN {card.bin_country}</div>
            )}
            <div className="mt-1.5 flex gap-1.5">
              {card.apple_pay && <Apple className="h-3.5 w-3.5 text-muted-foreground" aria-label="Apple Pay" />}
              {card.google_pay && (
                <Smartphone className="h-3.5 w-3.5 text-muted-foreground" aria-label="Google Pay" />
              )}
              {!card.kyc && <Zap className="h-3.5 w-3.5 text-muted-foreground" aria-label="без KYC" />}
            </div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-2.5 py-5 align-top text-foreground tabular-nums">{noWrapMoney(card.issue_cost)}</td>
      <td className="whitespace-nowrap px-2.5 py-5 align-top text-foreground tabular-nums">{noWrapMoney(card.service_cost)}</td>
      <td className="whitespace-nowrap px-2.5 py-5 align-top text-foreground tabular-nums">{noWrapMoney(card.topup_fee)}</td>
      <td className="whitespace-nowrap px-2.5 py-5 align-top tabular-nums">
        {card.monthly_limit ? (
          <span className="text-foreground">{noWrapMoney(card.monthly_limit)}</span>
        ) : (
          <span className="text-muted-foreground/70">нет данных</span>
        )}
      </td>
      <td className="whitespace-nowrap px-2.5 py-5 align-top tabular-nums">
        {card.issue_speed ? (
          <span className="text-foreground">{noWrapMoney(card.issue_speed)}</span>
        ) : (
          <span className="text-muted-foreground/70">нет данных</span>
        )}
      </td>
      <td className="hidden px-2.5 py-5 align-top 2xl:table-cell">
        <ServicePreview
          slugs={tableSlugs}
          total={serviceSlugs.length}
          onOpen={() => setModalOpen(true)}
        />
      </td>
      <td className="px-2.5 py-5 align-top">
        <ScoreBadge score={Number(card.editorial_score)} reviews={card.reviews_count ?? 0} />
      </td>
      <td className="sticky right-0 bg-[oklch(0.14_0.02_240)] py-5 pl-3 pr-5 align-top group-hover:bg-[oklch(0.17_0.02_240)]">
        <div className="flex items-center justify-end gap-2">
          <Link
            to="/cards/$slug"
            params={{ slug: card.slug }}
            className="btn-pill inline-flex h-9 items-center border border-white/15 bg-white/[0.04] px-4 text-xs font-medium text-foreground backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/[0.08]"
          >
            Обзор
          </Link>
          <a
            href={card.affiliate_url ?? "#"}
            target="_blank"
            rel="nofollow sponsored noopener"
            className={`btn-pill inline-flex h-9 items-center gap-1 px-4 text-xs font-medium transition-all ${
              first
                ? "bg-gradient-to-r from-accent to-[oklch(0.6_0.13_85)] text-accent-foreground shadow-[0_0_20px_rgba(194,166,51,0.45)] hover:shadow-[0_0_30px_rgba(194,166,51,0.65)]"
                : "bg-primary text-primary-foreground shadow-[0_0_18px_rgba(60,120,170,0.35)] hover:bg-primary/90 hover:shadow-[0_0_28px_rgba(60,120,170,0.55)]"
            }`}
          >
            Оформить
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </td>
      <ServicesModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        cardName={card.name}
        slugs={serviceSlugs}
      />
    </tr>
  );
}

function ScoreBadge({ score, reviews }: { score: number; reviews: number }) {
  const has = score > 0;
  const label = score >= 4.5 ? "Отлично" : score >= 4 ? "Хорошо" : score >= 3 ? "Средне" : "Низко";
  if (!has) {
    return (
      <div className="inline-flex flex-col items-start gap-0.5">
        <span className="btn-pill inline-flex items-center border border-destructive/40 bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive backdrop-blur-md">
          нет оценок
        </span>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <span className="btn-pill inline-flex w-fit items-center gap-1.5 border border-primary/40 bg-primary/15 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-md">
        <span className="font-sans text-sm font-medium tabular-nums text-accent">{score.toFixed(1)}</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      </span>
      <div className="text-[11px] text-muted-foreground">{reviews} отзывов</div>
    </div>
  );
}

function MobileCard({ card, first }: { card: Card; first: boolean }) {
  const [modalOpen, setModalOpen] = useState(false);
  const serviceSlugs = useMemo(
    () => getCardServiceSlugs(card.slug, card.supported_services_count ?? 0),
    [card.slug, card.supported_services_count],
  );
  const tableSlugs = useMemo(
    () => getTableServiceSlugs(card.slug, serviceSlugs, 4),
    [card.slug, serviceSlugs],
  );
  return (
    <article
      className={`relative overflow-hidden rounded-3xl border bg-white/[0.04] p-5 backdrop-blur-xl transition-all ${
        first
          ? "border-accent/40 shadow-[0_0_30px_rgba(194,166,51,0.2),0_20px_50px_rgba(0,0,0,0.5)]"
          : "border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
      }`}
    >
      {first && (
        <span
          className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-accent shadow-[0_0_16px_rgba(194,166,51,0.6)]"
          aria-hidden
        />
      )}
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-sans text-sm font-medium ${
            first
              ? "bg-gradient-to-br from-accent to-[oklch(0.6_0.13_85)] text-accent-foreground shadow-[0_0_16px_rgba(194,166,51,0.4)]"
              : "border border-white/10 bg-white/[0.05] text-foreground"
          }`}
        >
          {card.rank}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] font-sans text-sm font-medium text-foreground">
          {initials(card.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Link
              to="/cards/$slug"
              params={{ slug: card.slug }}
              className="truncate text-base font-medium text-foreground hover:text-accent"
            >
              {card.name}
            </Link>
            {card.verified && <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-accent" />}
          </div>
          <div className="text-xs text-muted-foreground">
            {card.payment_system} · {card.issuer_country}
          </div>
        </div>
        <ScoreBadge score={Number(card.editorial_score)} reviews={card.reviews_count ?? 0} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-white/10 pt-4 text-xs">
        <Row label="Выпуск" value={noWrapMoney(card.issue_cost)} nowrap />
        <Row label="Обслуж." value={noWrapMoney(card.service_cost)} nowrap />
        <Row label="Пополнение" value={noWrapMoney(card.topup_fee)} nowrap />
        <Row label="Лимит" value={card.monthly_limit ? noWrapMoney(card.monthly_limit) : null} nowrap />
        <Row label="Скорость" value={card.issue_speed ? noWrapMoney(card.issue_speed) : null} nowrap />
        <Row label="BIN" value={card.bin_country} mono />
      </dl>
      {serviceSlugs.length > 0 && (
        <div className="mt-4 border-t border-white/10 pt-4">
          <ServicePreview
            slugs={tableSlugs}
            total={serviceSlugs.length}
            onOpen={() => setModalOpen(true)}
          />
        </div>
      )}

      <div className="mt-5 flex gap-2">
        <Link
          to="/cards/$slug"
          params={{ slug: card.slug }}
          className="btn-pill inline-flex h-10 flex-1 items-center justify-center border border-white/15 bg-white/[0.04] px-4 text-xs font-medium text-foreground backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/[0.08]"
        >
          Обзор
        </Link>
        <a
          href={card.affiliate_url ?? "#"}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="btn-pill inline-flex h-10 flex-1 items-center justify-center gap-1 bg-primary px-4 text-xs font-medium text-primary-foreground shadow-[0_0_18px_rgba(60,120,170,0.35)] transition-all hover:bg-primary/90 hover:shadow-[0_0_28px_rgba(60,120,170,0.55)]"
        >
          Оформить
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </a>
      </div>
      <ServicesModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        cardName={card.name}
        slugs={serviceSlugs}
      />
    </article>
  );
}

function Row({ label, value, mono, nowrap }: { label: string; value: string | null; mono?: boolean; nowrap?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={`text-right font-medium ${mono ? "font-mono " : ""}${nowrap ? "whitespace-nowrap tabular-nums " : ""}${
          value ? "text-foreground" : "text-muted-foreground/70"
        }`}
      >
        {value ?? "нет данных"}
      </dd>
    </div>
  );
}
