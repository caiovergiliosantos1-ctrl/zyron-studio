import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { fetchSiteSettings, whatsappLink } from "@/lib/zyron-data";

export function WhatsappFab() {
  const { data: settings } = useQuery({ queryKey: ["site-settings"], queryFn: fetchSiteSettings });
  if (!settings?.whatsapp_number) return null;

  return (
    <a
      href={whatsappLink(settings.whatsapp_number)}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Falar no WhatsApp"
      className="fixed right-5 bottom-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
