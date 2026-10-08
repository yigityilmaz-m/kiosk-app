import { Loader2, MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
  iconRight?: boolean;
};

// Margins are left to the parent (web layouts vary), unlike the mobile version.
export function ContinueButton({
  label,
  onClick,
  type = "button",
  isLoading = false,
  isDisabled = false,
  className,
  iconRight = true,
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled || isLoading}
      className={cn(
        "flex w-full items-center justify-center gap-x-2 rounded-2xl bg-brand-continue py-4 text-white transition md:enabled:hover:brightness-90 disabled:opacity-60",
        className,
      )}
    >
      {isLoading ? (
        <Loader2 className="size-5 animate-spin" />
      ) : (
        <>
          <span className="textLabel">{label}</span>
          {iconRight && <MoveRight size={20} strokeWidth={2} />}
        </>
      )}
    </button>
  );
}
