export type OrderStatus = "pending" | "preparing" | "completed" | "cancelled";

export type Product = {
  id: string;
  name: string;
  price: number;
  large_price: number | null;
  image_url: string | null;
  description: string | null;
  available: boolean;
  created_at: string;
  category_id: string;
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
  image_url: string | null;
};

export type OrderWithItems = Order & {
  order_items: OrderItem[];
};
