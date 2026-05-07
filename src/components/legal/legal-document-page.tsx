import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import type { LegalDocument } from "@/lib/legal-docs";

const legalLinks = [
  { href: "/site", label: "Site" },
  { href: "/termos-de-uso", label: "Termos" },
  { href: "/politica-de-privacidade", label: "Privacidade" },
  { href: "/politica-de-cookies", label: "Cookies" },
  { href: "/acordo-de-tratamento-de-dados", label: "Acordo LGPD" },
  { href: "/suporte", label: "Suporte" },
];

export function LegalDocumentPage({ document }: { document: LegalDocument }) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8faf7_0%,#eef4ef_52%,#ffffff_100%)] text-foreground">
      <header className="border-b border-border/70 bg-white/75 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1040px] flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link className="flex items-center gap-3" href="/site">
            <BrandMark />
            <div>
              <p className="text-sm font-semibold">Sabore</p>
              <p className="text-xs text-muted-foreground">Documentos legais</p>
            </div>
          </Link>
          <nav className="flex flex-wrap items-center gap-2 text-sm">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                className="rounded-md px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1040px] px-5 py-10 sm:px-8">
        <Link href="/site">
          <Button variant="outline" className="h-10">
            <ArrowLeft />
            Voltar
          </Button>
        </Link>

        <div className="mt-8 max-w-3xl">
          <p className="text-sm font-medium uppercase text-primary">{document.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            {document.title}
          </h1>
          <p className="mt-5 text-base leading-7 text-muted-foreground">
            {document.summary}
          </p>
          <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-950">
            <strong>Ultima atualizacao:</strong> {document.lastUpdated}.{" "}
            {document.reviewNotice}
          </div>
        </div>

        <div className="mt-10 space-y-5">
          {document.sections.map((section) => (
            <section
              key={section.title}
              className="rounded-lg border border-border bg-white/88 p-5 shadow-[0_18px_55px_-48px_rgba(15,23,42,0.45)] sm:p-6"
            >
              <h2 className="text-xl font-semibold tracking-tight">{section.title}</h2>
              {section.body ? (
                <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              ) : null}
              {section.bullets ? (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
              {section.table ? (
                <div className="mt-4 overflow-x-auto rounded-md border border-border">
                  <table className="w-full min-w-[620px] text-left text-sm">
                    <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                      <tr>
                        {section.table.headers.map((header) => (
                          <th key={header} className="px-4 py-3 font-semibold">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row) => (
                        <tr key={row.join("|")} className="border-t border-border">
                          {row.map((cell) => (
                            <td key={cell} className="px-4 py-3 align-top text-muted-foreground">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
