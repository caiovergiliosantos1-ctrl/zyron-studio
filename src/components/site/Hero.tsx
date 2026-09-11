import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

const PHRASES = [
  "CRIAMOS SITES PROFISSIONAIS",
  "CRIAMOS EXPERIÊNCIAS DIGITAIS",
  "CRIAMOS PRESENÇA DIGITAL",
  "CRIAMOS NOVOS RESULTADOS",
];

export function Hero() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % PHRASES.length);
        setVisible(true);
      }, 450);
    }, 3600);
    return () => clearInterval(cycle);
  }, []);

  return (
    <section id="inicio" className="relative overflow-hidden pt-36 pb-24 lg:pt-44 lg:pb-32">
      <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute top-[-10%] left-1/2 h-[420px] w-[720px] max-w-[95vw] -translate-x-1/2 rounded-full bg-foreground/8 blur-[140px]" />

      <div className="relative mx-auto max-w-5xl px-5 text-center lg:px-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs tracking-[0.2em] text-muted-foreground uppercase">
          <Sparkles className="h-3.5 w-3.5" />
          Agência digital
        </span>

        <h1 className="mt-8 text-4xl leading-[1.05] font-black tracking-tight sm:text-6xl lg:text-7xl">
          <span
            className={`text-steel block transition-all duration-500 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            {PHRASES[index]}
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg font-medium text-foreground/90 sm:text-xl">
          Seu negócio merece uma presença digital à altura.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
          Desenvolvemos sites rápidos, elegantes e pensados para converter — com design sob medida,
          performance real e uma experiência impecável em qualquer tela.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#contato"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] sm:w-auto"
          >
            Solicitar orçamento
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#portfolio"
            className="inline-flex w-full items-center justify-center rounded-full border border-border bg-card/50 px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent sm:w-auto"
          >
            Ver portfólio
          </a>
        </div>
      </div>
    </section>
  );
}
