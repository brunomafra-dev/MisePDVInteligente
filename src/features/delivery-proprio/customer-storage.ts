"use client";

import { deliveryStore, deliveryZones } from "./catalog";

export type DeliveryCustomerPaymentMethod = "pix" | "cash" | "credit" | "debit";

export type DeliveryAddress = {
  id: string;
  label: string;
  neighborhoodId: string;
  street: string;
  number: string;
  complement: string;
  reference: string;
};

export type SavedDeliveryAccount = {
  name: string;
  phone: string;
  cpf: string;
  paymentMethod: DeliveryCustomerPaymentMethod;
  defaultAddressId: string;
  addresses: DeliveryAddress[];
  updatedAt: string;
};

export type DeliveryCheckoutPatch = {
  name: string;
  phone: string;
  cpf: string;
  fulfillment: "delivery";
  neighborhoodId: string;
  street: string;
  number: string;
  complement: string;
  reference: string;
  paymentMethod: DeliveryCustomerPaymentMethod;
};

export type SavedOrderReference = {
  id: string;
  code: string;
  phone: string;
  createdAt: string;
};

type LegacySavedDeliveryProfile = Partial<
  DeliveryCheckoutPatch & {
    fulfillment: "delivery" | "pickup";
  }
>;

export const accountStorageKey = `Mise:${deliveryStore.slug}:delivery-account:v1`;
const legacyProfileStorageKey = `Mise:${deliveryStore.slug}:delivery-profile:v1`;
const ordersStorageKey = `Mise:${deliveryStore.slug}:orders:v1`;

function browserStorage() {
  if (typeof window === "undefined") return null;

  return window.localStorage;
}

export function createDeliveryStorageId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function emptyDeliveryAddress(): DeliveryAddress {
  return {
    id: createDeliveryStorageId("addr"),
    label: "Casa",
    neighborhoodId: deliveryZones[0]?.id ?? "",
    street: "",
    number: "",
    complement: "",
    reference: "",
  };
}

export function emptyDeliveryAccount(): SavedDeliveryAccount {
  return {
    name: "",
    phone: "",
    cpf: "",
    paymentMethod: "pix",
    defaultAddressId: "",
    addresses: [],
    updatedAt: new Date().toISOString(),
  };
}

function normalizeAddress(address: Partial<DeliveryAddress>): DeliveryAddress | null {
  if (!address.street || !address.number) return null;

  return {
    id: address.id || createDeliveryStorageId("addr"),
    label: address.label || "Endereco",
    neighborhoodId: address.neighborhoodId || deliveryZones[0]?.id || "",
    street: address.street,
    number: address.number,
    complement: address.complement ?? "",
    reference: address.reference ?? "",
  };
}

function normalizeAccount(account: Partial<SavedDeliveryAccount>) {
  if (!account.name || !account.phone) return null;

  const addresses = (account.addresses ?? [])
    .map((address) => normalizeAddress(address))
    .filter((address): address is DeliveryAddress => Boolean(address));
  const defaultAddressId =
    addresses.find((address) => address.id === account.defaultAddressId)?.id ??
    addresses[0]?.id ??
    "";

  return {
    name: account.name,
    phone: account.phone,
    cpf: account.cpf ?? "",
    paymentMethod: account.paymentMethod ?? "pix",
    defaultAddressId,
    addresses,
    updatedAt: account.updatedAt ?? new Date().toISOString(),
  } satisfies SavedDeliveryAccount;
}

function migrateLegacyProfile(profile: LegacySavedDeliveryProfile) {
  if (!profile.name || !profile.phone) return null;

  const address = normalizeAddress({
    label: "Casa",
    neighborhoodId: profile.neighborhoodId,
    street: profile.street,
    number: profile.number,
    complement: profile.complement,
    reference: profile.reference,
  });

  return normalizeAccount({
    name: profile.name,
    phone: profile.phone,
    cpf: profile.cpf ?? "",
    paymentMethod: profile.paymentMethod ?? "pix",
    defaultAddressId: address?.id ?? "",
    addresses: address ? [address] : [],
    updatedAt: new Date().toISOString(),
  });
}

export function readSavedAccount() {
  try {
    const storage = browserStorage();
    if (!storage) return null;

    const rawAccount = storage.getItem(accountStorageKey);

    if (rawAccount) {
      return normalizeAccount(JSON.parse(rawAccount) as Partial<SavedDeliveryAccount>);
    }

    const rawLegacyProfile = storage.getItem(legacyProfileStorageKey);
    if (!rawLegacyProfile) return null;

    const migratedAccount = migrateLegacyProfile(
      JSON.parse(rawLegacyProfile) as LegacySavedDeliveryProfile,
    );

    if (migratedAccount) writeSavedAccount(migratedAccount);

    return migratedAccount;
  } catch {
    return null;
  }
}

export function writeSavedAccount(account: SavedDeliveryAccount) {
  const storage = browserStorage();
  if (!storage) return;

  storage.setItem(
    accountStorageKey,
    JSON.stringify({
      ...account,
      updatedAt: new Date().toISOString(),
    }),
  );
}

export function getDefaultAddress(account: SavedDeliveryAccount) {
  return (
    account.addresses.find((address) => address.id === account.defaultAddressId) ??
    account.addresses[0] ??
    null
  );
}

export function accountToCheckoutPatch(account: SavedDeliveryAccount) {
  const address = getDefaultAddress(account);

  return {
    name: account.name,
    phone: account.phone,
    cpf: account.cpf,
    fulfillment: "delivery",
    neighborhoodId: address?.neighborhoodId ?? deliveryZones[0]?.id ?? "",
    street: address?.street ?? "",
    number: address?.number ?? "",
    complement: address?.complement ?? "",
    reference: address?.reference ?? "",
    paymentMethod: account.paymentMethod,
  } satisfies DeliveryCheckoutPatch;
}

export function addressToCheckoutPatch(address: DeliveryAddress) {
  return {
    fulfillment: "delivery",
    neighborhoodId: address.neighborhoodId,
    street: address.street,
    number: address.number,
    complement: address.complement,
    reference: address.reference,
  } satisfies Pick<
    DeliveryCheckoutPatch,
    "fulfillment" | "neighborhoodId" | "street" | "number" | "complement" | "reference"
  >;
}

export function accountFromCheckout(
  account: SavedDeliveryAccount | null,
  checkout: DeliveryCheckoutPatch,
) {
  const currentAccount = account ?? emptyDeliveryAccount();
  const nextAddress = normalizeAddress({
    id:
      currentAccount.addresses.find(
        (address) =>
          address.neighborhoodId === checkout.neighborhoodId &&
          address.street.trim().toLowerCase() === checkout.street.trim().toLowerCase() &&
          address.number.trim().toLowerCase() === checkout.number.trim().toLowerCase(),
      )?.id ?? createDeliveryStorageId("addr"),
    label: currentAccount.addresses.length === 0 ? "Casa" : "Ultimo endereco",
    neighborhoodId: checkout.neighborhoodId,
    street: checkout.street,
    number: checkout.number,
    complement: checkout.complement,
    reference: checkout.reference,
  });
  const addresses = nextAddress
    ? [
        nextAddress,
        ...currentAccount.addresses.filter((address) => address.id !== nextAddress.id),
      ]
    : currentAccount.addresses;

  return {
    ...currentAccount,
    name: checkout.name,
    phone: checkout.phone,
    cpf: checkout.cpf,
    paymentMethod: checkout.paymentMethod,
    defaultAddressId: nextAddress?.id ?? currentAccount.defaultAddressId,
    addresses,
    updatedAt: new Date().toISOString(),
  } satisfies SavedDeliveryAccount;
}

export function readSavedOrders() {
  try {
    const storage = browserStorage();
    if (!storage) return [];

    const rawOrders = storage.getItem(ordersStorageKey);
    if (!rawOrders) return [];

    const parsed = JSON.parse(rawOrders) as Partial<SavedOrderReference>[];

    return parsed
      .filter(
        (order): order is SavedOrderReference =>
          Boolean(order.id && order.code && order.phone && order.createdAt),
      )
      .slice(0, 20);
  } catch {
    return [];
  }
}

export function writeSavedOrders(orders: SavedOrderReference[]) {
  const storage = browserStorage();
  if (!storage) return;

  storage.setItem(ordersStorageKey, JSON.stringify(orders.slice(0, 20)));
}
