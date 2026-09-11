import { SectionHeading } from "./SectionHeading";

const STEPS = [
  {
    number: "01",
    title: "Conhecimento",
    text: "Entendemos seu negócio, seu público e o que o site precisa resolver.",
  },
  {
    number: "02",
    title: "Planejamento",
    text: "Definimos estrutura, conteúdo e objetivos de cada página.",
  },
  {
    number: "03",
    title: "Design",
    text: "Criamos o layout sob medida, alinhado à sua identidade visual.",
  },
  {
    number: "04",
    title: "Desenvolvimento",
    text: "Codificamos com performance, responsividade e SEO desde o início.",
  },
  {
    number: "05",
    title: "Entrega",
    text: "Publicamos, testamos e acompanhamos os primeiros passos do seu site.",
  },
];

export function Process() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Processo"
          title="Como trabalhamos"
          description="Um caminho claro, do primeiro contato até o site no ar."
        />

        <ol className="relative mt-14 space-y-4 border-l border-border pl-6 lg:pl-10">
          {STEPS.map((step) => (
            <li key={step.number} className="relative">
              <span className="absolute top-6 -left-[31px] h-2.5 w-2.5 rounded-full bg-foreground lg:-left-[47px]" />
              <div className="panel-surface rounded-2xl p-6 transition-all duration-300 hover:translate-x-1 hover:glow-ring">
                <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
                  <span className="text-steel shrink-0 text-3xl font-black">{step.number}</span>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
