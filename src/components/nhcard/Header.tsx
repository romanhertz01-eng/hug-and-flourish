import { Link } from "@tanstack/react-router";
import { formatToday } from "@/lib/cards";
import { ChevronDown, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";

type LeafItem =
  | { label: string; kind: "hash"; hash: string }
  | { label: string; kind: "route"; to: string };
type NavItem = LeafItem | { label: string; kind: "group"; items: LeafItem[] };

const nav: NavItem[] = [
  { label: "Рейтинг", kind: "hash", hash: "rating" },
  {
    label: "Карты",
    kind: "group",
    items: [
      { label: "Все карты", kind: "hash", hash: "rating" },
      { label: "По задаче", kind: "hash", hash: "task" },
      { label: "По странам", kind: "hash", hash: "countries" },
      { label: "Зарубежные виртуальные карты", kind: "route", to: "/foreign-virtual-cards" },
      { label: "Карты для подписок", kind: "route", to: "/cards-for-subscriptions" },
      { label: "Карты для путешествий", kind: "route", to: "/travel-cards" },
      { label: "Карты для покупок", kind: "route", to: "/shopping-cards" },
      { label: "Карты для рекламы", kind: "route", to: "/ads-cards" },
      { label: "Карты для игр", kind: "route", to: "/gaming-cards" },
      { label: "Карты для SaaS", kind: "route", to: "/work-cards" },
      { label: "Visa", kind: "route", to: "/network/visa" },
      { label: "Mastercard", kind: "route", to: "/network/mastercard" },
    ],
  },
  { label: "Подбор", kind: "route", to: "/podbor" },
  { label: "Калькулятор", kind: "hash", hash: "calculator" },
  {
    label: "Ещё",
    kind: "group",
    items: [
      { label: "Крипта", kind: "route", to: "/crypto" },
      { label: "Нейросети", kind: "route", to: "/ai" },
      { label: "Банковские карты", kind: "route", to: "/banks" },
      { label: "Блог", kind: "route", to: "/blog" },
      { label: "Методология", kind: "route", to: "/methodology" },
      { label: "FAQ", kind: "hash", hash: "faq" },
    ],
  },
];

function LeafLink({
  item,
  className,
  onNavigate,
}: {
  item: LeafItem;
  className?: string;
  onNavigate?: () => void;
}) {
  if (item.kind === "route") {
    return (
      <Link to={item.to} className={className} onClick={onNavigate}>
        {item.label}
      </Link>
    );
  }
  return (
    <Link to="/" hash={item.hash} className={className} onClick={onNavigate}>
      {item.label}
    </Link>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors ${
        scrolled
          ? "border-white/10 bg-black/70 backdrop-blur-xl"
          : "border-white/5 bg-black/40 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2"
          aria-label="EraPay — на главную"
        >
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-primary/80 to-primary/40 font-sans text-lg font-medium text-primary-foreground shadow-[0_0_20px_rgba(60,120,170,0.45)]"
          >
            E
          </span>
          <span
            className="font-sans text-2xl font-medium tracking-tight text-foreground"
            style={{ textShadow: "0 0 24px rgba(60,120,170,0.35)" }}
          >
            <span className="bg-gradient-to-r from-[oklch(0.78_0.09_240)] to-[oklch(0.62_0.09_245)] bg-clip-text text-transparent">
              Era
            </span>
            <span className="bg-gradient-to-r from-accent to-[oklch(0.82_0.13_90)] bg-clip-text text-transparent">
              Pay
            </span>
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex">
          {nav.map((item) => {
            if (item.kind === "group") {
              return (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger className="inline-flex items-center gap-1 text-sm font-normal text-foreground/70 outline-none transition-colors hover:text-foreground focus-visible:text-foreground data-[state=open]:text-foreground">
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="min-w-56 border-white/10 bg-black/80 text-foreground backdrop-blur-xl"
                  >
                    {item.items.map((leaf) => (
                      <DropdownMenuItem
                        key={leaf.label}
                        asChild
                        className="focus:bg-white/5 focus:text-foreground"
                      >
                        <LeafLink
                          item={leaf}
                          className="w-full cursor-pointer text-sm text-foreground/80 hover:text-foreground"
                        />
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }
            return (
              <LeafLink
                key={item.label}
                item={item}
                className="text-sm font-normal text-foreground/70 transition-colors hover:text-foreground"
              />
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <span className="hidden text-xs text-muted-foreground md:inline">
            Обновлено: {formatToday()}
          </span>
          <Link
            to="/"
            hash="rating"
            className="btn-pill hidden h-9 items-center bg-primary px-5 text-sm font-medium text-primary-foreground shadow-[0_0_20px_rgba(60,120,170,0.35)] transition-all hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(60,120,170,0.55)] sm:inline-flex"
          >
            К рейтингу
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 hover:bg-white/5 hover:text-foreground lg:hidden"
              aria-label="Открыть меню"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[85vw] max-w-sm overflow-y-auto border-white/10 bg-black/85 text-foreground backdrop-blur-xl"
            >
              <SheetTitle className="font-sans text-lg font-medium text-foreground">Меню</SheetTitle>
              <div className="mt-6 flex flex-col gap-1">
                {nav.map((item) => {
                  if (item.kind === "group") {
                    return (
                      <Accordion key={item.label} type="single" collapsible>
                        <AccordionItem value={item.label} className="border-b border-white/10">
                          <AccordionTrigger className="py-3 text-sm font-medium text-foreground/85 hover:text-foreground">
                            {item.label}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-col">
                              {item.items.map((leaf) => (
                                <LeafLink
                                  key={leaf.label}
                                  item={leaf}
                                  onNavigate={closeMobile}
                                  className="rounded-md px-2 py-2 text-sm text-foreground/70 hover:bg-white/5 hover:text-foreground"
                                />
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    );
                  }
                  return (
                    <LeafLink
                      key={item.label}
                      item={item}
                      onNavigate={closeMobile}
                      className="border-b border-white/10 py-3 text-sm font-medium text-foreground/80 hover:text-foreground"
                    />
                  );
                })}
                <Link
                  to="/"
                  hash="rating"
                  onClick={closeMobile}
                  className="btn-pill mt-4 inline-flex h-10 items-center justify-center bg-primary px-5 text-sm font-medium text-primary-foreground shadow-[0_0_20px_rgba(60,120,170,0.35)]"
                >
                  К рейтингу
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
