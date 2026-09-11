# Zyron Studio — site premium completo

Site institucional da agência com visual monocromático futurista (preto absoluto, cinza chumbo, brilhos metálicos, branco de alto contraste), mais um painel administrativo protegido por login.

## Páginas públicas (uma página principal com seções ancoradas + rotas próprias)

1. **Cabeçalho fixo com efeito de vidro** — logo Zyron, navegação (Início, Serviços, Portfólio, Avaliações, Sobre, Contato), botão "Solicitar orçamento", menu hambúrguer no celular.
2. **Hero** — título rotativo animado alternando as quatro frases, subtítulo "Seu negócio merece uma presença digital à altura.", dois botões de ação, fundo com grade sutil e brilho.
3. **Serviços** — sete cartões com hover luminoso: criação de sites, landing pages, sites para empresas, restaurantes, e-commerce, otimização e presença digital.
4. **Por que escolher a Zyron** — seis diferenciais em blocos interativos.
5. **Portfólio** — projeto em destaque + grade filtrável (Todos, Empresas, Restaurantes, Landing Pages, Outros), etiquetas de tecnologia, link do projeto, imagem ou espaço reservado elegante. Dados vêm do banco.
6. **Avaliações** — depoimentos aprovados + formulário (nome, 1 a 5 estrelas, comentário) que entra como pendente.
7. **Processo** — linha do tempo de 5 passos.
8. **Sobre** — texto institucional, sem números inventados.
9. **Contato** — formulário de orçamento com confirmação após envio, link do Instagram @zyronstudioofc e botão de WhatsApp que usa o número salvo no painel.
10. **CTA final + rodapé** — links rápidos, redes, © 2026 Zyron Studio.

## Painel administrativo (/admin)

- Login por e-mail e senha; só quem tem perfil de administrador entra.
- **Projetos**: criar, editar, excluir, marcar destaque, definir categoria e imagem.
- **Avaliações**: aprovar, rejeitar, excluir.
- **Pedidos de orçamento**: lista das solicitações recebidas.
- **Configurações**: número de WhatsApp, redes sociais e dados de contato usados no site.

## Dados

Ativo o Lovable Cloud e crio quatro tabelas: projetos, avaliações, pedidos de contato e configurações do site, além da tabela de papéis de administrador. Leitura pública apenas do que é aprovado/publicado; qualquer alteração exige login de administrador. Projetos e configurações já nascem com conteúdo de demonstração para o site não abrir vazio.

## Detalhes técnicos

- TanStack Start + Tailwind v4; tokens de cor definidos em `src/styles.css` (nada de cores fixas nos componentes).
- Logo enviada publicada como asset CDN e usada no cabeçalho, rodapé e favicon.
- Leituras públicas via server functions com chave publicável; escritas e painel via `requireSupabaseAuth`, rotas do admin sob `_authenticated`.
- Animações com Motion; títulos rotativos com fade/slide.
- SEO: `head()` por rota com título, descrição e Open Graph, JSON-LD de organização, robots e sitemap.

## Primeiro passo após aprovação

Ativo o Lovable Cloud, crio as tabelas com o conteúdo inicial e depois construo as telas.

Você precisará criar sua conta de administrador no primeiro acesso a /admin — me diga o e-mail que devo liberar como administrador.
