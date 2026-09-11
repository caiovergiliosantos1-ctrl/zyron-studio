import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { WhyZyron } from "@/components/site/WhyZyron";
import { Portfolio } from "@/components/site/Portfolio";
import { Testimonials } from "@/components/site/Testimonials";
import { Process } from "@/components/site/Process";
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { FinalCta } from "@/components/site/FinalCta";
import { Footer } from "@/components/site/Footer";
import { WhatsappFab } from "@/components/site/WhatsappFab";

const TITLE = "Zyron Studio — Criação de sites profissionais";
const DESCRIPTION =
  "Agência digital especializada em sites profissionais, landing pages e e-commerce. Design sob medida, performance e presença digital de verdade.";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Zyron Studio",
  description: DESCRIPTION,
  areaServed: "BR",
  serviceType: [
    "Criação de sites",
    "Landing Pages",
    "Sites para empresas",
    "Sites para restaurantes",
    "E-commerce",
    "Otimização de sites",
  ],
  sameAs: ["https://instagram.com/zyronstudioofc"],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(JSON_LD) }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Services />
        <WhyZyron />
        <Portfolio />
        <Testimonials />
        <Process />
        <About />
        <Contact />
        <FinalCta />
      </main>
      <Footer />
      <WhatsappFab />
    </div>
  );
}
