"use client";

import { Loader2, MoveLeft } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { useProducts } from "../hooks/useProducts";
import type { Category } from "@shared/types/database";
import { useRouter } from "next/navigation";

type Props = {
  selectedSub: Category;
  onBack: () => void;
};

const ProductGrid = ({ selectedSub, onBack }: Props) => {
  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useProducts(selectedSub.id);

  const router = useRouter();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between px-3 py-2.5">
        <button type="button" onClick={onBack} className="p-2">
          <MoveLeft size={20} strokeWidth={2} className="text-brand-text" />
        </button>
        <h2 className="textTitle flex-1 text-center text-brand-text">
          {selectedSub.name}
        </h2>
        {/* Invisible spacer for optical centering */}
        <div className="p-2 opacity-0" aria-hidden>
          <MoveLeft size={20} strokeWidth={2} />
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-brand" />
        </div>
      )}

      {!isLoading && isError && (
        <div className="flex flex-1 flex-col items-center justify-center px-8">
          <p className="text-center text-sm text-gray-400">
            Could not load products. Please try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-2xl bg-gray-900 px-6 py-3 text-sm font-bold text-white"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="min-h-0 flex-1 overflow-y-auto">
          {products?.length === 0 ? (
            <p className="pt-16 text-center text-sm text-gray-400">
              No items here yet.
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 p-3 pb-24 md:grid-cols-3 xl:grid-cols-4">
              {products?.map((item) => (
                <li key={item.id}>
                  {/* TODO: open product detail modal*/}
                  <ProductCard
                    product={item}
                    onPress={() => router.push(`/product/${item.id}`)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
