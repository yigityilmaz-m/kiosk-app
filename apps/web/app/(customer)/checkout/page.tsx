"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MoveLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/useHydrated";
import { useBasketStore } from "@/features/basket/store";
import { useCreateOrder } from "@/features/orders/hooks/useCreateOrder";
import { checkoutSchema, type CheckoutFormData } from "@/features/auth/schema";
import { ContinueButton } from "@/components/ContinueButton";
import BasketItemCard from "@/features/basket/components/BasketItemCard";

export default function CheckoutPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const items = useBasketStore((s) => s.items);
  const total = useBasketStore((s) => s.total());

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { customerName: "", customerNote: "" },
  });

  const { mutate: createOrder, isPending, isSuccess } = useCreateOrder();

  // Nothing to check out (e.g. direct visit or refresh after ordering).
  // Skip while submitting/succeeded: clearBasket empties the basket
  // before we navigate to the confirmation page.
  useEffect(() => {
    if (hydrated && items.length === 0 && !isPending && !isSuccess) {
      router.replace("/");
    }
  }, [hydrated, items.length, isPending, isSuccess, router]);

  const onSubmit = (data: CheckoutFormData) => {
    createOrder(data, {
      onSuccess: () =>
        router.replace(
          `/confirmation?name=${encodeURIComponent(data.customerName)}`,
        ),
      onError: (error) => {
        console.error("Error creating order:", error);
        toast.error("Oops, something went wrong. Please try again!");
      },
    });
  };

  if (!hydrated) return <div className="min-h-dvh bg-brand-bg" />;

  const inputClass = (hasError: boolean) =>
    cn(
      "w-full rounded-xl border bg-white px-4 py-3 outline-none",
      hasError ? "border-red-400" : "border-brand-border focus:border-brand",
    );

  return (
    <main className="min-h-dvh bg-brand-bg">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-5 px-4"
      >
        {/* Header */}
        <header className="flex items-center justify-between pt-6">
          <Link href="/" aria-label="Back to menu" className="p-2">
            <MoveLeft size={20} strokeWidth={2} />
          </Link>
          <h1 className="textTitle text-brand-text">Checkout</h1>
          <span className="p-2 opacity-0" aria-hidden>
            <MoveLeft size={20} />
          </span>
        </header>

        {/* Order summary: internal scroll, hugs content when small */}
        <section className="relative max-h-[40dvh] overflow-hidden rounded-2xl bg-white p-4 flex flex-col">
          <h2 className="textLabel mb-3 text-brand-text">Order Summary</h2>
          <div className="flex flex-col gap-4 overflow-y-auto pb-4">
            {items.map((item) => (
              <BasketItemCard key={item.basketItemId} item={item} editable />
            ))}
          </div>
          <div className="-mx-4 -mb-4 flex items-center justify-between rounded-b-2xl bg-amber-50 px-4 py-3">
            <span className="textLabel text-brand-text">Total Order</span>
            <span className="textTitle text-amber-600">
              ${total.toFixed(2)}
            </span>
          </div>
        </section>

        {/* Details */}
        <section className="flex flex-col gap-4 rounded-2xl bg-white p-4">
          <h2 className="textLabel text-brand-text">Your Details</h2>

          <div className="flex flex-col gap-1">
            <label htmlFor="customerName" className="textBody text-brand-text">
              Name
            </label>
            <input
              id="customerName"
              autoComplete="off"
              placeholder="How should we call you?"
              className={inputClass(!!errors.customerName)}
              {...register("customerName")}
            />
            {errors.customerName && (
              <p className="mt-1 text-xs text-red-500">
                {errors.customerName.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="customerNote" className="textBody text-brand-text">
              Note <span className="text-brand-muted">(optional)</span>
            </label>
            <input
              id="customerNote"
              autoComplete="off"
              placeholder="Any special requests?"
              className={inputClass(!!errors.customerNote)}
              {...register("customerNote")}
            />
            {errors.customerNote && (
              <p className="mt-1 text-xs text-red-500">
                {errors.customerNote.message}
              </p>
            )}
          </div>
        </section>

        {/* CTA */}
        <div className="sticky bottom-0 mt-auto bg-brand-bg pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
          <ContinueButton
            type="submit"
            label="Place order"
            isLoading={isPending}
            isDisabled={isPending}
          />
        </div>
      </form>
    </main>
  );
}
