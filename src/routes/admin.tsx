import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { LogOut, Star, Trash2, Plus, Pencil, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, categoryLabel, type ContactRequest, type Project, type SiteSettings, type Testimonial } from "@/lib/zyron-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Painel administrativo — Zyron Studio" },
      { name: "description", content: "Área restrita da Zyron Studio." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Painel administrativo — Zyron Studio" },
      { property: "og:description", content: "Área restrita da Zyron Studio." },
    ],
  }),
  component: AdminPage,
});

const inputClass =
  "mt-1.5 w-full rounded-lg border border-input bg-background/60 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-ring";
const labelClass = "block text-xs tracking-wide text-muted-foreground uppercase";

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const { data: isAdmin, isLoading: roleLoading } = useQuery({
    queryKey: ["is-admin", session?.user.id],
    enabled: !!session,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session!.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
  });

  if (!ready) {
    return <Shell><p className="text-sm text-muted-foreground">Carregando…</p></Shell>;
  }

  if (!session) return <AuthCard />;

  if (roleLoading) {
    return <Shell><p className="text-sm text-muted-foreground">Verificando permissões…</p></Shell>;
  }

  if (!isAdmin) {
    return (
      <Shell>
        <div className="panel-surface rounded-2xl p-8 text-center">
          <h1 className="text-xl font-bold text-foreground">Acesso restrito</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sua conta ({session.user.email}) ainda não tem permissão de administrador.
          </p>
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="mt-6 rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-accent"
          >
            Sair
          </button>
        </div>
      </Shell>
    );
  }

  return <Dashboard email={session.user.email ?? ""} />;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid-backdrop flex min-h-screen items-center justify-center bg-background px-5">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

function AuthCard() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Conta criada! Confirme o e-mail enviado para continuar.");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Shell>
      <div className="panel-surface glow-ring rounded-2xl p-8">
        <h1 className="text-steel text-2xl font-black">Zyron Studio</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "login" ? "Entre no painel administrativo." : "Crie sua conta de acesso."}
        </p>
        <form className="mt-6" onSubmit={handleSubmit}>
          <label className={labelClass} htmlFor="a-email">
            E-mail
          </label>
          <input
            id="a-email"
            type="email"
            required
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className={`${labelClass} mt-4`} htmlFor="a-pass">
            Senha
          </label>
          <input
            id="a-pass"
            type="password"
            required
            minLength={6}
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {loading ? "Aguarde…" : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground"
        >
          {mode === "login" ? "Não tem conta? Criar acesso" : "Já tenho conta"}
        </button>
        <Link to="/" className="mt-6 block text-center text-xs text-muted-foreground hover:text-foreground">
          Voltar ao site
        </Link>
      </div>
    </Shell>
  );
}

const TABS = [
  { id: "projects", label: "Projetos" },
  { id: "testimonials", label: "Avaliações" },
  { id: "requests", label: "Pedidos" },
  { id: "settings", label: "Configurações" },
] as const;

function Dashboard({ email }: { email: string }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("projects");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4">
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold tracking-[0.28em] uppercase">
              Zyron <span className="text-muted-foreground">Admin</span>
            </h1>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/"
              className="rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-accent"
            >
              Ver site
            </Link>
            <button
              type="button"
              onClick={() => supabase.auth.signOut()}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-accent"
            >
              <LogOut className="h-3.5 w-3.5" /> Sair
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                tab === t.id
                  ? "border-foreground/40 bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "projects" && <ProjectsPanel />}
          {tab === "testimonials" && <TestimonialsPanel />}
          {tab === "requests" && <RequestsPanel />}
          {tab === "settings" && <SettingsPanel />}
        </div>
      </div>
    </div>
  );
}

type ProjectForm = {
  id?: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  project_url: string;
  technologies: string;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
};

const emptyProject: ProjectForm = {
  title: "",
  description: "",
  category: "empresas",
  image_url: "",
  project_url: "",
  technologies: "",
  is_featured: false,
  is_published: true,
  sort_order: 0,
};

function ProjectsPanel() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ProjectForm | null>(null);

  const { data: projects = [] } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Project[];
    },
  });

  const save = useMutation({
    mutationFn: async (input: ProjectForm) => {
      const payload = {
        title: input.title.trim(),
        description: input.description.trim(),
        category: input.category,
        image_url: input.image_url.trim() || null,
        project_url: input.project_url.trim() || null,
        technologies: input.technologies
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        is_featured: input.is_featured,
        is_published: input.is_published,
        sort_order: Number(input.sort_order) || 0,
      };
      if (input.id) {
        const { error } = await supabase.from("projects").update(payload).eq("id", input.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
      }
      if (input.is_featured) {
        const query = supabase.from("projects").update({ is_featured: false }).eq("is_featured", true);
        if (input.id) await query.neq("id", input.id);
        else await query.neq("title", payload.title);
      }
    },
    onSuccess: () => {
      toast.success("Projeto salvo.");
      setForm(null);
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro ao salvar."),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Projeto excluído.");
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div className="space-y-3">
        {projects.map((p) => (
          <article key={p.id} className="panel-surface rounded-xl p-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-2">
                  {p.is_featured && <Star className="h-3.5 w-3.5 shrink-0 fill-foreground" />}
                  <h3 className="truncate text-sm font-semibold text-foreground">{p.title}</h3>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
                <p className="mt-2 text-[11px] tracking-wide text-muted-foreground uppercase">
                  {categoryLabel(p.category)} · {p.is_published ? "publicado" : "oculto"}
                </p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  aria-label="Editar"
                  onClick={() =>
                    setForm({
                      id: p.id,
                      title: p.title,
                      description: p.description,
                      category: p.category,
                      image_url: p.image_url ?? "",
                      project_url: p.project_url ?? "",
                      technologies: p.technologies.join(", "),
                      is_featured: p.is_featured,
                      is_published: p.is_published,
                      sort_order: p.sort_order,
                    })
                  }
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-accent"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Excluir"
                  onClick={() => remove.mutate(p.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-destructive hover:bg-accent"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </article>
        ))}
        {projects.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum projeto cadastrado.</p>
        )}
      </div>

      <div className="panel-surface h-fit rounded-2xl p-5">
        {!form ? (
          <button
            type="button"
            onClick={() => setForm({ ...emptyProject })}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> Novo projeto
          </button>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save.mutate(form);
            }}
          >
            <h3 className="text-sm font-semibold text-foreground">
              {form.id ? "Editar projeto" : "Novo projeto"}
            </h3>

            <label className={`${labelClass} mt-4`}>Título</label>
            <input
              required
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <label className={`${labelClass} mt-4`}>Descrição</label>
            <textarea
              rows={3}
              className={`${inputClass} resize-none`}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <label className={`${labelClass} mt-4`}>Categoria</label>
            <select
              className={inputClass}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.filter((c) => c.value !== "todos").map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            <label className={`${labelClass} mt-4`}>URL da imagem</label>
            <input
              className={inputClass}
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://…"
            />

            <label className={`${labelClass} mt-4`}>Link do projeto</label>
            <input
              className={inputClass}
              value={form.project_url}
              onChange={(e) => setForm({ ...form, project_url: e.target.value })}
              placeholder="https://…"
            />

            <label className={`${labelClass} mt-4`}>Tecnologias (separadas por vírgula)</label>
            <input
              className={inputClass}
              value={form.technologies}
              onChange={(e) => setForm({ ...form, technologies: e.target.value })}
              placeholder="React, SEO, Performance"
            />

            <label className={`${labelClass} mt-4`}>Ordem</label>
            <input
              type="number"
              className={inputClass}
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
            />

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                />
                Destaque
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                />
                Publicado
              </label>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="submit"
                disabled={save.isPending}
                className="flex-1 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setForm(null)}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-accent"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function TestimonialsPanel() {
  const queryClient = useQueryClient();
  const { data: items = [] } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Testimonial[];
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("testimonials").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });

  const statusLabel: Record<string, string> = {
    pending: "Pendente",
    approved: "Aprovada",
    rejected: "Rejeitada",
  };

  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma avaliação.</p>}
      {items.map((t) => (
        <article key={t.id} className="panel-surface rounded-xl p-4">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2">
                <h3 className="truncate text-sm font-semibold text-foreground">{t.name}</h3>
                <span className="shrink-0 text-xs text-muted-foreground">{t.rating}★</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{t.comment}</p>
              <p className="mt-2 text-[11px] tracking-wide text-muted-foreground uppercase">
                {statusLabel[t.status] ?? t.status}
              </p>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <button
                type="button"
                aria-label="Aprovar"
                onClick={() => update.mutate({ id: t.id, status: "approved" })}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-accent"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="Rejeitar"
                onClick={() => update.mutate({ id: t.id, status: "rejected" })}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-accent"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="Excluir"
                onClick={() => remove.mutate(t.id)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-destructive hover:bg-accent"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function RequestsPanel() {
  const { data: items = [] } = useQuery({
    queryKey: ["admin-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ContactRequest[];
    },
  });

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">Nenhum pedido de orçamento recebido.</p>
      )}
      {items.map((r) => (
        <article key={r.id} className="panel-surface rounded-xl p-4">
          <h3 className="truncate text-sm font-semibold text-foreground">{r.name}</h3>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {r.email}
            {r.phone ? ` · ${r.phone}` : ""}
          </p>
          <p className="mt-2 text-sm text-foreground/90">{r.message}</p>
          <p className="mt-3 text-[11px] tracking-wide text-muted-foreground uppercase">
            {[r.project_type, r.budget].filter(Boolean).join(" · ") || "sem detalhes"} ·{" "}
            {new Date(r.created_at).toLocaleDateString("pt-BR")}
          </p>
        </article>
      ))}
    </div>
  );
}

function SettingsPanel() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return (data as SiteSettings) ?? null;
    },
  });

  const [form, setForm] = useState<SiteSettings | null>(null);
  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const save = useMutation({
    mutationFn: async (input: SiteSettings) => {
      const { error } = await supabase
        .from("site_settings")
        .update({
          whatsapp_number: input.whatsapp_number,
          instagram_url: input.instagram_url,
          contact_email: input.contact_email,
          contact_phone: input.contact_phone,
        })
        .eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Configurações salvas.");
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro ao salvar."),
  });

  if (!form) return <p className="text-sm text-muted-foreground">Carregando…</p>;

  return (
    <form
      className="panel-surface max-w-xl rounded-2xl p-6"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate(form);
      }}
    >
      <label className={labelClass}>WhatsApp (com DDI e DDD, só números)</label>
      <input
        className={inputClass}
        value={form.whatsapp_number}
        onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
        placeholder="5511999999999"
      />

      <label className={`${labelClass} mt-4`}>Instagram</label>
      <input
        className={inputClass}
        value={form.instagram_url}
        onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
      />

      <label className={`${labelClass} mt-4`}>E-mail de contato</label>
      <input
        className={inputClass}
        value={form.contact_email}
        onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
      />

      <label className={`${labelClass} mt-4`}>Telefone de contato</label>
      <input
        className={inputClass}
        value={form.contact_phone}
        onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
      />

      <button
        type="submit"
        disabled={save.isPending}
        className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        Salvar configurações
      </button>
    </form>
  );
}
