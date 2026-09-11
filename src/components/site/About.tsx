import logo from "@/assets/zyron-logo.jpg.asset.json";

export function About() {
  return (
    <section id="sobre" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="panel-surface glow-ring relative overflow-hidden rounded-3xl p-8 lg:p-14">
          <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-center">
            <div className="flex justify-center">
              <img
                src={logo.url}
                alt="Logo da Zyron Studio"
                loading="lazy"
                className="w-56 rounded-2xl object-cover ring-1 ring-border"
              />
            </div>
            <div>
              <span className="text-xs tracking-[0.32em] text-muted-foreground uppercase">
                Sobre
              </span>
              <h2 className="text-steel mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                Sobre a Zyron Studio
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                A Zyron Studio é uma agência digital dedicada a transformar negócios em experiências
                online marcantes. Trabalhamos com poucos projetos por vez, para que cada site receba
                a atenção que merece — do primeiro rascunho ao último detalhe de código.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Acreditamos que um bom site não é apenas bonito: ele carrega rápido, guia o visitante
                com clareza e representa com honestidade quem está por trás da marca. É esse padrão
                que aplicamos em tudo o que entregamos.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Sem promessas vazias e sem números inflados. Apenas trabalho bem feito, comunicação
                direta e um resultado do qual você tenha orgulho de compartilhar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
