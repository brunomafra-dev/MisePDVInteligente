import type { SupabaseClient } from "@supabase/supabase-js";
import { demoData } from "@/lib/demo-data";
import type {
  CashSession,
  Customer,
  DeliveryOrderDetail,
  DiningTable,
  Ingredient,
  InventoryLot,
  InventoryMovement,
  Order,
  OrderItem,
  Payment,
  PlanCode,
  Product,
  RecipeItem,
  RestaurantUnit,
  SaboreData,
  UserProfile,
  WhatsAppTemplate,
} from "@/lib/types";
import { getSupabaseAdmin, getSupabaseDataClient } from "./server";

type DbRow = Record<string, unknown>;

export interface SaboreDataResult {
  data: SaboreData;
  source: "supabase" | "demo";
  message: string;
}

function stringValue(row: DbRow, key: string, fallback = "") {
  const value = row[key];

  return typeof value === "string" ? value : fallback;
}

function optionalString(row: DbRow, key: string) {
  const value = row[key];

  return typeof value === "string" ? value : undefined;
}

function numberValue(row: DbRow, key: string, fallback = 0) {
  const value = row[key];

  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);

  return fallback;
}

function booleanValue(row: DbRow, key: string, fallback = false) {
  const value = row[key];

  return typeof value === "boolean" ? value : fallback;
}

function stringArrayValue(row: DbRow, key: string) {
  const value = row[key];

  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

async function selectRows(
  client: SupabaseClient,
  table: string,
  select = "*",
) {
  const { data, error } = await client.from(table).select(select);

  if (error) {
    throw new Error(`${table}: ${error.message}`);
  }

  return (data ?? []) as unknown as DbRow[];
}

async function selectRowsEq(
  client: SupabaseClient,
  table: string,
  column: string,
  value: string,
  select = "*",
) {
  const { data, error } = await client.from(table).select(select).eq(column, value);

  if (error) {
    throw new Error(`${table}: ${error.message}`);
  }

  return (data ?? []) as unknown as DbRow[];
}

async function selectRowsIn(
  client: SupabaseClient,
  table: string,
  column: string,
  values: string[],
  select = "*",
) {
  if (values.length === 0) return [];

  const { data, error } = await client.from(table).select(select).in(column, values);

  if (error) {
    throw new Error(`${table}: ${error.message}`);
  }

  return (data ?? []) as unknown as DbRow[];
}

async function selectOptionalRowsIn(
  client: SupabaseClient,
  table: string,
  column: string,
  values: string[],
  select = "*",
) {
  if (values.length === 0) return [];

  const { data, error } = await client.from(table).select(select).in(column, values);

  if (error) return [];

  return (data ?? []) as unknown as DbRow[];
}

function groupBy(rows: DbRow[], key: string) {
  return rows.reduce<Record<string, DbRow[]>>((groups, row) => {
    const value = stringValue(row, key);
    groups[value] = groups[value] ? [...groups[value], row] : [row];

    return groups;
  }, {});
}

function mapUnit(row: DbRow): RestaurantUnit {
  return {
    id: stringValue(row, "id"),
    organizationId: stringValue(row, "organization_id"),
    name: stringValue(row, "name"),
    city: stringValue(row, "city"),
    neighborhood: stringValue(row, "neighborhood"),
    fiscalEnabled: booleanValue(row, "fiscal_enabled"),
  };
}

function planCodeValue(row: DbRow): PlanCode {
  const value = stringValue(row, "plan_code", "essential");

  return value === "operation" ? "operation" : "essential";
}

function organizationLogoUrl(row: DbRow) {
  const logoUrl = optionalString(row, "logo_url");

  if (logoUrl) return logoUrl;
  if (stringValue(row, "name") === "Pizza e Cia") return "/logos/pizza-e-cia.svg";

  return undefined;
}

function mapOrder(
  row: DbRow,
  itemsByOrder: Record<string, DbRow[]>,
  paymentsByOrder: Record<string, DbRow[]>,
): Order {
  const orderId = stringValue(row, "id");

  return {
    id: orderId,
    unitId: stringValue(row, "unit_id"),
    code: stringValue(row, "code"),
    channel: stringValue(row, "channel", "counter") as Order["channel"],
    status: stringValue(row, "status", "new") as Order["status"],
    openedAt: stringValue(row, "opened_at"),
    tableId: optionalString(row, "table_id"),
    customerId: optionalString(row, "customer_id"),
    deliveryFee: numberValue(row, "delivery_fee"),
    discount: numberValue(row, "discount"),
    fiscalStatus: stringValue(
      row,
      "fiscal_status",
      "disabled",
    ) as Order["fiscalStatus"],
    whatsappStatus: stringValue(
      row,
      "whatsapp_status",
      "not_sent",
    ) as Order["whatsappStatus"],
    items: (itemsByOrder[orderId] ?? []).map<OrderItem>((item) => ({
      id: stringValue(item, "id"),
      productId: stringValue(item, "product_id"),
      quantity: numberValue(item, "quantity", 1),
      notes: optionalString(item, "notes"),
      name: optionalString(item, "custom_name"),
      unitPrice:
        item.unit_price === null || item.unit_price === undefined
          ? undefined
          : numberValue(item, "unit_price"),
    })),
    payments: (paymentsByOrder[orderId] ?? []).map<Payment>((payment) => ({
      id: stringValue(payment, "id"),
      method: stringValue(payment, "method", "cash") as Payment["method"],
      amount: numberValue(payment, "amount"),
      externalId: optionalString(payment, "external_id"),
      receivedAt: stringValue(payment, "received_at"),
    })),
  };
}

function mapDeliveryDetail(row: DbRow): DeliveryOrderDetail {
  const changeFor =
    row.change_for === null || row.change_for === undefined
      ? undefined
      : numberValue(row, "change_for");

  return {
    id: stringValue(row, "id"),
    orderId: stringValue(row, "order_id"),
    fulfillment: stringValue(row, "fulfillment", "delivery") as DeliveryOrderDetail["fulfillment"],
    phone: stringValue(row, "phone"),
    cpf: optionalString(row, "cpf"),
    neighborhood: optionalString(row, "neighborhood"),
    street: optionalString(row, "street"),
    number: optionalString(row, "number"),
    complement: optionalString(row, "complement"),
    reference: optionalString(row, "reference"),
    paymentMethod: stringValue(row, "payment_method", "pix") as DeliveryOrderDetail["paymentMethod"],
    changeFor,
    whatsappOptIn: booleanValue(row, "whatsapp_opt_in", true),
    etaMin: numberValue(row, "eta_min", 35),
    etaMax: numberValue(row, "eta_max", 55),
    source: stringValue(row, "source", "delivery_site"),
  };
}

function mapSaboreData({
  organizationRow,
  unit,
  userRows,
  tableRows,
  customerRows,
  ingredientRows,
  lotRows,
  productRows,
  recipeRows,
  orderRows,
  orderItemRows,
  deliveryDetailRows,
  paymentRows,
  cashRows,
  movementRows,
  templateRows,
}: {
  organizationRow: DbRow;
  unit: DbRow;
  userRows: DbRow[];
  tableRows: DbRow[];
  customerRows: DbRow[];
  ingredientRows: DbRow[];
  lotRows: DbRow[];
  productRows: DbRow[];
  recipeRows: DbRow[];
  orderRows: DbRow[];
  orderItemRows: DbRow[];
  deliveryDetailRows: DbRow[];
  paymentRows: DbRow[];
  cashRows: DbRow[];
  movementRows: DbRow[];
  templateRows: DbRow[];
}): SaboreData {
  const itemsByOrder = groupBy(orderItemRows, "order_id");
  const paymentsByOrder = groupBy(paymentRows, "order_id");

  return {
    organization: {
      id: stringValue(organizationRow, "id"),
      name: stringValue(organizationRow, "name"),
      logoUrl: organizationLogoUrl(organizationRow),
      planCode: planCodeValue(organizationRow),
      planPrice: numberValue(organizationRow, "plan_price", 59.9),
      enabledModules: stringArrayValue(organizationRow, "enabled_modules"),
    },
    unit: mapUnit(unit),
    users: userRows.map<UserProfile>((row) => ({
      id: stringValue(row, "id"),
      unitId: stringValue(row, "unit_id"),
      name: stringValue(row, "name"),
      role: stringValue(row, "role", "stock") as UserProfile["role"],
    })),
    tables: tableRows.map<DiningTable>((row) => ({
      id: stringValue(row, "id"),
      unitId: stringValue(row, "unit_id"),
      label: stringValue(row, "label"),
      seats: numberValue(row, "seats", 4),
      status: stringValue(row, "status", "free") as DiningTable["status"],
    })),
    customers: customerRows.map<Customer>((row) => ({
      id: stringValue(row, "id"),
      unitId: stringValue(row, "unit_id"),
      name: stringValue(row, "name"),
      phone: stringValue(row, "phone"),
      neighborhood: optionalString(row, "neighborhood"),
    })),
    ingredients: ingredientRows.map<Ingredient>((row) => ({
      id: stringValue(row, "id"),
      unitId: stringValue(row, "unit_id"),
      name: stringValue(row, "name"),
      measure: stringValue(row, "measure", "un") as Ingredient["measure"],
      averageCost: numberValue(row, "average_cost"),
      minimumStock: numberValue(row, "minimum_stock"),
    })),
    lots: lotRows.map<InventoryLot>((row) => ({
      id: stringValue(row, "id"),
      ingredientId: stringValue(row, "ingredient_id"),
      supplier: stringValue(row, "supplier"),
      batchCode: stringValue(row, "batch_code"),
      quantity: numberValue(row, "quantity"),
      expiresAt: stringValue(row, "expires_at"),
      receivedAt: stringValue(row, "received_at"),
    })),
    products: productRows.map<Product>((row) => ({
      id: stringValue(row, "id"),
      unitId: stringValue(row, "unit_id"),
      name: stringValue(row, "name"),
      category: stringValue(row, "category"),
      price: numberValue(row, "price"),
      active: booleanValue(row, "active", true),
      preparationArea: stringValue(
        row,
        "preparation_area",
        "kitchen",
      ) as Product["preparationArea"],
    })),
    recipe: recipeRows.map<RecipeItem>((row) => ({
      id: stringValue(row, "id"),
      productId: stringValue(row, "product_id"),
      ingredientId: stringValue(row, "ingredient_id"),
      quantity: numberValue(row, "quantity"),
    })),
    orders: orderRows.map((row) => mapOrder(row, itemsByOrder, paymentsByOrder)),
    deliveryDetails: deliveryDetailRows.map(mapDeliveryDetail),
    cashSession: cashRows[0]
      ? {
          id: stringValue(cashRows[0], "id"),
          unitId: stringValue(cashRows[0], "unit_id"),
          openedBy: stringValue(cashRows[0], "opened_by"),
          openedAt: stringValue(cashRows[0], "opened_at"),
          openingAmount: numberValue(cashRows[0], "opening_amount"),
          expectedAmount: numberValue(cashRows[0], "expected_amount"),
          status: stringValue(
            cashRows[0],
            "status",
            "open",
          ) as CashSession["status"],
        }
      : demoData.cashSession,
    movements: movementRows.map<InventoryMovement>((row) => ({
      id: stringValue(row, "id"),
      unitId: stringValue(row, "unit_id"),
      ingredientId: stringValue(row, "ingredient_id"),
      orderId: optionalString(row, "order_id"),
      type: stringValue(
        row,
        "type",
        "receipt",
      ) as InventoryMovement["type"],
      quantity: numberValue(row, "quantity"),
      costImpact: numberValue(row, "cost_impact"),
      reason: stringValue(row, "reason"),
      createdAt: stringValue(row, "created_at"),
    })),
    whatsappTemplates: templateRows.map<WhatsAppTemplate>((row) => ({
      id: stringValue(row, "id"),
      unitId: stringValue(row, "unit_id"),
      name: stringValue(row, "name"),
      category: stringValue(row, "category", "utility") as WhatsAppTemplate["category"],
      status: stringValue(row, "status", "draft") as WhatsAppTemplate["status"],
      monthlyPrice: numberValue(row, "monthly_price"),
    })),
  };
}

export async function getSaboreDataForUnit(unitId: string): Promise<SaboreDataResult> {
  const client = getSupabaseAdmin();
  const unitRows = await selectRowsEq(client, "restaurant_units", "id", unitId);
  const unit = unitRows[0];

  if (!unit) {
    throw new Error("Unidade nao encontrada");
  }

  const organizationRows = await selectRowsEq(
    client,
    "organizations",
    "id",
    stringValue(unit, "organization_id"),
  );
  const organizationRow = organizationRows[0];

  if (!organizationRow) {
    throw new Error("Organizacao nao encontrada");
  }

  const [
    userRows,
    tableRows,
    customerRows,
    ingredientRows,
    productRows,
    orderRows,
    cashRows,
    movementRows,
    templateRows,
  ] = await Promise.all([
    selectRowsEq(client, "user_profiles", "unit_id", unitId),
    selectRowsEq(client, "dining_tables", "unit_id", unitId),
    selectRowsEq(client, "customers", "unit_id", unitId),
    selectRowsEq(client, "ingredients", "unit_id", unitId),
    selectRowsEq(client, "products", "unit_id", unitId),
    selectRowsEq(client, "orders", "unit_id", unitId),
    selectRowsEq(client, "cash_sessions", "unit_id", unitId),
    selectRowsEq(client, "inventory_movements", "unit_id", unitId),
    selectRowsEq(client, "whatsapp_templates", "unit_id", unitId),
  ]);
  const ingredientIds = ingredientRows.map((row) => stringValue(row, "id"));
  const productIds = productRows.map((row) => stringValue(row, "id"));
  const orderIds = orderRows.map((row) => stringValue(row, "id"));
  const [lotRows, recipeRows, orderItemRows, deliveryDetailRows, paymentRows] =
    await Promise.all([
      selectRowsIn(client, "inventory_lots", "ingredient_id", ingredientIds),
      selectRowsIn(client, "recipe_items", "product_id", productIds),
      selectRowsIn(client, "order_items", "order_id", orderIds),
      selectOptionalRowsIn(client, "delivery_order_details", "order_id", orderIds),
      selectRowsIn(client, "payments", "order_id", orderIds),
    ]);

  return {
    data: mapSaboreData({
      organizationRow,
      unit,
      userRows,
      tableRows,
      customerRows,
      ingredientRows,
      lotRows,
      productRows,
      recipeRows,
      orderRows,
      orderItemRows,
      deliveryDetailRows,
      paymentRows,
      cashRows,
      movementRows,
      templateRows,
    }),
    source: "supabase",
    message: "Dados carregados com login e unidade isolada.",
  };
}

export async function getSaboreData(): Promise<SaboreDataResult> {
  const client = getSupabaseDataClient();

  if (!client) {
    return {
      data: demoData,
      source: "demo",
      message: "Env vars do Supabase ausentes; usando dados demo.",
    };
  }

  try {
    const organizations = await selectRows(client, "organizations");
    const organizationRow = organizations[0];

    if (!organizationRow) {
      return {
        data: demoData,
        source: "demo",
        message: "Supabase conectado, mas sem seed; usando dados demo.",
      };
    }

    const [
      unitRows,
      userRows,
      tableRows,
      customerRows,
      ingredientRows,
      lotRows,
      productRows,
      recipeRows,
      orderRows,
      orderItemRows,
      paymentRows,
      cashRows,
      movementRows,
      templateRows,
    ] = await Promise.all([
      selectRows(client, "restaurant_units"),
      selectRows(client, "user_profiles"),
      selectRows(client, "dining_tables"),
      selectRows(client, "customers"),
      selectRows(client, "ingredients"),
      selectRows(client, "inventory_lots"),
      selectRows(client, "products"),
      selectRows(client, "recipe_items"),
      selectRows(client, "orders"),
      selectRows(client, "order_items"),
      selectRows(client, "payments"),
      selectRows(client, "cash_sessions"),
      selectRows(client, "inventory_movements"),
      selectRows(client, "whatsapp_templates"),
    ]);
    const unit = unitRows[0];

    if (!unit) {
      return {
        data: demoData,
        source: "demo",
        message: "Supabase conectado, mas sem unidade; usando dados demo.",
      };
    }

    const itemsByOrder = groupBy(orderItemRows, "order_id");
    const paymentsByOrder = groupBy(paymentRows, "order_id");
    const deliveryDetailRows = await selectOptionalRowsIn(
      client,
      "delivery_order_details",
      "order_id",
      orderRows.map((row) => stringValue(row, "id")),
    );
    const data: SaboreData = {
      organization: {
        id: stringValue(organizationRow, "id"),
        name: stringValue(organizationRow, "name"),
        logoUrl: organizationLogoUrl(organizationRow),
        planCode: planCodeValue(organizationRow),
        planPrice: numberValue(organizationRow, "plan_price", 59.9),
        enabledModules: stringArrayValue(organizationRow, "enabled_modules"),
      },
      unit: mapUnit(unit),
      users: userRows.map<UserProfile>((row) => ({
        id: stringValue(row, "id"),
        unitId: stringValue(row, "unit_id"),
        name: stringValue(row, "name"),
        role: stringValue(row, "role", "stock") as UserProfile["role"],
      })),
      tables: tableRows.map<DiningTable>((row) => ({
        id: stringValue(row, "id"),
        unitId: stringValue(row, "unit_id"),
        label: stringValue(row, "label"),
        seats: numberValue(row, "seats", 4),
        status: stringValue(row, "status", "free") as DiningTable["status"],
      })),
      customers: customerRows.map<Customer>((row) => ({
        id: stringValue(row, "id"),
        unitId: stringValue(row, "unit_id"),
        name: stringValue(row, "name"),
        phone: stringValue(row, "phone"),
        neighborhood: optionalString(row, "neighborhood"),
      })),
      ingredients: ingredientRows.map<Ingredient>((row) => ({
        id: stringValue(row, "id"),
        unitId: stringValue(row, "unit_id"),
        name: stringValue(row, "name"),
        measure: stringValue(row, "measure", "un") as Ingredient["measure"],
        averageCost: numberValue(row, "average_cost"),
        minimumStock: numberValue(row, "minimum_stock"),
      })),
      lots: lotRows.map<InventoryLot>((row) => ({
        id: stringValue(row, "id"),
        ingredientId: stringValue(row, "ingredient_id"),
        supplier: stringValue(row, "supplier"),
        batchCode: stringValue(row, "batch_code"),
        quantity: numberValue(row, "quantity"),
        expiresAt: stringValue(row, "expires_at"),
        receivedAt: stringValue(row, "received_at"),
      })),
      products: productRows.map<Product>((row) => ({
        id: stringValue(row, "id"),
        unitId: stringValue(row, "unit_id"),
        name: stringValue(row, "name"),
        category: stringValue(row, "category"),
        price: numberValue(row, "price"),
        active: booleanValue(row, "active", true),
        preparationArea: stringValue(
          row,
          "preparation_area",
          "kitchen",
        ) as Product["preparationArea"],
      })),
      recipe: recipeRows.map<RecipeItem>((row) => ({
        id: stringValue(row, "id"),
        productId: stringValue(row, "product_id"),
        ingredientId: stringValue(row, "ingredient_id"),
        quantity: numberValue(row, "quantity"),
      })),
      orders: orderRows.map((row) => mapOrder(row, itemsByOrder, paymentsByOrder)),
      deliveryDetails: deliveryDetailRows.map(mapDeliveryDetail),
      cashSession: cashRows[0]
        ? {
            id: stringValue(cashRows[0], "id"),
            unitId: stringValue(cashRows[0], "unit_id"),
            openedBy: stringValue(cashRows[0], "opened_by"),
            openedAt: stringValue(cashRows[0], "opened_at"),
            openingAmount: numberValue(cashRows[0], "opening_amount"),
            expectedAmount: numberValue(cashRows[0], "expected_amount"),
            status: stringValue(
              cashRows[0],
              "status",
              "open",
            ) as CashSession["status"],
          }
        : demoData.cashSession,
      movements: movementRows.map<InventoryMovement>((row) => ({
        id: stringValue(row, "id"),
        unitId: stringValue(row, "unit_id"),
        ingredientId: stringValue(row, "ingredient_id"),
        orderId: optionalString(row, "order_id"),
        type: stringValue(
          row,
          "type",
          "receipt",
        ) as InventoryMovement["type"],
        quantity: numberValue(row, "quantity"),
        costImpact: numberValue(row, "cost_impact"),
        reason: stringValue(row, "reason"),
        createdAt: stringValue(row, "created_at"),
      })),
      whatsappTemplates: templateRows.map<WhatsAppTemplate>((row) => ({
        id: stringValue(row, "id"),
        unitId: stringValue(row, "unit_id"),
        name: stringValue(row, "name"),
        category: stringValue(
          row,
          "category",
          "utility",
        ) as WhatsAppTemplate["category"],
        status: stringValue(
          row,
          "status",
          "draft",
        ) as WhatsAppTemplate["status"],
        monthlyPrice: numberValue(row, "monthly_price"),
      })),
    };

    return {
      data,
      source: "supabase",
      message: "Dados carregados do Supabase.",
    };
  } catch (error) {
    return {
      data: demoData,
      source: "demo",
      message:
        error instanceof Error
          ? `Supabase indisponivel (${error.message}); usando demo.`
          : "Supabase indisponivel; usando demo.",
    };
  }
}
