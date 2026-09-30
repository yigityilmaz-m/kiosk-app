import { SubCategoryCard } from "./SubCategoryCard";
import type { Category } from "@shared/types/database";

type Props = {
  subCategories: Category[];
  onSelect: (cat: Category) => void;
};

export function SubCategoryGrid({ subCategories, onSelect }: Props) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      {subCategories.length === 0 ? (
        <p className="pt-16 text-center text-sm text-gray-400">
          No items here yet.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 p-3 pb-24 md:grid-cols-3 xl:grid-cols-4">
          {subCategories.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item)}
                className="block w-full text-left"
              >
                <SubCategoryCard category={item} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
