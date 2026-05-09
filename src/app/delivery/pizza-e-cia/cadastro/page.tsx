import type { Metadata } from "next";
import { deliveryStore } from "@/features/delivery-proprio/catalog";
import { DeliveryAccountPage } from "@/features/delivery-proprio/account-page";

export const metadata: Metadata = {
  title: `Cadastro | ${deliveryStore.name}`,
  description: "Cadastro rapido com enderecos para o delivery proprio.",
};

export default function PizzaECiaDeliveryAccountPage() {
  return <DeliveryAccountPage />;
}
