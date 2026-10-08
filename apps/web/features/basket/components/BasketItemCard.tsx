"use client";

import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useBasketStore } from "@/features/basket/store";
import type { BasketItem } from "@/features/basket/store";

type Props = {
  item: BasketItem;
  editable?: boolean;
};

export default function BasketItemCard({ item, editable = true }: Props) {
  const incrementItem = useBasketStore((s) => s.incrementItem);
  const decrementItem = useBasketStore((s) => s.decrementItem);

  const lineTotal = (item.resolvedPrice * item.quantity).toFixed(2);

  return (
    <div className="flex items-center border-b border-gray-100 py-3.5">
      {/* Image */}
      <div className="relative mr-4 size-14 shrink-0 overflow-hidden rounded-full bg-brand-subtle">
        {item.product.image_url ? (
          <Image
            src={item.product.image_url}
            alt={item.product.name}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-amber-100 text-xl">
            ☕
          </div>
        )}
      </div>

      {/* Name + size */}
      <div className="mr-3 min-w-0 flex-1">
        <p className="textLabel wrap-break-word text-brand-text">
          {item.product.name}
        </p>
        {(item.selectedSize || !editable) && (
          <p className="mt-0.5 text-xs text-gray-400">
            {item.selectedSize}
            {item.selectedSize && !editable && " · "}
            {!editable && `Qty ${item.quantity}`}
          </p>
        )}
      </div>

      {/* Qty controls */}
      {editable && (
        <div className="mr-3 flex w-22 shrink-0 items-center justify-between">
          <button
            type="button"
            onClick={() => decrementItem(item.basketItemId)}
            aria-label={
              item.quantity === 1 ? "Remove item" : "Decrease quantity"
            }
            className="flex size-8 items-center justify-center rounded-lg border-2 border-brand-border text-gray-400 md:hover:border-gray-400"
          >
            {item.quantity === 1 ? (
              <X size={14} strokeWidth={2.5} />
            ) : (
              <Minus size={14} strokeWidth={2.5} />
            )}
          </button>
          <span className="textBody w-6 text-center">{item.quantity}</span>
          <button
            type="button"
            onClick={() => incrementItem(item.basketItemId)}
            aria-label="Increase quantity"
            className="flex size-8 items-center justify-center rounded-lg bg-gray-900 text-white md:hover:bg-gray-700"
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* Price */}
      <p className="textBody w-16 shrink-0 text-right">${lineTotal}</p>
    </div>
  );
}
