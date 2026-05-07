import { z } from "zod";

export function sanitizeText(value: string) {
  return value
    .normalize("NFKC")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function textField(max: number, min = 1) {
  return z.string().transform(sanitizeText).pipe(z.string().min(min).max(max));
}

export function optionalTextField(max: number) {
  return z
    .string()
    .transform(sanitizeText)
    .pipe(z.string().max(max))
    .optional();
}

export function emailField() {
  return z
    .string()
    .transform((value) => sanitizeText(value).toLowerCase())
    .pipe(z.string().email().max(254));
}

export function passwordField(min = 1, max = 256) {
  return z.string().min(min).max(max);
}

export function moneyField(max = 1_000_000) {
  return z.number().finite().nonnegative().max(max);
}

export function positiveMoneyField(max = 1_000_000) {
  return z.number().finite().positive().max(max);
}

export function quantityField(max = 100_000) {
  return z.number().finite().positive().max(max);
}

export function signedQuantityField(maxAbs = 100_000) {
  return z.number().finite().min(-maxAbs).max(maxAbs).refine((value) => value !== 0, {
    message: "Quantidade nao pode ser zero",
  });
}
