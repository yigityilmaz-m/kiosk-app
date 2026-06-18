import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useBasketStore } from "@/features/basket/store";
import type { BasketItem } from "@/features/basket/store";

type CreateOrderInput = {
  customerName: string;
  customerNote: string;
};

async function createOrder(
  input: CreateOrderInput,
  items: BasketItem[],
): Promise<void> {
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  // Insert order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      status: "pending",
      total,
      customer_name: input.customerName.trim(),
      customer_note: input.customerNote.trim() || null,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // Insert order items
  const orderItems = items.map((i) => ({
    order_id: order.id,
    product_id: i.product.id,
    quantity: i.quantity,
    price_at_order_time: i.product.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    throw itemsError;
  }
}

export function useCreateOrder() {
  const { items, clearBasket } = useBasketStore();

  return useMutation({
    mutationFn: (input: CreateOrderInput) => createOrder(input, items),
    onSuccess: () => clearBasket(),
  });
}
