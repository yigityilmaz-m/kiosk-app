"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Loader2, MoveLeft } from "lucide-react";
import { useProduct } from "@/features/products/hooks/useProduct";
import { cn } from "@/lib/utils";
import { useCategories } from "@/features/products/hooks/useCategories";
import Link from "next/link";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: product, isLoading, isError, refetch } = useProduct(id);
  const [selectedSize, setSelectedSize] = useState<"Small" | "Large" | null>(
    null,
  );

  const { data: categories } = useCategories();

  const menuHref = useMemo(() => {
    const sub = categories?.find((c) => c.id === product?.category_id);
    const main = categories?.find((c) => c.id === sub?.parent_id);
    return sub && main ? `/?main=${main.slug}&sub=${sub.slug}` : "/";
  }, [categories, product]);

  const goBack = () => {
    router.replace(menuHref);
  };

  const hasVariants = product?.large_price != null;
  const resolvedPrice = hasVariants
    ? selectedSize === "Large"
      ? product!.large_price!
      : selectedSize === "Small"
        ? product!.price
        : null
    : (product?.price ?? null);

  const canAdd = !!product && (!hasVariants || selectedSize !== null);

  const handleAdd = () => {
    if (!canAdd || !product) return;
    // TODO (Phase 3): addItem(product, hasVariants ? selectedSize : null)
    goBack();
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-brand-bg">
        <Loader2 className="size-8 animate-spin text-brand" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-brand-bg">
        <p className="textBody text-gray-400">
          Couldn&apos;t load this product.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 textBody text-brand"
        >
          Retry
        </button>
        <button
          type="button"
          onClick={goBack}
          className="mt-4 textBody text-brand"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-brand-bg">
      <div className="flex flex-1 min-h-dvh max-w-5xl flex-col p-4 md:p-8 ">
        {/* Back link */}
        <Link
          href={menuHref}
          className="flex w-fit items-center gap-2 p-3 textLabel text-brand-text md:hover:text-brand"
        >
          <MoveLeft size={18} strokeWidth={2} />
          Back to menu
        </Link>

        <main className="grid flex-1 content-center items-center gap-6 md:grid-cols-2 md:items-center md:gap-14">
          {/* Image panel */}
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-full bg-brand-subtle shadow-card md:rounded-4xl md:aspect-square  ">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                priority
                className={cn(
                  "object-cover transition-transform duration-500 ease-out scale-80",
                  selectedSize === "Large" && "scale-100",
                )}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-7xl">☕</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-1 flex-col">
            <div className="mb-3 flex items-start justify-between gap-4 md:flex-col md:gap-2 ">
              <h1 className="flex-1 text-2xl font-bold leading-tight text-brand-text md:text-4xl">
                {product.name}
              </h1>
              <p className="text-xl font-bold text-brand md:text-3xl">
                {resolvedPrice != null
                  ? `$${resolvedPrice.toFixed(2)}`
                  : `From $${product.price.toFixed(2)}`}
              </p>
            </div>

            {product.description && (
              <p className="mb-6 textDetail text-brand-muted ">
                {product.description}
              </p>
            )}

            {hasVariants && (
              <div className="mb-6">
                <p className="textLabel mb-3 text-brand-muted">Choose Size</p>
                <div className="flex gap-x-3">
                  {(["Small", "Large"] as const).map((size) => {
                    const sizePrice =
                      size === "Small" ? product.price : product.large_price!;
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "flex flex-1 flex-col items-center rounded-2xl border-2 py-4 transition-colors border-brand-border bg-white md:hover:border-brand",
                          isSelected && "border-brand bg-brand-subtle",
                        )}
                      >
                        <span
                          className={cn(
                            "textBody",
                            isSelected ? "text-brand" : "text-brand-muted",
                          )}
                        >
                          {size}
                        </span>
                        <span
                          className={cn(
                            "textDetail",
                            isSelected ? "text-brand" : "text-brand-muted",
                          )}
                        >
                          ${sizePrice.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="sticky bottom-2 md:static">
              <button
                type="button"
                onClick={handleAdd}
                disabled={!canAdd}
                className={cn(
                  "textTitle w-full rounded-2xl py-4 transition-colors duration-500 ease-in border-2 border-brand-border bg-brand-bg text-brand-muted",
                  canAdd &&
                    "bg-brand-continue text-white md:hover:brightness-90",
                )}
              >
                {hasVariants && !selectedSize
                  ? "Select a Size"
                  : "Add to Basket"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductPage;
