import { OrderStatus } from "@/types/database";

export const STATUS_COLOR: Record<OrderStatus, string> = {
  pending: "bg-blue-100 text-blue-700 rounded-xl",
  preparing: "bg-yellow-100 text-yellow-700 rounded-xl",
  completed: "bg-green-100 text-green-700 rounded-xl",
  cancelled: "bg-red-100 text-red-700 rounded-xl",
};
