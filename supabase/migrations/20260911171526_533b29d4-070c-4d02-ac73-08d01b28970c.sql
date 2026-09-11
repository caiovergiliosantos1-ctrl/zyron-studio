CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- projects
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'outros',
  image_url text,
  project_url text,
  technologies text[] NOT NULL DEFAULT '{}',
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads published projects" ON public.projects FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "admins manage projects" ON public.projects FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- testimonials
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  comment text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT testimonials_rating_check CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT testimonials_status_check CHECK (status IN ('pending','approved','rejected'))
);
GRANT SELECT, INSERT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads approved testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (status = 'approved');
CREATE POLICY "anyone can submit testimonial" ON public.testimonials FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending');
CREATE POLICY "admins manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- contact requests
CREATE TABLE public.contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  project_type text,
  budget text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_requests TO authenticated;
GRANT ALL ON public.contact_requests TO service_role;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can send request" ON public.contact_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins manage requests" ON public.contact_requests FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- site settings
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number text NOT NULL DEFAULT '',
  instagram_url text NOT NULL DEFAULT 'https://instagram.com/zyronstudioofc',
  contact_email text NOT NULL DEFAULT '',
  contact_phone text NOT NULL DEFAULT '',
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_settings (whatsapp_number, instagram_url, contact_email, contact_phone)
VALUES ('5511999999999', 'https://instagram.com/zyronstudioofc', 'contato@zyronstudio.com', '');

INSERT INTO public.projects (title, description, category, project_url, technologies, is_featured, sort_order) VALUES
('Nexo Corporate', 'Site institucional completo para uma consultoria de tecnologia, com páginas de serviços, blog e área de contato integrada.', 'empresas', NULL, ARRAY['React','Tailwind','SEO'], true, 1),
('Sabor & Fogo', 'Site para restaurante com cardápio digital, galeria de pratos e reservas online.', 'restaurantes', NULL, ARRAY['React','Cardápio digital','Reservas'], false, 2),
('Lumen Lançamento', 'Landing page de alta conversão para lançamento de infoproduto, com foco em velocidade e captação.', 'landing-pages', NULL, ARRAY['Landing Page','Performance','Analytics'], false, 3),
('Atrium Arquitetura', 'Portfólio digital minimalista para escritório de arquitetura, com galeria de projetos em alta resolução.', 'empresas', NULL, ARRAY['React','Galeria','Design'], false, 4),
('Bistrô Aurora', 'Presença digital para bistrô premium: identidade, site e integração com redes sociais.', 'restaurantes', NULL, ARRAY['Design','Integrações','SEO'], false, 5),
('Vega Store', 'Loja virtual com catálogo, carrinho e checkout otimizado para conversão em dispositivos móveis.', 'outros', NULL, ARRAY['E-commerce','Checkout','Mobile'], false, 6);

INSERT INTO public.testimonials (name, rating, comment, status) VALUES
('Rafael Menezes', 5, 'A Zyron entregou um site muito acima do que eu esperava. Rápido, bonito e fácil de usar.', 'approved'),
('Camila Duarte', 5, 'Profissionalismo do início ao fim. O site do meu restaurante ficou impecável no celular.', 'approved'),
('Eduardo Lima', 5, 'A landing page aumentou muito a procura pelos nossos serviços. Recomendo demais.', 'approved');