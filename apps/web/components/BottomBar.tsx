"use client";

import { useState } from "react";
import Link from "next/link";
import { ReceiptText, ShoppingBasket } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBasketStore } from "@/features/basket/store";
import { useHydrated } from "@/lib/useHydrated";
import { BasketSheet } from "@/features/basket/components/BasketSheet";

export function BottomBar() {
  const [open, setOpen] = useState(false);
  const hydrated = useHydrated();
  const storedCount = useBasketStore((s) => s.itemCount());
  const storedTotal = useBasketStore((s) => s.total());

  // Persisted data isn't on the server, so show an empty basket until mounted
  const itemCount = hydrated ? storedCount : 0;
  const total = hydrated ? storedTotal : 0;
  const isEmpty = itemCount === 0;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)] md:bottom-4">
        <div className="mx-auto flex h-20 w-full max-w-3xl md:gap-4">
          {/* Cart */}
          <div className="flex flex-1 border bg-white border-brand-border text-brand-text md:hover:bg-gray-200 md:rounded-2xl">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex flex-1 items-center justify-center gap-2 text-brand-text md:hover:bg-gray-200 md:rounded-2xl"
            >
              <ShoppingBasket />
              <span className="textLabel">CART</span>
              {!isEmpty && (
                <span className="textDetail rounded-full bg-brand-text px-2 text-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Checkout */}
          <div className="flex flex-1 border bg-white border-brand-border text-brand-text md:hover:bg-gray-200 md:rounded-2xl">
            <Link
              href="/checkout"
              aria-disabled={isEmpty}
              tabIndex={isEmpty ? -1 : undefined}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 bg-brand-continue text-white  md:rounded-2xl",
                isEmpty && "pointer-events-none opacity-50",
              )}
            >
              <ReceiptText />
              <span className="textLabel">CHECKOUT</span>
              {!isEmpty && (
                <span className="textDetail">${total.toFixed(2)}</span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <BasketSheet open={open} onOpenChange={setOpen} />
    </>
  );
}
