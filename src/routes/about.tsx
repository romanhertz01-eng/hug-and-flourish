import { createFileRoute, Link } from "@tanstack/react-router";
import { InfoShell, H2, P, UL } from "@/components/nhcard/InfoShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Payqo — редакция и подход к рейтингу карт" },
      {
        name: "description",
        content:
          "Кто стоит за Payqo, как устроен мониторинг зарубежных виртуальных карт для россиян и почему мы не выпускаем карты сами.",
      },
      { property: "og:title", content: "Payqo — редакция и подход к рейтингу карт" },
      {
        property: "og:description",
        content:
          "Независимая редакция, следящая за рынком зарубежных виртуальных карт для российских пользователей.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <InfoShell
      eyebrow="О проекте"
      title="Payqo: независимый взгляд на зарубежные карты"
      lead="Мы не банк, не платёжный сервис и карты не выпускаем. С 2022 года наблюдаем за рынком: сравниваем условия эмитентов, тестируем продукты и помогаем подобрать зарубежную виртуальную карту под конкретную задачу."
    >
      <H2>Чем мы занимаемся</H2>
      <P>
        Payqo — независимая редакция, которая отслеживает зарубежные виртуальные карты, доступные
        пользователям из России. Мы читаем тарифы эмитентов, проверяем их на практике, собираем
        мнения владельцев и фиксируем, что работает прямо сейчас, а что перестало приниматься.
      </P>
      <P>
        Сами карты мы не выпускаем, платежи не принимаем и деньги пользователей не храним —
        финансовых услуг Payqo не оказывает. Всё оформление и обслуживание идёт через эмитента;
        условия у него могут меняться, поэтому перед оплатой их всегда стоит перепроверять.
      </P>

      <H2>Зачем это нужно</H2>
      <P>
        Весной 2022 года платить за зарубежные сервисы из России стало намного сложнее. Рынок
        «карт-заменителей» разросся буквально за пару месяцев, а вместе с ним — количество
        сомнительных предложений. Payqo появился, чтобы отделять реально работающие продукты от
        аккуратно оформленных лендингов и показывать понятную картину: что карта действительно
        оплачивает, во сколько она обходится и где заканчиваются её возможности.
      </P>

      <H2>Кто ведёт проект</H2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-accent">Автор</div>
          <div className="mt-1 font-serif text-lg font-bold text-primary">Дмитрий Соколовский</div>
          <div className="mt-2 text-sm text-muted-foreground">
            Возглавляет редакцию Payqo. Девять лет разбирает международные платежи и финтех-продукты.
          </div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-accent">Фактчек</div>
          <div className="mt-1 font-serif text-lg font-bold text-primary">Марина Вишневская</div>
          <div className="mt-2 text-sm text-muted-foreground">
            Аналитик Payqo. Проверяет тарифы, лимиты и условия эмитентов до того, как материал уходит в публикацию.
          </div>
        </div>
      </div>

      <H2>В цифрах</H2>
      <UL>
        <li>41 сервис выпуска карт прошёл через наш анализ</li>
        <li>15 продуктов формируют текущий рейтинг</li>
        <li>5 200+ отзывов пользователей обработано редакцией</li>
      </UL>

      <H2>Как строится оценка</H2>
      <P>
        Рейтинговый балл собирается по{" "}
        <Link to="/methodology" className="text-primary underline decoration-primary/40 hover:decoration-primary">
          методологии
        </Link>{" "}
        из пяти критериев с зафиксированными весами. Отдельная тема —{" "}
        <Link to="/editorial-policy" className="text-primary underline decoration-primary/40 hover:decoration-primary">
          редакционная независимость
        </Link>
        : рекламные размещения отделены от рейтинга и технически, и организационно.
      </P>
    </InfoShell>
  );
}
