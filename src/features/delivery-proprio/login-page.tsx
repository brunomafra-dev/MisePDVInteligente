"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, CheckCircle2, LogIn, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { deliveryStore } from "./catalog";
import { readSavedAccount, type SavedDeliveryAccount } from "./customer-storage";

function inputClassName(className?: string) {
  return cn(
    "h-12 w-full rounded-md border border-[#f0dc90] bg-white px-3 text-sm outline-none transition placeholder:text-[#9a6b45] focus:border-[#d90416] focus:ring-2 focus:ring-[#d90416]/15",
    className,
  );
}

function cleanPhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function createInitialAccount() {
  return readSavedAccount();
}

export function DeliveryLoginPage() {
  const [savedAccount] = useState<SavedDeliveryAccount | null>(createInitialAccount);
  const [phone, setPhone] = useState(savedAccount?.phone ?? "");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoggedIn(false);

    if (cleanPhone(phone).length < 10) {
      setError("Informe o WhatsApp usado no cadastro.");
      return;
    }

    if (!savedAccount) {
      setError("Nenhum cadastro encontrado neste aparelho. Cadastre-se para salvar seus dados.");
      return;
    }

    if (cleanPhone(savedAccount.phone) !== cleanPhone(phone)) {
      setError("WhatsApp diferente do cadastro salvo neste aparelho.");
      return;
    }

    setLoggedIn(true);
  }

  return (
    <main className="min-h-screen bg-[#fff7d6] text-[#24140d]">
      <div className="mx-auto min-h-screen w-full max-w-[560px] bg-[#fffdf6] shadow-[0_0_80px_-58px_rgba(91,27,18,0.5)]">
        <header className="sticky top-0 z-30 border-b border-[#f0dc90] bg-[#fffdf6]/95 backdrop-blur">
          <div className="bg-[#d90416] px-4 py-2 text-xs font-semibold text-white">
            <div className="flex items-center justify-between gap-3">
              <span>Login do delivery</span>
              <Link
                className="rounded-md bg-white/15 px-2 py-1 text-[11px] font-semibold"
                href={`/delivery/${deliveryStore.slug}`}
              >
                Cardapio
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-4">
            <Link
              aria-label="Voltar para o cardapio"
              className="flex size-11 shrink-0 items-center justify-center rounded-md border border-[#f0dc90] bg-white"
              href={`/delivery/${deliveryStore.slug}`}
            >
              <ArrowLeft className="size-4" />
            </Link>
            <Image
              alt={`Logo ${deliveryStore.name}`}
              src={deliveryStore.logoUrl}
              width={52}
              height={52}
              className="size-[52px] rounded-md border border-[#f0dc90] bg-white object-contain p-1"
              priority
            />
            <div className="min-w-0">
              <p className="truncate text-sm text-[#7a4a25]">{deliveryStore.name}</p>
              <h1 className="truncate text-xl font-semibold">Entrar na minha conta</h1>
            </div>
          </div>
        </header>

        <div className="px-4 py-5">
          <section className="rounded-lg border border-[#f0dc90] bg-white p-4">
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-[#fff1a8] text-[#9a3412]">
                <Smartphone className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#d90416]">
                  Acesso rapido
                </p>
                <p className="mt-1 text-sm leading-6 text-[#7a4a25]">
                  Use o WhatsApp salvo no cadastro deste aparelho para puxar seus dados no
                  checkout.
                </p>
              </div>
            </div>

            {savedAccount ? (
              <div className="mt-4 rounded-md border border-[#b7f0c6] bg-[#e6ffed] px-3 py-3 text-sm text-[#14532d]">
                Cadastro encontrado: <strong>{savedAccount.name}</strong>,{" "}
                {savedAccount.addresses.length} endereco(s) salvo(s).
              </div>
            ) : (
              <div className="mt-4 rounded-md border border-[#f0dc90] bg-[#fff9e6] px-3 py-3 text-sm text-[#7a4a25]">
                Este aparelho ainda nao tem cadastro salvo.
              </div>
            )}

            {loggedIn ? (
              <div className="mt-4 flex items-start gap-3 rounded-md border border-[#b7f0c6] bg-[#e6ffed] px-3 py-3 text-sm text-[#14532d]">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                Login confirmado. Agora e so continuar o pedido.
              </div>
            ) : null}

            {error ? (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <form className="mt-4 grid gap-3" onSubmit={submitLogin}>
              <input
                className={inputClassName()}
                inputMode="tel"
                maxLength={20}
                placeholder="WhatsApp cadastrado"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
              <Button className="h-12 bg-[#0f7f3a] hover:bg-[#0b6930]" type="submit">
                <LogIn className="mr-2 size-4" />
                Entrar
              </Button>
            </form>

            <div className="mt-4 grid gap-2 text-center text-sm">
              <Link
                className="font-semibold text-[#d90416]"
                href={`/delivery/${deliveryStore.slug}/cadastro`}
              >
                Nao tem cadastro ainda? Cadastre-se aqui
              </Link>
              <Link
                className="text-[#7a4a25] underline-offset-4 hover:underline"
                href={`/delivery/${deliveryStore.slug}`}
              >
                Continuar sem cadastro
              </Link>
            </div>
          </section>

          {loggedIn ? (
            <div className="mt-4 grid gap-3">
              <Link
                className="inline-flex h-12 items-center justify-center rounded-md bg-[#d90416] px-4 text-sm font-semibold text-white"
                href={`/delivery/${deliveryStore.slug}`}
              >
                Ver cardapio
              </Link>
              <Link
                className="inline-flex h-12 items-center justify-center rounded-md border border-[#f0dc90] bg-white px-4 text-sm font-semibold"
                href={`/delivery/${deliveryStore.slug}/cadastro`}
              >
                Editar cadastro
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
