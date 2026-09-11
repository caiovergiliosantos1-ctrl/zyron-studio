import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, ImageIcon, Star } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { CATEGORIES, categoryLabel, fetchPublishedProjects, type Project } from "@/lib/zyron-data";
import { cn } from "@/lib/utils";

function Thumb({ project, tall = false }: { project: Project; tall?: boolean }) {
  if (project.image_url) {
    return (
      <img
        src={project.image_url}
        alt={project.title}
        loading="lazy"
        className={cn(
          "w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105",
          tall ? "h-64 lg:h-80" : "h-44",
        )}
      />
    );
  }
  return (
    <div
      className={cn(
        "grid-backdrop flex w-full items-center justify-center rounded-xl border border-border bg-background/60",
        tall ? "h-64 lg:h-80" : "h-44",
      )}
    >
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <ImageIcon className="h-6 w-6" />
        <span className="text-xs tracking-[0.24em] uppercase">Zyron Studio</span>
      </div>
    </div>
  );
}

function Tech({ items }: { items: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {items.map((tech) => (
        <span
          key={tech}
          className="rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] tracking-wide text-muted-foreground"
        >
          {tech}
        </span>
      ))}
    </div>
  );
}

export function Portfolio() {
  const [filter, setFilter] = useState<string>("todos");
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects", "published"],
    queryFn: fetchPublishedProjects,
  });

  const featured = useMemo(() => projects.find((p) => p.is_featured), [projects]);
  const rest = useMemo(
    () =>
      projects
        .filter((p) => p.id !== featured?.id)
        .filter((p) => filter === "todos" || p.category === filter),
    [projects, featured, filter],
  );

  return (
    <section id="portfolio" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Portfólio"
          title="Projetos que já criamos"
          description="Uma seleção de trabalhos que traduzem o nosso padrão de entrega."
        />

        {featured && (
          <article className="panel-surface glow-ring group mt-14 grid gap-8 overflow-hidden rounded-3xl p-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:p-8">
            <div className="overflow-hidden rounded-xl">
              <Thumb project={featured} tall />
            </div>
            <div className="flex min-w-0 flex-col justify-center">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                <Star className="h-3 w-3" /> Projeto em destaque
              </span>
              <h3 className="text-steel mt-4 text-2xl font-black sm:text-3xl">{featured.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {featured.description}
              </p>
              <Tech items={featured.technologies} />
              {featured.project_url && (
                <a
                  href={featured.project_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  Visitar projeto <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </article>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setFilter(c.value)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                filter === c.value
                  ? "border-foreground/40 bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="mt-12 text-center text-sm text-muted-foreground">Carregando projetos…</p>
        ) : rest.length === 0 ? (
          <p className="mt-12 text-center text-sm text-muted-foreground">
            Nenhum projeto nesta categoria por enquanto.
          </p>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((project) => (
              <article
                key={project.id}
                className="panel-surface group overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:glow-ring"
              >
                <div className="overflow-hidden rounded-xl">
                  <Thumb project={project} />
                </div>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <h3 className="truncate text-base font-semibold text-foreground">
                    {project.title}
                  </h3>
                  <span className="shrink-0 text-[11px] tracking-wide text-muted-foreground uppercase">
                    {categoryLabel(project.category)}
                  </span>
                </div>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                  {project.description}
                </p>
                <Tech items={project.technologies} />
                {project.project_url && (
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:underline"
                  >
                    Ver projeto <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
