<div align="center">

# Mise PDV Inteligente

**SaaS operacional para restaurantes com pedidos, caixa, estoque, ficha técnica, CMV e delivery próprio.**

![Next.js](https://img.shields.io/badge/Next.js-111827?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-111827?style=for-the-badge&logo=typescript&logoColor=60a5fa)
![Supabase](https://img.shields.io/badge/Supabase-111827?style=for-the-badge&logo=supabase&logoColor=34d399)
![Playwright](https://img.shields.io/badge/Playwright-111827?style=for-the-badge&logo=playwright&logoColor=22c55e)

[Demo](https://misepdvinteligente.vercel.app/) · [Portfólio](https://www.brunomafra.website/pt)

</div>

---

## Descrição do problema

Restaurantes pequenos costumam operar pedidos, caixa, estoque, delivery, validade e custo de produtos em ferramentas separadas ou planilhas. Isso cria retrabalho, perda de informação, dificuldade de treinar equipe e pouca visibilidade sobre margem.

O Mise nasce de uma dor operacional real: restaurante precisa vender, produzir, controlar insumos e fechar caixa sem transformar cada rotina em um sistema isolado.

## Solução proposta

O projeto centraliza a operação de um restaurante em um MVP SaaS/PDV com foco em fluxo real de atendimento:

- pedido de balcão, mesa e delivery;
- acompanhamento de cozinha;
- caixa e recibo não fiscal;
- controle de estoque, validade e ficha técnica;
- cálculo de CMV e visão de indicadores;
- site público de delivery e suporte legal básico.

## Stack utilizada

| Camada | Tecnologias |
| --- | --- |
| Frontend | Next.js App Router, React, TypeScript, Tailwind CSS |
| Backend | API Routes, Zod, rate limit e serviços de domínio |
| Dados | Supabase, schema SQL, seed e autenticação |
| Integrações | WhatsApp, Mercado Pago e NFC-e em modo provider/mock |
| Qualidade | ESLint, Playwright e testes de domínio com TSX |

## Arquitetura resumida

```txt
src/
  app/
    app/
    delivery/
    site/
    api/
      mise/
      delivery/
      payments/
      fiscal/
      whatsapp/
  components/
    mise-app.tsx
    mise-auth-shell.tsx
  features/
    delivery-proprio/
  lib/
    operations.ts
    mise-mutations.ts
    integrations/
    security/
supabase/
  schema.sql
  seed.sql
tests/
docs/
```

## Screenshots

| Tela | O que demonstrar |
| --- | --- |
| App operacional | Painel principal com pedidos, caixa e módulos do PDV |
| Delivery próprio | Cardápio público, carrinho e envio de pedido |
| Estoque e ficha técnica | Insumos, validade, consumo e cálculo de CMV |
| Site público | Landing page comercial e páginas legais |

Imagem de preview disponível no projeto: [`public/mise-preview.png`](public/mise-preview.png).

## Funcionalidades

- Pedidos de balcão, mesa e delivery próprio.
- Fluxo operacional de cozinha.
- Caixa manual e recibo não fiscal.
- Gestão de produtos, estoque, validade e lotes.
- Ficha técnica e cálculo de CMV.
- Site público de delivery.
- Autenticação com Supabase.
- Controle de planos e módulos opcionais.
- Páginas públicas de suporte, termos, privacidade, cookies e LGPD.
- Providers preparados para WhatsApp, Mercado Pago e NFC-e.
- Testes de domínio para pedidos, estoque, caixa e segurança de payload.

## Roadmap

- Adicionar screenshots reais da operação em `docs/screenshots/`.
- Evoluir autenticação multiempresa e papéis por unidade.
- Trocar mocks por integrações reais conforme credenciais/API.
- Refinar dashboard de margem, estoque, vendas e alertas.
- Ampliar testes de fluxo operacional ponta a ponta.
- Consolidar domínio definitivo da marca Mise.

## Aprendizados

- Sistemas operacionais precisam começar por regras de negócio, não por tela.
- Estoque, caixa e pedido exigem consistência transacional e validação forte.
- Experiência real em cozinha ajuda a prever casos que CRUDs simples não cobrem.
- Mesmo um MVP precisa comunicar limites de fiscal, pagamento e integrações externas.
- Produto B2B ganha valor quando traduz rotina operacional em fluxo simples.

## Como executar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

Copie `.env.example` para `.env.local` e preencha apenas o que for usar:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
FOCUS_NFE_TOKEN=
FOCUS_NFE_BASE_URL=
MERCADO_PAGO_ACCESS_TOKEN=
MERCADO_PAGO_BASE_URL=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_GRAPH_BASE_URL=
WHATSAPP_GRAPH_VERSION=
```

Scripts úteis:

```bash
npm run build
npm run lint
npm run test
npm run test:browser
```

## Link para Demo

https://misepdvinteligente.vercel.app/

## Link para Portfólio

https://www.brunomafra.website/pt
