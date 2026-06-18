# Mise Legal Research Notes

Research date: 2026-05-07.

This file is an internal engineering/product note, not a legal opinion. A Brazilian lawyer should review the final public documents before paid pilots or commercial launch.

## Official LGPD/ANPD Sources Checked

- LGPD, Law 13.709/2018, Planalto: definitions, legal bases, controller/operator roles, data subject rights, security and incident duties. Link: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
- ANPD guide for controllers, operators and data protection officer: used to model the restaurant as controller and Mise as operator for end-customer/order data, while Mise remains controller for its own leads, site visitors and account contacts. Link: https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-para-definicoes-dos-agentes-de-tratamento-de-dados-pessoais-e-do-encarregado
- ANPD cookies guide: used to separate necessary cookies from analytics/marketing cookies and to avoid non-necessary cookies before a preference/consent flow exists. Link: https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf/view
- ANPD incident communication regulation notice: used to add incident handling language and recordkeeping awareness. Link: https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-aprova-o-regulamento-de-comunicacao-de-incidente-de-seguranca

## Reference SaaS Documents Checked

- Consumer Terms of Use: structured as a temporary software license, with plan limits, support, non-transferable use, user responsibility for login/password, fiscal responsibility, data protection clauses and Brazilian forum. Link: https://consumer.com.br/termos-uso
- Consumer Privacy Policy: covers security, data subject rights, cookies, retention and DPO contact. Link: https://consumer.com.br/politica-de-privacidade/
- Saipos Privacy Policy: has definitions, rights of data subjects and website/landing page data treatment language. Link: https://saipos.com/politica-de-privacidade
- Suflex General Terms: strong B2B software license clauses, IP protection, limitation of liability, external infrastructure/energy/equipment exclusions and customer responsibility for data entered in the software. Link: https://suflex.com.br/wp-content/uploads/2025/08/TERMOS-E-CONDICOES-GERAIS-DE-CONTRATACAO-SUFLEX.pdf
- Suflex Privacy Policy: clearly treats the contractor as controller for some data inserted into the application and Suflex as responsible for storage/processing tied to the service. Link: https://suflex.com.br/wp-content/uploads/2025/08/POLITICA-DE-PRIVACIDADE-SUFLEX.pdf
- Zig legal hub: good example of separating privacy, app terms, payment/consumption terms and software license by product/country. Link: https://zig.fun/termos-e-politicas/

## Product Decisions Applied To Mise

- Public legal routes:
  - `/site`
  - `/suporte`
  - `/termos-de-uso`
  - `/politica-de-privacidade`
  - `/politica-de-cookies`
  - `/acordo-de-tratamento-de-dados`
- Mise legal model:
  - Mise as controller for site visitors, leads, account admins, commercial contact and its own support/security data.
  - Restaurant as controller for end-customer order/delivery/WhatsApp data.
  - Mise as operator for restaurant-controlled data processed inside the SaaS.
- High-risk clauses included:
  - Fiscal/NFC-e responsibility remains with the restaurant and its accountant.
  - Third-party integrations are subject to provider rules, costs and uptime.
  - WhatsApp/marketing requires valid legal basis, consent/opt-out when applicable and Meta policy compliance.
  - Online-only v1 has no offline guarantee.
  - Restaurant remains responsible for food quality, operational decisions, staff, stock truth and data entered.
  - Sensitive data is not expected and should not be entered unless legally justified.

## Must Fill Before Launch

- Legal entity name.
- CNPJ.
- Registered address.
- Official support email.
- Official privacy/DPO email.
- Name or role of encarregado/DPO.
- Forum/jurisdiction clause.
- Real subprocessor list after Vercel/Supabase/Mercado Pago/Meta/Focus NFe setup is final.
- Retention periods confirmed by counsel/accounting, especially fiscal data, logs and backups.
