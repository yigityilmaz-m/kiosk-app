export type OrderStatus = "pending" | "preparing" | "ready" | "completed";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string | null;
  description: string | null;
  available: boolean;
  created_at: string;
};

export type Order = {
  id: string;
  status: OrderStatus;
  total: number;
  customer_name: string;
  customer_note: string | null;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_order_time: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  sort_order: number;
};

export type OrderWithItems = Order & {
  order_items: OrderItem[];
};
