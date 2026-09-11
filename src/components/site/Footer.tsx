import { useQuery } from "@tanstack/react-query";
import { Instagram, MessageCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/zyron-logo.jpg.asset.json";
import { fetchSiteSettings, whatsappLink } from "@/lib/zyron-data";

const LINKS = [
  { href: "#inicio", label: "Início" },
  { href: "#servicos", label: "Serviços" },
  { href: "#portfolio", label: "Portfólio" },
  { href: "#avaliacoes", label: "Avaliações" },
  { href: "#sobre", label: "Sobre" },
  { href: "#contato", label: "Contato" },
];

export function Footer() {
  const { data: settings } = useQuery({ queryKey: ["site-settings"], queryFn: fetchSiteSettings });

  return (
    <footer className="border-t border-border py-14">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={logo.url}
                alt="Zyron Studio"
                loading="lazy"
                className="h-11 w-11 rounded-lg object-cover ring-1 ring-border"
              />
              <span className="text-sm font-semibold tracking-[0.28em] text-foreground uppercase">
                Zyron Studio
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm text-muted-foreground">
              Agência digital especializada em criar sites profissionais, rápidos e feitos sob
              medida para o seu negócio.
            </p>
          </div>

          <div>
            <h3 className="text-xs tracking-[0.28em] text-muted-foreground uppercase">
              Links rápidos
            </h3>
            <ul className="mt-4 space-y-2">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs tracking-[0.28em] text-muted-foreground uppercase">Redes</h3>
            <div className="mt-4 flex gap-3">
              <a
                href={settings?.instagram_url || "https://instagram.com/zyronstudioofc"}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Instagram da Zyron Studio"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-accent"
              >
                <Instagram className="h-4.5 w-4.5" />
              </a>
              {settings?.whatsapp_number && (
                <a
                  href={whatsappLink(settings.whatsapp_number)}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="WhatsApp da Zyron Studio"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-accent"
                >
                  <MessageCircle className="h-4.5 w-4.5" />
                </a>
              )}
            </div>
            <Link
              to="/admin"
              className="mt-6 inline-block text-xs text-muted-foreground/70 transition-colors hover:text-foreground"
            >
              Área administrativa
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © 2026 Zyron Studio. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
