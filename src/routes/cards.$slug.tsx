import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ShieldCheck,
  Check,
  Zap,
  Apple,
  CreditCard,
  ShieldOff,
  Star,
  ChevronRight,
  Wallet,
  Sparkles,
  Coins,
} from "lucide-react";

import { SiteHeader } from "@/components/nhcard/Header";
import { SiteFooter } from "@/components/nhcard/Footer";
import { ReviewsSection } from "@/components/nhcard/Reviews";
import { ServicesModal, ServicePreview } from "@/components/nhcard/ServicesModal";
import { cardBySlugQueryOptions, cardsQueryOptions, formatDate, initials } from "@/lib/cards";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { getCardServiceSlugs } from "@/lib/services";
import { noWrapMoney } from "@/lib/format";
import { PUBLIC_ROBOTS } from "@/lib/config";

type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];

export const Route = createFileRoute("/cards/$slug")({
  head: ({ loaderData }) => {
    const data = loaderData as { name?: string; slug?: string } | undefined;
    const name = data?.name ?? "Карта";
    const slug = data?.slug ?? "";
    const url = `https://payqo.ru/cards/${slug}`;
    return {
      meta: [
        { title: `${name} — обзор и тарифы · Payqo` },
        { name: "description", content: `Условия, лимиты и способы пополнения карты ${name}. Проверено редакцией Payqo.` },
        { property: "og:title", content: `${name} — обзор и тарифы · Payqo` },
        { property: "og:description", content: `Условия, лимиты и способы пополнения карты ${name}. Проверено редакцией Payqo.` },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { name: "robots", content: PUBLIC_ROBOTS },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  loader: async ({ context, params }) => {
    const card = await context.queryClient.ensureQueryData(cardBySlugQueryOptions(params.slug));
    if (!card) throw notFound();
    await context.queryClient.ensureQueryData(cardsQueryOptions);
    return { name: card.name, slug: card.slug };
  },
  component: CardPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-3xl font-bold text-foreground">Карта не найдена</h1>
        <p className="mt-3 text-muted-foreground">Проверьте адрес или вернитесь к рейтингу.</p>
        <Link to="/" className="btn-pill mt-6 inline-flex h-11 items-center bg-primary px-5 text-sm font-semibold text-primary-foreground">
          К рейтингу
        </Link>
      </div>
      <SiteFooter />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-muted-foreground">Ошибка: {error.message}</div>
  ),
});

function Chip({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <span className="glass inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-foreground">
      <Icon className="h-3.5 w-3.5 text-accent" />
      {label}
    </span>
  );
}

function Tile({ label, value, nowrap }: { label: string; value: string | null | undefined; nowrap?: boolean }) {
  const display = nowrap && value ? noWrapMoney(value) : value;
  return (
    <div className="glass rounded-2xl border border-white/10 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className={`mt-1.5 text-lg font-bold text-foreground${nowrap ? " whitespace-nowrap tabular-nums" : ""}`}>{display || "—"}</div>
    </div>
  );
}

type TocItem = { id: string; label: string };

function SideToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive((visible[0].target as HTMLElement).id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) obs.observe(el);
    });
    observers.push(obs);
    return () => observers.forEach((o) => o.disconnect());
  }, [items]);

  return (
    <>
      {/* Desktop sticky */}
      <aside className="hidden lg:block">
        <nav className="glass sticky top-24 rounded-2xl border border-white/10 p-3">
          <div className="mb-2 px-3 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            На этой странице
          </div>
          <ul className="space-y-0.5">
            {items.map((i) => {
              const isActive = active === i.id;
              return (
                <li key={i.id}>
                  <a
                    href={`#${i.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(i.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                      setActive(i.id);
                    }}
                    className={`relative block rounded-xl px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-white/[0.06] text-foreground"
                        : "text-muted-foreground hover:bg-white/[0.03] hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-primary" />
                    )}
                    {i.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      {/* Mobile horizontal tabs */}
      <nav className="lg:hidden -mx-4 mb-6 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
        <ul className="flex gap-2 whitespace-nowrap pb-1">
          {items.map((i) => {
            const isActive = active === i.id;
            return (
              <li key={i.id}>
                <a
                  href={`#${i.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(i.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    setActive(i.id);
                  }}
                  className={`glass btn-pill inline-flex items-center border px-3.5 py-1.5 text-xs font-medium ${
                    isActive
                      ? "border-primary/50 bg-primary/15 text-foreground"
                      : "border-white/10 text-muted-foreground"
                  }`}
                >
                  {i.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

function Eyebrow({ children, tone = "steel" }: { children: React.ReactNode; tone?: "steel" | "gold" }) {
  return (
    <div
      className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${
        tone === "gold" ? "text-accent" : "text-primary"
      }`}
    >
      {children}
    </div>
  );
}

function Section({
  id,
  eyebrow,
  eyebrowTone,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  eyebrowTone?: "steel" | "gold";
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 py-12">
      <Eyebrow tone={eyebrowTone}>{eyebrow}</Eyebrow>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function CardPage() {
  const { slug } = Route.useParams();
  const { data: card } = useSuspenseQuery(cardBySlugQueryOptions(slug));
  const { data: allCards = [] } = useSuspenseQuery(cardsQueryOptions);
  const [modalOpen, setModalOpen] = useState(false);

  const topupMethods = card?.topup_methods ?? [];
  const hasSbp = useMemo(
    () => topupMethods.some((m) => /сбп|sbp/i.test(m)),
    [topupMethods],
  );

  const related = useMemo(
    () => allCards.filter((c) => c.slug !== slug).slice(0, 4),
    [allCards, slug],
  );

  const serviceSlugs = useMemo(() => {
    if (!card) return [] as string[];
    return getCardServiceSlugs(
      card.slug,
      card.supported_services_count ?? card.top_services?.length ?? 0,
    );
  }, [card]);
  const servicesTotal = serviceSlugs.length;

  const { data: reviewAgg } = useSuspenseQuery({
    queryKey: ["reviews_agg", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("card_slug", slug)
        .eq("status", "published");
      if (error) throw error;
      const rows = (data ?? []) as Pick<ReviewRow, "rating">[];
      if (rows.length === 0) return { avg: 0, count: 0 };
      const sum = rows.reduce((s, r) => s + r.rating, 0);
      return { avg: sum / rows.length, count: rows.length };
    },
  });

  if (!card) return null;

  const chips: { icon: React.ComponentType<{ className?: string }>; label: string }[] = [];
  if (hasSbp) chips.push({ icon: Check, label: "Пополнение через СБП" });
  if (card.apple_pay) chips.push({ icon: Apple, label: "Apple Pay" });
  if (card.google_pay) chips.push({ icon: CreditCard, label: "Google Pay" });
  if (!card.kyc) chips.push({ icon: ShieldOff, label: "Без KYC" });
  if (card.issue_speed) chips.push({ icon: Zap, label: `Выпуск за ${card.issue_speed}` });
  if (card.verified) chips.push({ icon: ShieldCheck, label: "Проверено редакцией" });

  const steps = [
    {
      t: "Перейдите к эмитенту",
      d: `Откройте сайт ${card.bank ?? "эмитента"} по кнопке выше — это официальная страница карты.`,
    },
    {
      t: "Выберите тип карты",
      d: `Выберите тариф ${card.name} — платёжная система ${card.payment_system ?? ""}${card.card_currency?.length ? `, валюта ${card.card_currency.join("/")}` : ""}.`,
    },
    {
      t: card.kyc ? "Пройдите верификацию (KYC)" : "Регистрация без KYC",
      d: card.kyc
        ? "Загрузите паспорт и селфи по инструкции — верификация обычно занимает 15–60 минут."
        : "Достаточно телефона и email — верификация паспортом не требуется.",
    },
    {
      t: "Пополните и оплачивайте",
      d: hasSbp
        ? "Переведите рубли через СБП — карта конвертирует их в валюту баланса и готова к оплате."
        : "Пополните карту доступным способом и используйте её в форме оплаты сервиса.",
    },
  ];

  const url = `https://payqo.ru/cards/${card.slug}`;
  const productLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: card.name,
    description: `Виртуальная карта ${card.name} — обзор, тарифы и способы пополнения.`,
    brand: card.bank ? { "@type": "Brand", name: card.bank } : undefined,
    url,
  };
  if (reviewAgg.count > 0) {
    productLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: reviewAgg.avg.toFixed(2),
      reviewCount: reviewAgg.count,
      bestRating: 5,
      worstRating: 1,
    };
  }
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: "https://payqo.ru/" },
      { "@type": "ListItem", position: 2, name: "Рейтинг карт", item: "https://payqo.ru/#rating" },
      { "@type": "ListItem", position: 3, name: card.name, item: url },
    ],
  };

  const tocItems: TocItem[] = [
    { id: "about", label: "О сервисе" },
    { id: "pricing", label: "Тарифы" },
    { id: "issue", label: "Как оформить" },
    { id: "topup", label: "Как пополнить" },
    ...(servicesTotal > 0 ? [{ id: "services", label: "Сервисы" }] : []),
    { id: "reviews", label: "Отзывы" },
    ...(related.length > 0 ? [{ id: "related", label: "Похожие карты" }] : []),
  ];

  const priceTiles = [
    {
      icon: Sparkles,
      title: "Выпуск карты",
      desc: "Единовременная плата за оформление и активацию карты.",
      price: card.issue_cost,
    },
    {
      icon: Wallet,
      title: "Обслуживание",
      desc: "Регулярная плата за ведение счёта и обслуживание карты.",
      price: card.service_cost,
    },
    {
      icon: Coins,
      title: "Комиссия пополнения",
      desc: "Сколько удерживается при зачислении средств на баланс.",
      price: card.topup_fee,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <main className="relative">
        {/* Ambient background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px]"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 0%, rgba(60,120,170,0.25), transparent 70%), radial-gradient(50% 40% at 90% 10%, rgba(194,166,51,0.12), transparent 70%)",
          }}
        />

        <div className="mx-auto max-w-[1200px] px-4 pt-10 sm:px-6 lg:px-8">
          <nav aria-label="Хлебные крошки" className="mb-6 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Главная</Link>
            <ChevronRight className="h-3 w-3" aria-hidden />
            <Link to="/" hash="rating" className="hover:text-foreground">Рейтинг карт</Link>
            <ChevronRight className="h-3 w-3" aria-hidden />
            <span className="text-foreground">{card.name}</span>
          </nav>

          {/* HERO glass panel */}
          <section
            id="about"
            className="glass-strong scroll-mt-28 rounded-3xl border border-white/10 p-6 sm:p-10"
          >
            <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
              <div className="min-w-0">
                <div className="flex items-start gap-5">
                  <div className="glass flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/15 text-xl font-bold text-foreground">
                    {initials(card.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Eyebrow tone="gold">Место в рейтинге · #{card.rank}</Eyebrow>
                    <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                      {card.name}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                      {card.payment_system && <span>{card.payment_system}</span>}
                      {card.bank && (<><span aria-hidden>·</span><span>{card.bank}</span></>)}
                      {card.issuer_country && (<><span aria-hidden>·</span><span>{card.issuer_country}</span></>)}
                    </div>
                  </div>
                </div>

                {chips.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {chips.map((c) => (
                      <Chip key={c.label} icon={c.icon} label={c.label} />
                    ))}
                  </div>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href={card.affiliate_url ?? "#"}
                    target="_blank"
                    rel="nofollow sponsored noopener"
                    className="btn-pill inline-flex h-11 items-center bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_0_40px_-8px_rgba(60,120,170,0.7)] hover:brightness-110"
                  >
                    Перейти на сайт
                  </a>
                  <Link
                    to="/"
                    hash="rating"
                    className="btn-pill glass inline-flex h-11 items-center border border-white/15 px-5 text-sm font-semibold text-foreground hover:border-white/30"
                  >
                    К рейтингу
                  </Link>
                  {card.last_checked ? (
                    <span className="text-xs text-muted-foreground">
                      Проверено {formatDate(card.last_checked)}
                    </span>
                  ) : null}
                </div>
              </div>

              <aside className="glass rounded-2xl border border-white/10 p-6">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Редакционная оценка
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-foreground">
                    {Number(card.editorial_score).toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">/ 10</span>
                </div>
                <div className="mt-4 border-t border-white/10 pt-4">
                  {reviewAgg.count > 0 ? (
                    <>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            className={
                              n <= Math.round(reviewAgg.avg)
                                ? "h-4 w-4 fill-accent text-accent"
                                : "h-4 w-4 text-white/20"
                            }
                            aria-hidden
                          />
                        ))}
                        <span className="ml-1 text-sm font-semibold text-foreground">
                          {reviewAgg.avg.toFixed(1)}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Средняя оценка · {reviewAgg.count} отзывов
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      Пользовательских отзывов пока нет — станьте первым ниже.
                    </div>
                  )}
                </div>
                {card.verified && (
                  <div className="glass mt-4 inline-flex items-center gap-1.5 rounded-full border border-accent/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent">
                    <ShieldCheck className="h-3.5 w-3.5" /> Проверено
                  </div>
                )}
              </aside>
            </div>
          </section>
        </div>

        {/* Content grid with sticky TOC */}
        <div className="mx-auto mt-6 max-w-[1200px] px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
            <SideToc items={tocItems} />

            <div className="min-w-0">
              {/* PRICING TILES */}
              <Section id="pricing" eyebrow="Стоимость" eyebrowTone="gold" title={`Тарифы ${card.name}`}>
                <div className="grid gap-4 md:grid-cols-3">
                  {priceTiles.map((t) => (
                    <div
                      key={t.title}
                      className="glass flex h-full flex-col rounded-2xl border border-white/10 p-6"
                    >
                      <div className="glass flex h-11 w-11 items-center justify-center rounded-xl border border-white/10">
                        <t.icon className="h-5 w-5 text-accent" aria-hidden />
                      </div>
                      <div className="mt-4 text-lg font-semibold text-foreground">{t.title}</div>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
                      <div className="mt-5 whitespace-nowrap text-3xl font-bold tabular-nums text-foreground">
                        {t.price ? noWrapMoney(t.price) : "—"}
                      </div>
                      <a
                        href={card.affiliate_url ?? "#"}
                        target="_blank"
                        rel="nofollow sponsored noopener"
                        className="btn-pill glass mt-6 inline-flex h-10 items-center justify-center border border-white/15 px-5 text-sm font-semibold text-foreground hover:border-primary/50 hover:bg-primary/15"
                      >
                        Выбрать
                      </a>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Eyebrow>Условия</Eyebrow>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Tile label="Лимит в месяц" value={card.monthly_limit} nowrap />
                    <Tile label="Скорость выпуска" value={card.issue_speed} nowrap />
                    <Tile label="KYC" value={card.kyc ? "требуется" : "не требуется"} />
                    <Tile
                      label="Способы пополнения"
                      value={(card.topup_methods ?? []).join(", ") || null}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <Eyebrow>Технически</Eyebrow>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Tile label="Платёжная система" value={card.payment_system} />
                    <Tile label="Страна выпуска" value={card.issuer_country} />
                    <Tile label="Банк-эмитент" value={card.bank} />
                    <Tile label="BIN страны" value={card.bin_country} />
                    <Tile
                      label="Валюты карты"
                      value={(card.card_currency ?? []).join(", ") || null}
                    />
                    <Tile label="Apple Pay" value={card.apple_pay ? "поддерживается" : "нет"} />
                    <Tile label="Google Pay" value={card.google_pay ? "поддерживается" : "нет"} />
                    <Tile
                      label="Сервисов поддерживается"
                      value={servicesTotal > 0 ? String(servicesTotal) : null}
                    />
                  </div>
                </div>
              </Section>

              {/* HOW TO ISSUE — 3 steps + optional 4th */}
              <Section id="issue" eyebrow="Инструкция" title={`Как оформить ${card.name}`}>
                <ol className="grid gap-4 md:grid-cols-3">
                  {steps.slice(0, 3).map((s, i) => (
                    <li key={s.t} className="glass rounded-2xl border border-white/10 p-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-primary/15 text-lg font-bold text-foreground">
                        {i + 1}
                      </div>
                      <div className="mt-4 text-lg font-semibold text-foreground">{s.t}</div>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                    </li>
                  ))}
                </ol>
                {steps[3] && (
                  <div className="glass mt-4 rounded-2xl border border-white/10 p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/15 text-lg font-bold text-foreground">
                        4
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-foreground">{steps[3].t}</div>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{steps[3].d}</p>
                      </div>
                    </div>
                  </div>
                )}
              </Section>

              {/* HOW TO TOP UP */}
              <Section id="topup" eyebrow="Пополнение" eyebrowTone="gold" title={`Как пополнить ${card.name}`}>
                <div className="glass rounded-2xl border border-white/10 p-6 sm:p-8">
                  <p className="text-base leading-relaxed text-foreground/90">
                    {hasSbp
                      ? `Пополнение через СБП — самый быстрый способ: перевод занимает 1–5 минут. Рубли автоматически конвертируются${card.card_currency?.length ? ` в валюту карты (${card.card_currency.join("/")})` : ""}, поэтому проверяйте актуальный курс и оставляйте небольшой запас на комиссию сервиса при оплате. Комиссия пополнения${card.topup_fee ? ` — ${card.topup_fee}` : ""}.`
                      : `Пополните карту доступным способом (${(card.topup_methods ?? []).join(", ") || "смотрите на сайте эмитента"}). Средства конвертируются${card.card_currency?.length ? ` в валюту карты (${card.card_currency.join("/")})` : ""} — проверяйте курс и оставляйте небольшой запас на комиссию сервиса при оплате.`}
                  </p>
                </div>
              </Section>

              {/* SERVICES */}
              {servicesTotal > 0 && (
                <Section id="services" eyebrow="Поддержка" title="Поддерживаемые сервисы">
                  <div className="glass rounded-2xl border border-white/10 p-6">
                    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
                      <div className="text-sm text-muted-foreground">
                        Всего {servicesTotal} сервисов
                      </div>
                      <button
                        type="button"
                        onClick={() => setModalOpen(true)}
                        className="text-sm font-semibold text-accent hover:underline"
                      >
                        Все {servicesTotal} сервисов →
                      </button>
                    </div>
                    <ServicePreview
                      slugs={serviceSlugs}
                      total={servicesTotal}
                      onOpen={() => setModalOpen(true)}
                    />
                  </div>
                  <ServicesModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    cardName={card.name}
                    slugs={serviceSlugs}
                  />
                </Section>
              )}

              {/* REVIEWS */}
              <section id="reviews" className="scroll-mt-28 py-12">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <Eyebrow tone="gold">Мнение пользователей</Eyebrow>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      Отзывы о карте
                    </h2>
                  </div>
                  <Link
                    to="/cards/$slug/reviews"
                    params={{ slug: card.slug }}
                    className="text-sm font-semibold text-accent hover:underline"
                  >
                    Все отзывы →
                  </Link>
                </div>
                <div className="mt-6">
                  <ReviewsSection cardSlug={card.slug} cardName={card.name} />
                </div>
              </section>

              {/* RELATED */}
              {related.length > 0 && (
                <Section id="related" eyebrow="Смежное" title="Похожие карты">
                  <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <Link
                          to="/cards/$slug"
                          params={{ slug: r.slug }}
                          className="glass block h-full rounded-2xl border border-white/10 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="glass flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-sm font-bold text-foreground">
                              {initials(r.name)}
                            </div>
                            <div className="text-lg font-bold text-foreground">
                              {Number(r.editorial_score).toFixed(1)}
                            </div>
                          </div>
                          <div className="mt-3 text-lg font-semibold text-foreground">{r.name}</div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {r.payment_system}
                            {r.issuer_country ? ` · ${r.issuer_country}` : ""}
                          </div>
                          <div className="mt-3 text-xs font-semibold text-accent">Подробнее →</div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <Link to="/" className="hover:text-foreground">Вернуться к рейтингу</Link>
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Payqo не является эмитентом карты. Условия могут меняться — проверяйте информацию на сайте эмитента.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
