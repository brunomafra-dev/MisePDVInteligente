import type { Metadata } from "next";
import { DeliverySite } from "@/features/delivery-proprio/delivery-site";
import { deliveryStore } from "@/features/delivery-proprio/catalog";

export const metadata: Metadata = {
  title: `${deliveryStore.name} | Delivery proprio`,
  description:
    "Cardapio digital com pedido direto para o delivery proprio do Mise.",
};

export default function PizzaECiaDeliveryPage() {
  return <DeliverySite />;
}
