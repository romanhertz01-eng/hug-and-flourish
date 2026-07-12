import { ShieldCheck, Users, Globe2, Link2, XCircle, Lock, AlertCircle } from "lucide-react";
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
            "radial-gradient(1200px 600px at 15% 10%, rgba(60,120,170,0.22), transparent 60%), radial-gradient(900px 500px at 90% 20%, rgba(194,166,51,0.14), transparent 60%), radial-gradient(700px 500px at 50% 100%, rgba(60,120,170,0.18), transparent 65%), linear-gradient(180deg, #000000 0%, #060B19 60%, #000000 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.25] mix-blend-screen"
        style={{
          background:
            "radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,0.35), transparent 60%), radial-gradient(1.5px 1.5px at 70% 60%, rgba(255,255,255,0.25), transparent 60%), radial-gradient(1px 1px at 40% 80%, rgba(255,255,255,0.3), transparent 60%)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1240px] items-start gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.35fr_1fr] lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-foreground/80 backdrop-blur-md">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(194,166,51,0.8)]" />
            Мы не продаём карты. Мы проверяем, сравниваем и помогаем выбрать.
          </div>

          <h1 className="font-sans text-4xl font-light leading-[1.05] tracking-[-0.03em] text-foreground sm:text-5xl lg:text-[64px]">
            Карты российских банков больше не работают за рубежом.{" "}
            <span className="bg-gradient-to-r from-[oklch(0.82_0.08_240)] via-[oklch(0.68_0.09_245)] to-[oklch(0.82_0.13_90)] bg-clip-text font-normal text-transparent">
              Мы нашли те, что работают.
            </span>
          </h1>

          <p className="mt-6 max-w-[620px] text-[17px] leading-relaxed text-muted-foreground">
            Не можете оплатить ChatGPT, Netflix или продлить подписку? Российские карты не принимают
            в App&nbsp;Store, Google&nbsp;Play, Booking и на большинстве зарубежных сайтов.
            Payqo — независимый мониторинг международных виртуальных карт, которые работают из России.
            Сравниваем условия, тарифы и надёжность эмитентов — чтобы вы выбрали за пару минут,
            а не искали методом проб и ошибок.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#rating"
              className="btn-pill inline-flex h-12 items-center bg-primary px-7 text-sm font-medium text-primary-foreground shadow-[0_0_30px_rgba(60,120,170,0.4)] transition-all hover:bg-primary/90 hover:shadow-[0_0_45px_rgba(60,120,170,0.65)]"
            >
              К рейтингу карт →
            </a>
            <Link
              to="/podbor"
              className="btn-pill inline-flex h-12 items-center border border-white/15 bg-white/[0.04] px-7 text-sm font-medium text-foreground backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/[0.08]"
            >
              Подобрать под задачу
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap gap-2">
            <Chip icon={<Users className="h-3.5 w-3.5" />}>{total} сервисов в рейтинге</Chip>
            <Chip icon={<Globe2 className="h-3.5 w-3.5" />}>7 стран выпуска</Chip>
            <Chip icon={<ShieldCheck className="h-3.5 w-3.5" />} tone="accent">
              Проверено редакцией
            </Chip>
            <Chip icon={<Link2 className="h-3.5 w-3.5" />}>Партнёрские ссылки раскрыты</Chip>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <XCircle className="h-3.5 w-3.5" aria-hidden />
              Отклоняют оплату
            </span>
            <span aria-hidden className="text-white/20">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" aria-hidden />
              Блокируют карту
            </span>
            <span aria-hidden className="text-white/20">·</span>
            <span className="inline-flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden />
              Скрытые комиссии съедают бюджет
            </span>
            <a href="#rating" className="font-medium text-accent hover:underline">
              → Разбираемся, где этого нет
            </a>
          </div>
        </div>

        <aside className="self-start rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Кто составляет рейтинг
          </div>

          <div className="mt-5 flex items-start gap-4 border-b border-white/10 pb-5">
            <Avatar initials="ДС" />
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-accent">Автор</div>
              <div className="mt-0.5 font-sans text-lg font-medium text-foreground">Дмитрий Соколовский</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Главный редактор Payqo. 9 лет пишет о международных платежах и финтехе.
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-4">
            <Avatar initials="МВ" tone="accent" />
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-accent">Фактчек</div>
              <div className="mt-0.5 font-sans text-lg font-medium text-foreground">Марина Вишневская</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Финтех-аналитик Payqo. Сверила тарифы и условия эмитентов.
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Что обновилось
            </div>
            <ul className="mt-2 space-y-1.5 text-sm text-foreground/85">
              <li>· «Плати&nbsp;по&nbsp;миру» вернул выпуск за 2&nbsp;минуты</li>
              <li>· WantToPay снизил обслуживание до 0&nbsp;₽</li>
              <li>· Heleket добавил поддержку USDT&nbsp;TRC-20</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Chip({
  children,
  icon,
  tone,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  tone?: "accent";
}) {
  const cls =
    tone === "accent"
      ? "border-accent/40 bg-accent/10 text-accent"
      : "border-white/12 bg-white/[0.04] text-foreground/80";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-md ${cls}`}
    >
      {icon}
      {children}
    </span>
  );
}

function Avatar({ initials, tone }: { initials: string; tone?: "accent" }) {
  const cls =
    tone === "accent"
      ? "bg-gradient-to-br from-accent to-[oklch(0.6_0.13_85)] text-accent-foreground shadow-[0_0_20px_rgba(194,166,51,0.35)]"
      : "bg-gradient-to-br from-primary to-[oklch(0.42_0.09_245)] text-primary-foreground shadow-[0_0_20px_rgba(60,120,170,0.4)]";
  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-sans text-sm font-medium ${cls}`}
    >
      {initials}
    </div>
  );
}
