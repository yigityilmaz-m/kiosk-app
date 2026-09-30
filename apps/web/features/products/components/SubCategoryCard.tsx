import Image from "next/image";
import type { Category } from "@shared/types/database";

type Props = { category: Category };

export function SubCategoryCard({ category }: Props) {
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white shadow-card">
      {/* Category image */}
      {category.image_url ? (
        <div className="relative h-32 w-full">
          <Image
            src={category.image_url}
            alt=""
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
        <p className="textLabel line-clamp-2 text-center leading-tight text-brand-muted">
          {category.name}
        </p>
      </div>
    </div>
  );
}
