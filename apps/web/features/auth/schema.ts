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

export const loginSchema = z.object({
  email: z.email("Enter a valid email").trim().min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be 6–12 characters")
    .max(12, "Password must be 6–12 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
