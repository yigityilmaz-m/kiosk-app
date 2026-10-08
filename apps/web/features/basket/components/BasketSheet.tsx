"use client";

import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useBasketStore } from "@/features/basket/store";
import BasketItemCard from "@/features/basket/components/BasketItemCard";
import { ContinueButton } from "@/components/ContinueButton";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Only mounts its content while open, which only happens after a click,
// so it never renders persisted data during hydration (no guard needed here).
export function BasketSheet({ open, onOpenChange }: Props) {
  const router = useRouter();
  const items = useBasketStore((s) => s.items);
  const total = useBasketStore((s) => s.total());

  const handleCheckout = () => {
    onOpenChange(false);
    router.push("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="flex w-full flex-col gap-0 p-0 min-h-[20dvh] max-h-[80dvh] rounded-t-3xl mx-auto md:max-w-2xl"
      >
        <SheetHeader className="border-b border-gray-100 px-5 py-4">
          <SheetTitle className="textTitle text-center">Cart</SheetTitle>
          <SheetDescription className="sr-only">
            Review the items in your basket
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-gray-400">Your basket is empty</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              {items.map((item) => (
                <BasketItemCard key={item.basketItemId} item={item} />
              ))}
            </div>

            <div className="mx-5 mb-4 mt-2 flex items-center justify-between rounded-2xl bg-brand-bg px-4 py-3.5">
              <span className="textLabel text-brand-text">Total Order</span>
              <span className="textTitle">${total.toFixed(2)}</span>
            </div>

            <div className="px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <ContinueButton
                label="Continue to payment"
                onClick={handleCheckout}
              />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
