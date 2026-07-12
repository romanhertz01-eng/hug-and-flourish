import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQ_ITEMS = [
  {
    q: "Зачем в 2026 нужна виртуальная карта иностранного банка?",
    a: "Это цифровой Visa или Mastercard, выпущенный эмитентом за пределами России. Карты российских банков за границей не принимаются, поэтому зарубежная виртуалка остаётся рабочим способом платить за ChatGPT, Netflix, Steam, рекламные кабинеты и любые подписки.",
  },
  {
    q: "Сколько ждать выпуск карты?",
    a: "Большинство сервисов выдают реквизиты моментально или в пределах 10–15 минут после оплаты. Премиальные продукты с собственным IBAN оформляются дольше — обычно 1–3 рабочих дня.",
  },
  {
    q: "Реально ли пополнить такую карту через СБП?",
    a: "Да, эту опцию поддерживают 7 из 10 сервисов нашего топа. Зачисление проходит за 1–5 минут, комиссия держится в диапазоне 0–4%. Учтите суточный лимит СБП — 100 000 ₽.",
  },
  {
    q: "Обязан ли я сообщать в ФНС об открытии счёта за рубежом?",
    a: "Да. На подачу уведомления по форме КНД 1120107 отводится 30 дней с момента открытия — оно оформляется через личный кабинет налогоплательщика. Дополнительно раз в год, до 1 июня, сдаётся отчёт о движении средств. Штраф за пропуск — 4–5 тыс. ₽.",
  },
  {
    q: "Какой пакет документов потребуется?",
    a: "Базовый набор — паспорт РФ и мобильный номер. Для премиум-тарифов с месячными лимитами от $10 000 дополнительно попросят загранпаспорт и подтверждение происхождения средств.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-20 border-t border-border bg-background">
      <div className="mx-auto max-w-[900px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            FAQ
          </div>
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Частые вопросы
          </h2>
        </div>

        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-md border border-border bg-surface px-5"
            >
              <AccordionTrigger className="text-left font-semibold text-primary hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
