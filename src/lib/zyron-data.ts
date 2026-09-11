import { supabase } from "@/integrations/supabase/client";

export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string | null;
  project_url: string | null;
  technologies: string[];
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};

export type Testimonial = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  status: string;
  created_at: string;
};

export type ContactRequest = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  project_type: string | null;
  budget: string | null;
  message: string;
  status: string;
  created_at: string;
};

export type SiteSettings = {
  id: string;
  whatsapp_number: string;
  instagram_url: string;
  contact_email: string;
  contact_phone: string;
};

export const CATEGORIES = [
  { value: "todos", label: "Todos" },
  { value: "empresas", label: "Empresas" },
  { value: "restaurantes", label: "Restaurantes" },
  { value: "landing-pages", label: "Landing Pages" },
  { value: "outros", label: "Outros" },
] as const;

export function categoryLabel(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? "Outros";
}

export async function fetchPublishedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Project[];
}

export async function fetchApprovedTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Testimonial[];
}

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
  if (error) throw error;
  return (data as SiteSettings) ?? null;
}

export async function submitTestimonial(input: {
  name: string;
  rating: number;
  comment: string;
}) {
  const { error } = await supabase
    .from("testimonials")
    .insert({ ...input, status: "pending" });
  if (error) throw error;
}

export async function submitContactRequest(input: {
  name: string;
  email: string;
  phone: string | null;
  project_type: string | null;
  budget: string | null;
  message: string;
}) {
  const { error } = await supabase.from("contact_requests").insert(input);
  if (error) throw error;
}

export function whatsappLink(number: string, message = "Olá! Gostaria de solicitar um orçamento.") {
  const digits = (number || "").replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
