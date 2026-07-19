import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(1, "Please enter your name")
    .max(15, "Name is too long"),
  customerNote: z.string().trim().max(14, "Note is too long").or(z.literal("")),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
