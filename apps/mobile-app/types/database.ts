export type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
};

export type Order = {
  id: string;
  status: "pending" | "preparing" | "ready" | "completed";
  total: number;
  customer_name: string;
  created_at: string;
};

export type BasketItem = {
  product_id: string;
  product: Pick<Product, "name" | "price" | "image_url">;
  quantity: number;
};
