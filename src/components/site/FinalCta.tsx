import { ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="panel-surface glow-ring relative overflow-hidden rounded-3xl px-6 py-16 text-center lg:px-16 lg:py-24">
          <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-50" />
          <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-[560px] max-w-[95%] -translate-x-1/2 rounded-full bg-foreground/10 blur-[120px]" />
          <div className="relative">
            <h2 className="text-steel mx-auto max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
              O próximo grande projeto pode ser o seu
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
              Fale com a Zyron Studio e descubra como a sua marca pode ficar no digital.
            </p>
            <a
              href="#contato"
              className="group mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              Solicitar orçamento
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
