import type { Metadata } from "next";
import { deliveryStore } from "@/features/delivery-proprio/catalog";
import { DeliveryLoginPage } from "@/features/delivery-proprio/login-page";

export const metadata: Metadata = {
  title: `Login | ${deliveryStore.name}`,
  description: "Login rapido do delivery proprio.",
};

export default function PizzaECiaDeliveryLoginPage() {
  return <DeliveryLoginPage />;
}
