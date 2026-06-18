# Mise LGPD Launch Checklist

This checklist tracks what must exist before selling Mise commercially.

## Legal Documents

- [x] Terms of Use draft.
- [x] Privacy Policy draft.
- [x] Cookie Policy draft.
- [x] Data Processing Agreement draft.
- [x] Public support page draft.
- [ ] Lawyer review.
- [ ] Replace all `[A DEFINIR]` placeholders.
- [ ] Add final CNPJ, legal name, address, support email and privacy email.
- [ ] Add DPO/encarregado name or role.
- [ ] Confirm forum clause.
- [ ] Add acceptance checkbox on signup/onboarding.
- [ ] Store document version and acceptance timestamp per organization/admin.

## LGPD Operations

- [ ] Build request flow for data subject rights.
- [ ] Define response owner and internal deadline.
- [ ] Create incident response playbook.
- [ ] Create incident register retained for the legally required period.
- [ ] Create subprocessor register and update process.
- [ ] Document retention schedule for accounts, orders, fiscal data, logs and backups.
- [ ] Create deletion/export procedure for restaurant data after cancellation.

## Cookies And Tracking

- [x] Public cookie policy draft.
- [ ] Avoid analytics/marketing cookies until a proper preference banner exists.
- [ ] Add cookie preference center if analytics/marketing tools are enabled.
- [ ] Keep necessary auth/security cookies outside optional consent.

## Product Controls

- [ ] Fix remaining security audit findings before pilot with real customers.
- [ ] Require authenticated calls for fiscal, payments and WhatsApp routes.
- [ ] Verify Mercado Pago webhook signature and persist idempotency keys.
- [ ] Add CSP/security headers.
- [ ] Restrict manager ability to create owner users.
- [ ] Validate all cross-tenant foreign keys, especially order customer_id.
- [ ] Add audit logs for user creation, role changes, fiscal, payment and WhatsApp actions.

## Commercial Onboarding

- [ ] Show that fiscal setup requires certificate, CSC/token, SEFAZ credentials and accountant validation.
- [ ] Show that Meta/WhatsApp, Mercado Pago and provider fiscal costs are external unless contract says otherwise.
- [ ] Show online-only v1 limitation and internet dependency.
- [ ] Add support boundaries for equipment, printer, network, accounting and third-party outages.
