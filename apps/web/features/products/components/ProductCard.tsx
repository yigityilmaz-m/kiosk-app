import Image from "next/image";
import type { Product } from "@shared/types/database";

type Props = {
  product: Product;
  onPress: () => void;
};

export function ProductCard({ product, onPress }: Props) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="w-full overflow-hidden rounded-2xl bg-white text-left shadow-card"
    >
      {/* Product image */}
      {product.image_url ? (
        <div className="relative h-32 w-full">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 20vw, 33vw"
            className="object-contain"
          />
        </div>
      ) : (
        <div className="flex h-32 w-full items-center justify-center bg-gray-100">
          <span className="text-3xl">☕</span>
        </div>
      )}

      {/* Info */}
      <div className="flex flex-col gap-2 p-3">
        <p className="textBody line-clamp-2 leading-tight">{product.name}</p>
        <p className="textBody leading-tight text-brand">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </button>
  );
}
