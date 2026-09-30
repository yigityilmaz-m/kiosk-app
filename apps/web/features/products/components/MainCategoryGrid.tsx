import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Category } from "@shared/types/database";

type Props = {
  categories: Category[];
  selectedMain: Category | null;
  onSelect: (cat: Category) => void;
};

export function MainCategoryGrid({
  categories,
  selectedMain,
  onSelect,
}: Props) {
  return (
    <nav className="w-19 shrink-0 overflow-y-auto bg-brand-bg py-2 md:w-56">
      <ul className="flex flex-col gap-1.5 px-1.5 md:px-2">
        {categories.map((cat) => {
          const isSelected = selectedMain?.id === cat.id;
          return (
            <li key={cat.id}>
              <button
                type="button"
                onClick={() => onSelect(cat)}
                className={cn(
                  "flex w-full flex-col items-center gap-1.5 rounded-2xl border-2 p-1.5 text-center transition-colors",
                  "md:flex-row md:gap-3 md:p-2 md:text-left",
                  isSelected
                    ? "border-brand bg-brand-subtle"
                    : "border-transparent md:hover:bg-white",
                )}
              >
                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl md:size-12">
                  <Image
                    src={
                      cat.image_url ??
                      `https://placehold.co/112x112/E8D5B7/C4A882.png?text=${encodeURIComponent(cat.name.charAt(0))}`
                    }
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <span
                  className={cn(
                    "min-w-0 wrap-break-word text-[10px] font-semibold uppercase leading-tight md:text-xs md:tracking-widest",
                    isSelected ? "text-brand" : "text-brand-text",
                  )}
                >
                  {cat.name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
