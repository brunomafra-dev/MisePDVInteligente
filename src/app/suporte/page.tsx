import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Headphones, Mail, ShieldCheck, Wrench } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Suporte | Sabore",
  description:
    "Canais de suporte, limites operacionais e documentos publicos do Sabore.",
};

const supportBlocks = [
  {
    icon: Headphones,
    title: "Suporte operacional",
    text: "Ajuda com acesso, uso do PDV, mesas, delivery, cozinha, estoque, cadastro, relatorios e duvidas do piloto.",
  },
  {
    icon: Wrench,
    title: "Implantacao e treinamento",
    text: "Configuracao inicial, explicacao para equipe, ajuste de cardapio, mesas, insumos e rotina de abertura/fechamento.",
  },
  {
    icon: ShieldCheck,
    title: "Privacidade e seguranca",
    text: "Pedidos sobre dados pessoais, incidentes, permissoes de usuario, logs e revisao de acessos devem ir para o canal de privacidade.",
  },
];

const publicLinks = [
  { href: "/termos-de-uso", label: "Termos de Uso" },
  { href: "/politica-de-privacidade", label: "Politica de Privacidade" },
  { href: "/politica-de-cookies", label: "Politica de Cookies" },
  { href: "/acordo-de-tratamento-de-dados", label: "Acordo LGPD" },
];

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8faf7_0%,#eef4ef_52%,#ffffff_100%)] text-foreground">
      <header className="border-b border-border/70 bg-white/75 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1040px] flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link className="flex items-center gap-3" href="/site">
            <BrandMark />
            <div>
              <p className="text-sm font-semibold">Sabore</p>
              <p className="text-xs text-muted-foreground">Suporte e documentos</p>
            </div>
          </Link>
          <div className="flex flex-wrap gap-2">
            <Link href="/site">
              <Button variant="outline">Site</Button>
            </Link>
            <Link href="/">
              <Button>Entrar no app</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1040px] px-5 py-10 sm:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase text-primary">Central publica</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Suporte, privacidade e documentos em um so lugar
          </h1>
          <p className="mt-5 text-base leading-7 text-muted-foreground">
            Esta pagina concentra os caminhos publicos que o restaurante precisa
            encontrar antes de contratar, durante o piloto e depois que estiver
            operando no Sabore.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {supportBlocks.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="h-full bg-white/88">
              <CardHeader>
                <span className="flex size-11 items-center justify-center rounded-md border border-primary/15 bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <CardTitle className="pt-2">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-lg border border-border bg-white/88 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-primary/15 bg-primary/10 text-primary">
                <Mail className="size-5" />
              </span>
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Canais oficiais</h2>
                <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                  <p>
                    Suporte: <strong>[EMAIL DE SUPORTE A DEFINIR]</strong>
                  </p>
                  <p>
                    Privacidade/LGPD: <strong>[EMAIL DE PRIVACIDADE A DEFINIR]</strong>
                  </p>
                  <p>
                    Pilotos locais podem usar o canal combinado na implantacao ate que
                    os e-mails oficiais sejam publicados.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-white/88 p-5 sm:p-6">
            <h2 className="text-xl font-semibold tracking-tight">Limites importantes</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <p>
                O suporte do Sabore cobre uso do sistema e configuracoes do produto.
                Nao substitui contador, SEFAZ, provedor fiscal, suporte do Mercado Pago,
                Meta/WhatsApp, internet, rede local, impressora ou manutencao de
                equipamentos.
              </p>
              <p>
                NFC-e, certificado, CSC, credenciamento, aliquotas, impostos e
                obrigacoes fiscais continuam sob responsabilidade do restaurante e de
                seu contador.
              </p>
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-lg border border-border bg-white/88 p-5 sm:p-6">
          <h2 className="text-xl font-semibold tracking-tight">Documentos publicos</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                className="flex items-center justify-between rounded-md border border-border bg-background/70 px-4 py-3 text-sm font-medium transition hover:border-primary/30 hover:bg-primary/5"
                href={link.href}
              >
                {link.label}
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
