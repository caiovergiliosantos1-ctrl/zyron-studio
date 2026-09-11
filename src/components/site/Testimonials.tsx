import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Quote, Star } from "lucide-react";
import { toast } from "sonner";
import { SectionHeading } from "./SectionHeading";
import { fetchApprovedTestimonials, submitTestimonial } from "@/lib/zyron-data";
import { cn } from "@/lib/utils";

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(
            "h-4 w-4",
            n <= value ? "fill-foreground text-foreground" : "text-muted-foreground/40",
          )}
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  const queryClient = useQueryClient();
  const { data: items = [] } = useQuery({
    queryKey: ["testimonials", "approved"],
    queryFn: fetchApprovedTestimonials,
  });

  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const mutation = useMutation({
    mutationFn: submitTestimonial,
    onSuccess: () => {
      toast.success("Obrigado! Sua avaliação foi enviada e aguarda aprovação.");
      setName("");
      setComment("");
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
    onError: () => toast.error("Não foi possível enviar sua avaliação. Tente novamente."),
  });

  return (
    <section id="avaliacoes" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Avaliações"
          title="O que nossos clientes dizem"
          description="Depoimentos de quem já confiou na Zyron Studio."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="grid gap-4 sm:grid-cols-2">
            {items.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Ainda não há avaliações publicadas. Seja o primeiro a avaliar.
              </p>
            )}
            {items.map((item) => (
              <article key={item.id} className="panel-surface rounded-2xl p-6">
                <Quote className="h-5 w-5 text-muted-foreground" />
                <p className="mt-4 text-sm leading-relaxed text-foreground/90">“{item.comment}”</p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-semibold text-foreground">
                    {item.name}
                  </span>
                  <Stars value={item.rating} />
                </div>
              </article>
            ))}
          </div>

          <form
            className="panel-surface glow-ring h-fit rounded-2xl p-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim() || !comment.trim()) {
                toast.error("Preencha seu nome e comentário.");
                return;
              }
              mutation.mutate({
                name: name.trim().slice(0, 80),
                rating,
                comment: comment.trim().slice(0, 800),
              });
            }}
          >
            <h3 className="text-lg font-semibold text-foreground">Deixe sua avaliação</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Sua avaliação passa por aprovação antes de aparecer no site.
            </p>

            <label className="mt-5 block text-xs tracking-wide text-muted-foreground uppercase">
              Nome
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              className="mt-2 w-full rounded-lg border border-input bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none focus:border-ring"
              placeholder="Seu nome"
            />

            <label className="mt-5 block text-xs tracking-wide text-muted-foreground uppercase">
              Nota
            </label>
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} estrelas`}
                  onClick={() => setRating(n)}
                  className="p-1"
                >
                  <Star
                    className={cn(
                      "h-6 w-6 transition-transform hover:scale-110",
                      n <= rating ? "fill-foreground text-foreground" : "text-muted-foreground/40",
                    )}
                  />
                </button>
              ))}
            </div>

            <label className="mt-5 block text-xs tracking-wide text-muted-foreground uppercase">
              Comentário
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={800}
              rows={4}
              className="mt-2 w-full resize-none rounded-lg border border-input bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none focus:border-ring"
              placeholder="Conte como foi trabalhar com a Zyron Studio"
            />

            <button
              type="submit"
              disabled={mutation.isPending}
              className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              {mutation.isPending ? "Enviando…" : "Enviar avaliação"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
