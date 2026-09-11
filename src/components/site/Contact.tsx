import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle2, Instagram, Mail, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { SectionHeading } from "./SectionHeading";
import { fetchSiteSettings, submitContactRequest, whatsappLink } from "@/lib/zyron-data";

const PROJECT_TYPES = [
  "Criação de site",
  "Landing Page",
  "Site para empresa",
  "Site para restaurante",
  "E-commerce",
  "Otimização de site",
  "Outro",
];

const BUDGETS = ["Até R$ 1.000", "R$ 1.000 a R$ 3.000", "R$ 3.000 a R$ 6.000", "Acima de R$ 6.000"];

export function Contact() {
  const { data: settings } = useQuery({ queryKey: ["site-settings"], queryFn: fetchSiteSettings });
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    project_type: "",
    budget: "",
    message: "",
  });

  const mutation = useMutation({
    mutationFn: submitContactRequest,
    onSuccess: () => {
      setSent(true);
      setForm({ name: "", email: "", phone: "", project_type: "", budget: "", message: "" });
    },
    onError: () => toast.error("Não foi possível enviar. Tente novamente em instantes."),
  });

  const field =
    "mt-2 w-full rounded-lg border border-input bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none focus:border-ring";
  const label = "block text-xs tracking-wide text-muted-foreground uppercase";

  return (
    <section id="contato" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Contato"
          title="Vamos criar seu próximo projeto?"
          description="Conte sobre a sua ideia e retornamos com uma proposta sob medida."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="panel-surface glow-ring rounded-3xl p-6 lg:p-8">
            {sent ? (
              <div className="flex flex-col items-center py-14 text-center">
                <CheckCircle2 className="h-12 w-12 text-foreground" />
                <h3 className="mt-5 text-xl font-bold text-foreground">Pedido enviado!</h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Recebemos sua solicitação de orçamento. Em breve entraremos em contato pelo e-mail
                  ou WhatsApp informado.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-6 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent"
                >
                  Enviar outro pedido
                </button>
              </div>
            ) : (
              <form
                className="grid gap-5 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
                    toast.error("Preencha nome, e-mail e mensagem.");
                    return;
                  }
                  mutation.mutate({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim() || undefined,
                    project_type: form.project_type || undefined,
                    budget: form.budget || undefined,
                    message: form.message.trim(),
                  });
                }}
              >
                <div>
                  <label className={label} htmlFor="c-name">
                    Nome
                  </label>
                  <input
                    id="c-name"
                    className={field}
                    value={form.name}
                    maxLength={100}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className={label} htmlFor="c-email">
                    E-mail
                  </label>
                  <input
                    id="c-email"
                    type="email"
                    className={field}
                    value={form.email}
                    maxLength={255}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="voce@email.com"
                  />
                </div>
                <div>
                  <label className={label} htmlFor="c-phone">
                    WhatsApp / Telefone
                  </label>
                  <input
                    id="c-phone"
                    className={field}
                    value={form.phone}
                    maxLength={30}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div>
                  <label className={label} htmlFor="c-type">
                    Tipo de projeto
                  </label>
                  <select
                    id="c-type"
                    className={field}
                    value={form.project_type}
                    onChange={(e) => setForm({ ...form, project_type: e.target.value })}
                  >
                    <option value="">Selecione</option>
                    {PROJECT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={label} htmlFor="c-budget">
                    Orçamento estimado
                  </label>
                  <select
                    id="c-budget"
                    className={field}
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  >
                    <option value="">Prefiro conversar</option>
                    {BUDGETS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={label} htmlFor="c-message">
                    Sobre o projeto
                  </label>
                  <textarea
                    id="c-message"
                    rows={5}
                    maxLength={2000}
                    className={`${field} resize-none`}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Conte um pouco sobre o seu negócio e o que você precisa"
                  />
                </div>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-60 sm:col-span-2"
                >
                  {mutation.isPending ? "Enviando…" : "Solicitar orçamento"}
                </button>
              </form>
            )}
          </div>

          <div className="grid content-start gap-4">
            {settings?.whatsapp_number && (
              <a
                href={whatsappLink(settings.whatsapp_number)}
                target="_blank"
                rel="noreferrer noopener"
                className="panel-surface flex items-center gap-4 rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:glow-ring"
              >
                <MessageCircle className="h-5 w-5 shrink-0 text-foreground" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">Falar no WhatsApp</p>
                  <p className="truncate text-xs text-muted-foreground">Resposta rápida e direta</p>
                </div>
              </a>
            )}
            <a
              href={settings?.instagram_url || "https://instagram.com/zyronstudioofc"}
              target="_blank"
              rel="noreferrer noopener"
              className="panel-surface flex items-center gap-4 rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:glow-ring"
            >
              <Instagram className="h-5 w-5 shrink-0 text-foreground" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">@zyronstudioofc</p>
                <p className="truncate text-xs text-muted-foreground">Bastidores e projetos</p>
              </div>
            </a>
            {settings?.contact_email && (
              <a
                href={`mailto:${settings.contact_email}`}
                className="panel-surface flex items-center gap-4 rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:glow-ring"
              >
                <Mail className="h-5 w-5 shrink-0 text-foreground" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {settings.contact_email}
                  </p>
                  <p className="text-xs text-muted-foreground">E-mail comercial</p>
                </div>
              </a>
            )}
            {settings?.contact_phone && (
              <a
                href={`tel:${settings.contact_phone.replace(/\D/g, "")}`}
                className="panel-surface flex items-center gap-4 rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:glow-ring"
              >
                <Phone className="h-5 w-5 shrink-0 text-foreground" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {settings.contact_phone}
                  </p>
                  <p className="text-xs text-muted-foreground">Telefone</p>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
