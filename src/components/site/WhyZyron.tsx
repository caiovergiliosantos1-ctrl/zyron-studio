import { useState } from "react";
import { Palette, Smartphone, Zap, ShieldCheck, Search, Heart } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/utils";

const REASONS = [
  {
    icon: Palette,
    title: "Design personalizado",
    text: "Nada de modelos prontos: cada layout nasce da identidade do seu negócio, com hierarquia visual clara e acabamento premium.",
  },
  {
    icon: Smartphone,
    title: "Responsividade",
    text: "Seu site funciona perfeitamente no celular, tablet e desktop — testado em telas reais, não apenas no papel.",
  },
  {
    icon: Zap,
    title: "Performance",
    text: "Código leve, imagens otimizadas e carregamento rápido para que ninguém desista de esperar.",
  },
  {
    icon: ShieldCheck,
    title: "Segurança",
    text: "Boas práticas de proteção de dados, formulários validados e infraestrutura confiável.",
  },
  {
    icon: Search,
    title: "SEO",
    text: "Estrutura semântica, meta tags e dados estruturados para o seu site ser encontrado no Google.",
  },
  {
    icon: Heart,
    title: "Experiência do usuário",
    text: "Navegação intuitiva e caminhos claros até o contato, a compra ou a reserva.",
  },
];

export function WhyZyron() {
  const [active, setActive] = useState(0);
  const current = REASONS[active]!;
  const CurrentIcon = current.icon;

  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Diferenciais"
          title="Por que escolher a Zyron"
          description="Um padrão de qualidade que se percebe no primeiro clique."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {REASONS.map((reason, i) => (
              <button
                key={reason.title}
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-300",
                  i === active
                    ? "border-foreground/30 bg-card text-foreground"
                    : "border-border bg-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <reason.icon className="h-4.5 w-4.5 shrink-0" />
                <span className="truncate text-sm font-semibold">{reason.title}</span>
              </button>
            ))}
          </div>

          <div className="panel-surface glow-ring relative overflow-hidden rounded-3xl p-8 lg:p-12">
            <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-40" />
            <div className="relative">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background/70">
                <CurrentIcon className="h-6 w-6 text-foreground" />
              </span>
              <h3 className="text-steel mt-6 text-2xl font-black sm:text-3xl">{current.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{current.text}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
