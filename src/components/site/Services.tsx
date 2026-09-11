import {
  Code2,
  Rocket,
  Building2,
  UtensilsCrossed,
  ShoppingBag,
  Gauge,
  Globe,
} from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const SERVICES = [
  {
    icon: Code2,
    title: "Criação de sites",
    description: "Sites sob medida, do conceito ao lançamento, com identidade visual própria.",
  },
  {
    icon: Rocket,
    title: "Landing Pages",
    description: "Páginas de alta conversão para campanhas, lançamentos e captação de leads.",
  },
  {
    icon: Building2,
    title: "Sites para empresas",
    description: "Presença institucional sólida, com credibilidade e informação clara.",
  },
  {
    icon: UtensilsCrossed,
    title: "Sites para restaurantes",
    description: "Cardápio digital, galeria de pratos, reservas e contato direto no WhatsApp.",
  },
  {
    icon: ShoppingBag,
    title: "E-commerce",
    description: "Lojas virtuais com catálogo, carrinho e checkout otimizado para vender.",
  },
  {
    icon: Gauge,
    title: "Otimização de sites",
    description: "Velocidade, SEO técnico e melhorias que colocam seu site à frente.",
  },
  {
    icon: Globe,
    title: "Presença digital",
    description: "Estratégia completa para sua marca ser encontrada e lembrada.",
  },
];

export function Services() {
  return (
    <section id="servicos" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Serviços"
          title="Soluções digitais para o seu negócio"
          description="Cada projeto é construído do zero, com atenção ao detalhe e foco em resultado."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="panel-surface group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:glow-ring"
            >
              <div className="pointer-events-none absolute inset-x-0 -top-24 h-40 bg-foreground/6 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background/60 text-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
