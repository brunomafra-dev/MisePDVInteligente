export type DeliveryCategoryId =
  | "pizzas"
  | "sandwiches"
  | "pastels"
  | "snacks"
  | "tapioca"
  | "portions"
  | "drinks"
  | "juices"
  | "sweets";

export type DeliveryItemKind = "standard" | "pizza";

export type DeliveryCatalogItem = {
  id: string;
  categoryId: DeliveryCategoryId;
  kind: DeliveryItemKind;
  name: string;
  description?: string;
  price: number;
  badge?: string;
  kitchenArea: "kitchen" | "bar" | "pastry";
};

export type DeliveryCatalogSection = {
  id: DeliveryCategoryId;
  label: string;
  subtitle: string;
  items: DeliveryCatalogItem[];
};

export type PizzaDeliverySizeId = "brotinho" | "grande";

export type PizzaDeliveryFlavor = {
  id: string;
  name: string;
  description: string;
  group: "tradicional" | "doce" | "especial" | "premium";
  prices: Record<PizzaDeliverySizeId, number>;
};

export type DeliveryZone = {
  id: string;
  label: string;
  fee: number;
  etaMin: number;
  etaMax: number;
};

export const deliveryStore = {
  slug: "pizza-e-cia",
  name: "Pizza e Cia",
  brandLine: "Pastel, hamburgueria e pizzaria",
  logoUrl: "/logos/pizza-e-cia.svg",
  phoneDisplay: "82 98899-8090",
  whatsapp: "5582988998090",
  instagram: "@pastelecia_",
  address: "Amelia Rosa, Maceio - AL",
  minOrder: 15,
  defaultEtaMin: 35,
  defaultEtaMax: 55,
};

export const deliveryZones: DeliveryZone[] = [
  { id: "amelia-rosa", label: "Amelia Rosa", fee: 6, etaMin: 30, etaMax: 45 },
  { id: "jatiuca", label: "Jatiuca", fee: 6, etaMin: 35, etaMax: 50 },
  { id: "ponta-verde", label: "Ponta Verde", fee: 8, etaMin: 40, etaMax: 55 },
  { id: "mangabeiras", label: "Mangabeiras", fee: 8, etaMin: 40, etaMax: 60 },
  { id: "pajucara", label: "Pajucara", fee: 8, etaMin: 45, etaMax: 60 },
  { id: "poco", label: "Poco", fee: 8, etaMin: 45, etaMax: 65 },
];

export const pizzaDeliverySizes: Record<
  PizzaDeliverySizeId,
  { id: PizzaDeliverySizeId; label: string; slices: string; fromPrice: number }
> = {
  brotinho: {
    id: "brotinho",
    label: "Brotinho",
    slices: "Individual",
    fromPrice: 20,
  },
  grande: {
    id: "grande",
    label: "Grande",
    slices: "8 fatias",
    fromPrice: 45,
  },
};

export const pizzaDeliveryFlavors: PizzaDeliveryFlavor[] = [
  {
    id: "mussarela",
    name: "Mussarela",
    description: "Molho de tomate, queijo mussarela, azeitonas e oregano.",
    group: "tradicional",
    prices: { brotinho: 20, grande: 45 },
  },
  {
    id: "dois-queijos",
    name: "Dois queijos",
    description: "Molho de tomate, mussarela, catupiry e oregano.",
    group: "tradicional",
    prices: { brotinho: 20, grande: 45 },
  },
  {
    id: "margheritta",
    name: "Margheritta",
    description: "Molho de tomate, mussarela, tomate, manjericao e oregano.",
    group: "tradicional",
    prices: { brotinho: 20, grande: 45 },
  },
  {
    id: "mista",
    name: "Mista",
    description: "Molho de tomate, mussarela, presunto, tomate e oregano.",
    group: "tradicional",
    prices: { brotinho: 20, grande: 45 },
  },
  {
    id: "milho-verde",
    name: "Milho verde",
    description: "Mussarela, molho de tomate, milho verde, tomate e oregano.",
    group: "tradicional",
    prices: { brotinho: 20, grande: 45 },
  },
  {
    id: "calabresa",
    name: "Calabresa",
    description: "Molho de tomate, mussarela, calabresa, cebola, azeitona e oregano.",
    group: "tradicional",
    prices: { brotinho: 20, grande: 45 },
  },
  {
    id: "portuguesa",
    name: "Portuguesa",
    description:
      "Molho de tomate, mussarela, cebola, milho verde, azeitona, ovos, presunto, pimentao e oregano.",
    group: "tradicional",
    prices: { brotinho: 20, grande: 45 },
  },
  {
    id: "cartola",
    name: "Cartola",
    description: "Mussarela, banana, acucar e canela em po.",
    group: "doce",
    prices: { brotinho: 20, grande: 45 },
  },
  {
    id: "banana-doce-leite",
    name: "Banana com doce de leite",
    description: "Mussarela, banana e doce de leite.",
    group: "doce",
    prices: { brotinho: 20, grande: 45 },
  },
  {
    id: "chocolate-morango",
    name: "Chocolate com morango",
    description: "Mussarela, chocolate Nestle e morango fatiado.",
    group: "doce",
    prices: { brotinho: 20, grande: 45 },
  },
  {
    id: "chocolate-banana",
    name: "Chocolate com banana",
    description: "Mussarela, chocolate Nestle e banana fatiada.",
    group: "doce",
    prices: { brotinho: 20, grande: 45 },
  },
  {
    id: "brigadeiro",
    name: "Brigadeiro",
    description: "Mussarela, chocolate Nestle e granulado.",
    group: "doce",
    prices: { brotinho: 20, grande: 45 },
  },
  {
    id: "romeu-julieta",
    name: "Romeu e Julieta",
    description: "Mussarela, goiabada e catupiry.",
    group: "doce",
    prices: { brotinho: 20, grande: 45 },
  },
  {
    id: "banana-nevada",
    name: "Banana nevada",
    description: "Mussarela, banana, acucar, canela em po e chocolate branco.",
    group: "doce",
    prices: { brotinho: 20, grande: 45 },
  },
  {
    id: "frango-catupiry",
    name: "Frango com catupiry",
    description: "Molho de tomate, mussarela, frango desfiado, catupiry e oregano.",
    group: "especial",
    prices: { brotinho: 25, grande: 50 },
  },
  {
    id: "frango-caipira",
    name: "Frango caipira",
    description:
      "Molho de tomate, mussarela, frango desfiado, bacon, milho verde e oregano.",
    group: "especial",
    prices: { brotinho: 25, grande: 50 },
  },
  {
    id: "baiana",
    name: "Baiana",
    description:
      "Molho de tomate, mussarela, calabresa, pimenta calabresa, cebola e oregano.",
    group: "especial",
    prices: { brotinho: 25, grande: 50 },
  },
  {
    id: "quatro-queijos",
    name: "4 queijos",
    description:
      "Molho de tomate, mussarela, provolone, parmesao, catupiry e oregano.",
    group: "especial",
    prices: { brotinho: 25, grande: 50 },
  },
  {
    id: "lombo-catupiry",
    name: "Lombo catupiry",
    description: "Molho de tomate, mussarela, lombo defumado, catupiry e oregano.",
    group: "especial",
    prices: { brotinho: 25, grande: 50 },
  },
  {
    id: "catupirela",
    name: "Catupirela",
    description: "Molho de tomate, mussarela, calabresa, catupiry, cebola e oregano.",
    group: "especial",
    prices: { brotinho: 25, grande: 50 },
  },
  {
    id: "atum",
    name: "Atum",
    description: "Molho de tomate, mussarela, atum ralado e cebola e oregano.",
    group: "especial",
    prices: { brotinho: 25, grande: 50 },
  },
  {
    id: "dos-nunes",
    name: "Dos Nunes",
    description:
      "Molho de tomate, mussarela, file de alcatra em cubos, catupiry e oregano.",
    group: "premium",
    prices: { brotinho: 25, grande: 52 },
  },
  {
    id: "file-barbecue",
    name: "File barbecue",
    description:
      "Molho de tomate, mussarela, file de alcatra em cubos, tomate, catupiry, barbecue e oregano.",
    group: "premium",
    prices: { brotinho: 25, grande: 52 },
  },
  {
    id: "carne-de-sol",
    name: "Carne de sol",
    description:
      "Molho de tomate, mussarela, carne de sol, tomate, cebola e oregano.",
    group: "premium",
    prices: { brotinho: 25, grande: 52 },
  },
  {
    id: "frango-catupiry-bacon",
    name: "Frango com catupiry e bacon",
    description:
      "Molho de tomate, mussarela, frango desfiado, bacon em cubos e catupiry.",
    group: "premium",
    prices: { brotinho: 25, grande: 52 },
  },
  {
    id: "sertaneja",
    name: "Sertaneja",
    description:
      "Molho de tomate, mussarela, carne de sol desfiada, cebola e fatias de queijo coalho.",
    group: "premium",
    prices: { brotinho: 25, grande: 52 },
  },
];

function item(
  id: string,
  categoryId: DeliveryCategoryId,
  name: string,
  price: number,
  description?: string,
  kitchenArea: DeliveryCatalogItem["kitchenArea"] = "kitchen",
): DeliveryCatalogItem {
  return {
    id,
    categoryId,
    kind: "standard",
    name,
    description,
    price,
    kitchenArea,
  };
}

export const deliveryCatalogSections: DeliveryCatalogSection[] = [
  {
    id: "pizzas",
    label: "Pizzas",
    subtitle: "Ate 2 sabores no mesmo pedido",
    items: [
      {
        id: "pizza-brotinho",
        categoryId: "pizzas",
        kind: "pizza",
        name: "Pizza brotinho",
        description: "Individual, escolha 1 ou 2 sabores.",
        price: 20,
        badge: "a partir de",
        kitchenArea: "kitchen",
      },
      {
        id: "pizza-grande",
        categoryId: "pizzas",
        kind: "pizza",
        name: "Pizza grande",
        description: "8 fatias, escolha 1 ou 2 sabores.",
        price: 45,
        badge: "a partir de",
        kitchenArea: "kitchen",
      },
    ],
  },
  {
    id: "sandwiches",
    label: "Sanduiches",
    subtitle: "Hamburgueria da casa",
    items: [
      item("americano", "sandwiches", "Americano", 10, "Ovo, queijo, presunto e salada."),
      item(
        "beliskao",
        "sandwiches",
        "Beliskao",
        20,
        "Hamburguer caseiro, ovo, queijo, presunto, salsicha, milho e salada.",
      ),
      item(
        "franfile",
        "sandwiches",
        "Franfile",
        24,
        "File de frango, file de alcatra, bacon, ovo, queijo, presunto e salada.",
      ),
      item(
        "minuano",
        "sandwiches",
        "Minuano",
        20,
        "Hamburguer caseiro, ovo, queijo, presunto e salada.",
      ),
      item("misto", "sandwiches", "Misto", 8, "Queijo e presunto."),
      item(
        "x-alcatra",
        "sandwiches",
        "X-Alcatra",
        22,
        "File de alcatra, bacon, ovo, queijo, presunto e salada.",
      ),
      item(
        "x-bacon",
        "sandwiches",
        "X-Bacon",
        22,
        "Hamburguer caseiro, bacon, ovo, queijo, presunto e salada.",
      ),
      item(
        "x-burguer",
        "sandwiches",
        "X-Burguer",
        18,
        "Hamburguer caseiro, queijo, presunto e salada.",
      ),
      item(
        "x-frango",
        "sandwiches",
        "X-Frango",
        22,
        "File de frango, bacon, ovo, queijo, presunto e salada.",
      ),
      item(
        "x-calabresa",
        "sandwiches",
        "X-Calabresa",
        24,
        "Hamburguer caseiro, calabresa, ovo, queijo, presunto, tomate e alface.",
      ),
    ],
  },
  {
    id: "pastels",
    label: "Pasteis",
    subtitle: "Chines e japones",
    items: [
      item("pastel-chines-queijo", "pastels", "Pastel chines queijo", 10),
      item("pastel-chines-misto", "pastels", "Pastel chines misto", 10),
      item("pastel-chines-pizza", "pastels", "Pastel chines pizza", 10),
      item("pastel-chines-carne", "pastels", "Pastel chines carne", 10),
      item(
        "pastel-chines-carne-sol-catupiry",
        "pastels",
        "Pastel chines carne de sol com catupiry",
        10,
      ),
      item(
        "pastel-chines-camarao-catupiry",
        "pastels",
        "Pastel chines camarao com catupiry",
        10,
      ),
      item("pastel-chines-legumes", "pastels", "Pastel chines legumes", 10),
      item(
        "pastel-chines-banana-doce",
        "pastels",
        "Pastel chines banana com doce de leite",
        10,
      ),
      item("pastel-chines-romeu", "pastels", "Pastel chines Romeu e Julieta", 10),
      item("pastel-japones-queijo", "pastels", "Pastel japones queijo", 11),
      item("pastel-japones-misto", "pastels", "Pastel japones misto", 11),
      item("pastel-japones-frango", "pastels", "Pastel japones frango", 11),
      item("pastel-japones-carne", "pastels", "Pastel japones carne", 11),
      item("pastel-japones-pizza", "pastels", "Pastel japones pizza", 12),
      item("pastel-japones-carne-azeitona", "pastels", "Pastel japones carne c/ azeitona", 12),
      item("pastel-japones-frango-catupiry", "pastels", "Pastel japones frango c/ catupiry", 12),
      item("pastel-japones-frango-bacon", "pastels", "Pastel japones frango c/ bacon", 12),
      item("pastel-japones-calabresa-queijo", "pastels", "Pastel japones calabresa c/ queijo", 12),
      item(
        "pastel-japones-mistao",
        "pastels",
        "Pastel japones mistao",
        13,
        "Carne, frango, queijo, presunto e catupiry.",
      ),
    ],
  },
  {
    id: "snacks",
    label: "Salgados",
    subtitle: "Balcao e entrega",
    items: [
      item("coxinha-frango", "snacks", "Coxinha de frango", 9),
      item("coxinha-frango-bacon", "snacks", "Coxinha de frango c/ bacon", 9),
      item("coxinha-frango-catupiry", "snacks", "Coxinha de frango c/ catupiry", 9),
      item("coxinha-frango-cheddar", "snacks", "Coxinha de frango c/ cheddar", 9),
      item("coxinha-charque", "snacks", "Coxinha de charque", 11),
      item("enroladinho-camarao", "snacks", "Enroladinho de camarao", 11),
      item("enroladinho-salsicha", "snacks", "Enroladinho de salsicha", 8.5),
      item("boliviano", "snacks", "Boliviano", 9),
      item("pao-queijo", "snacks", "Pao de queijo", 10),
      item("empada-frango", "snacks", "Empada de frango", 8.5),
      item("empada-camarao", "snacks", "Empada de camarao", 8.5),
      item("pastel-forno-frango", "snacks", "Pastel de forno frango", 9.5),
      item("pastel-forno-frango-coalho", "snacks", "Pastel de forno frango c/ coalho", 9.5),
      item("pao-frango", "snacks", "Pao de frango", 10),
      item("empada-carne-sol-nata", "snacks", "Empada de carne de sol na nata", 8.5),
    ],
  },
  {
    id: "tapioca",
    label: "Tapioca",
    subtitle: "Doces e salgadas",
    items: [
      item("tapioca-coco", "tapioca", "Tradicional de coco", 10),
      item("tapioca-coco-leite-condensado", "tapioca", "Coco com leite condensado", 12),
      item("tapioca-coco-queijo", "tapioca", "Coco com queijo", 12),
      item("tapioca-coco-queijo-presunto", "tapioca", "Coco com queijo e presunto", 12),
      item("tapioca-frango-catupiry", "tapioca", "Frango com catupiry", 15),
      item("tapioca-carne-sol-queijo", "tapioca", "Carne de sol com queijo", 15),
      item("tapioca-doce-leite", "tapioca", "Doce de leite", 12),
    ],
  },
  {
    id: "portions",
    label: "Porcoes",
    subtitle: "Acompanhamentos e adicionais",
    items: [
      item("batata-frita", "portions", "Batata frita porcao", 10),
      item("adicional-hamburguer", "portions", "Adicional hamburguer caseiro", 6),
      item("adicional-carne-moida", "portions", "Adicional carne moida", 6),
      item("adicional-bacon", "portions", "Adicional bacon", 3),
      item("adicional-queijo", "portions", "Adicional queijo", 2),
      item("adicional-presunto", "portions", "Adicional presunto", 2),
      item("adicional-ovo", "portions", "Adicional ovo", 2),
      item("adicional-salsicha", "portions", "Adicional salsicha", 2),
    ],
  },
  {
    id: "drinks",
    label: "Bebidas",
    subtitle: "Refris, agua e cafe",
    items: [
      item("agua-gas", "drinks", "Agua c/ gas", 4, undefined, "bar"),
      item("agua-sem-gas", "drinks", "Agua s/ gas", 3, undefined, "bar"),
      item("guarana-caculinha", "drinks", "Guarana caculinha", 3, undefined, "bar"),
      item("coca-caculinha", "drinks", "Coca-Cola caculinha", 6, undefined, "bar"),
      item("coca-lata", "drinks", "Coca-Cola lata", 6, undefined, "bar"),
      item("coca-zero-lata", "drinks", "Coca-Cola Zero lata", 6, undefined, "bar"),
      item("fanta-laranja-lata", "drinks", "Fanta laranja lata", 6, undefined, "bar"),
      item("guarana-lata", "drinks", "Guarana lata", 6, undefined, "bar"),
      item("guarana-1l", "drinks", "Guarana 1 litro", 10, undefined, "bar"),
      item("coca-1l", "drinks", "Coca-Cola 1 litro", 10, undefined, "bar"),
      item("h2o", "drinks", "H2O", 6, undefined, "bar"),
      item("cafe", "drinks", "Cafe", 3, undefined, "bar"),
      item("cafe-leite", "drinks", "Cafe com leite", 4, undefined, "bar"),
    ],
  },
  {
    id: "juices",
    label: "Sucos",
    subtitle: "400 ml, 500 ml e 770 ml",
    items: [
      ...["caldo-cana", "acerola", "caja", "caju", "laranja", "limao"].flatMap(
        (slug) => {
          const names: Record<string, string> = {
            "caldo-cana": "Caldo de cana",
            acerola: "Acerola",
            caja: "Caja",
            caju: "Caju",
            laranja: "Laranja",
            limao: "Limao",
          };

          return [
            item(`suco-${slug}-400`, "juices", `${names[slug]} 400 ml`, 8, undefined, "bar"),
            item(`suco-${slug}-500`, "juices", `${names[slug]} 500 ml`, 10, undefined, "bar"),
            item(`suco-${slug}-770`, "juices", `${names[slug]} 770 ml`, 12, undefined, "bar"),
          ];
        },
      ),
    ],
  },
  {
    id: "sweets",
    label: "Doces",
    subtitle: "Sobremesas",
    items: [
      item("bem-casado", "sweets", "Bem casado", 4),
      item("moranguinho", "sweets", "Moranguinho", 4),
      item("brigadeiro-tradicional", "sweets", "Brigadeiro tradicional", 4),
      item("tortelete", "sweets", "Tortelete", 5),
      item("pudim", "sweets", "Pudim", 7),
      item("mousse-maracuja", "sweets", "Mousse de maracuja", 6),
      item("tortinha-limao", "sweets", "Tortinha de limao", 5),
    ],
  },
];

export function getDeliveryCatalogItem(itemId: string) {
  return deliveryCatalogSections
    .flatMap((section) => section.items)
    .find((item) => item.id === itemId);
}

export function getDeliveryZone(zoneId: string) {
  return deliveryZones.find((zone) => zone.id === zoneId);
}

export function getPizzaFlavor(flavorId: string) {
  return pizzaDeliveryFlavors.find((flavor) => flavor.id === flavorId);
}

export function getPizzaSizeFromItemId(itemId: string): PizzaDeliverySizeId | null {
  if (itemId === "pizza-brotinho") return "brotinho";
  if (itemId === "pizza-grande") return "grande";

  return null;
}

export function calculatePizzaDeliveryPrice(
  sizeId: PizzaDeliverySizeId,
  flavorIds: string[],
) {
  const prices = flavorIds
    .map((flavorId) => getPizzaFlavor(flavorId)?.prices[sizeId] ?? 0)
    .filter((price) => price > 0);

  if (prices.length === 0) return pizzaDeliverySizes[sizeId].fromPrice;

  return Math.max(...prices);
}

export function buildPizzaDeliveryName(
  sizeId: PizzaDeliverySizeId,
  flavorIds: string[],
) {
  const size = pizzaDeliverySizes[sizeId];
  const flavors = flavorIds
    .map((flavorId) => getPizzaFlavor(flavorId)?.name)
    .filter(Boolean);

  return `${size.label} ${flavors.join(" / ")}`;
}

export function normalizeDeliveryPhone(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  if (digits.length === 12 || digits.length === 13) return digits;

  return digits;
}
