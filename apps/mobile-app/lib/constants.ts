import { OrderStatus } from "@/types/database";

export const STATUS_COLOR: Record<OrderStatus, string> = {
  pending: "bg-blue-100 text-blue-700 rounded-xl",
  preparing: "bg-yellow-100 text-yellow-700 rounded-xl",
  completed: "bg-green-100 text-green-700 rounded-xl",
  cancelled: "bg-red-100 text-red-700 rounded-xl",
};

export const BRAND_COLOR = {
  DEFAULT: "#FF8C00", // amber-600, your primary CTA/accent color
  light: "#F59E0B", // amber-500, selected states
  subtle: "#FEF3C7", // amber-50, selected backgrounds
  continue: "#B92020",
  text: "#374151", // gray-700, icon/body text
  muted: "#9CA3AF", // gray-400, secondary text
  border: "#E5E7EB", // gray-200, borders
  bg: "#F9FAFB", // gray-50, subtle backgrounds
};
