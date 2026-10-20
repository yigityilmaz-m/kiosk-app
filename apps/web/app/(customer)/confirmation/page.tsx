"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

function ConfirmationContent() {
  const name = useSearchParams().get("name");

  useEffect(() => {
    const colors = ["#F59E0B", "#FF8C00", "#FCD34D", "#FFFFFF"];
    confetti({
      particleCount: 60,
      spread: 70,
      angle: 60,
      origin: { x: 0, y: 0.7 },
      colors,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 60,
      spread: 70,
      angle: 120,
      origin: { x: 1, y: 0.7 },
      colors,
      disableForReducedMotion: true,
    });

    return () => {
      confetti.reset();
    };
  }, []);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-brand-bg px-8">
      <div className="flex size-32 items-center justify-center rounded-full bg-brand-subtle">
        <CheckCircle2 size={48} color="#FF8C00" />
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="textTitle text-brand-text">Order Placed!</h1>
        <p className="textDetail text-brand-muted">
          Your order has been received and is being prepared.
        </p>
      </div>

      {name && (
        <div className="flex flex-col items-center gap-1 rounded-2xl bg-white px-8 py-4 shadow-card">
          <span className="textLabel uppercase tracking-widest text-brand-text">
            Order Name
          </span>
          <span className="textHeader tracking-widest">{name}</span>
        </div>
      )}

      <p className="textDetail text-center text-brand-muted">
        We&apos;ll call your name when it&apos;s ready.
      </p>

      <Link
        href="/"
        replace
        className="mt-4 rounded-2xl bg-brand-continue px-10 py-4 font-bold text-white"
      >
        Back to Menu
      </Link>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmationContent />
    </Suspense>
  );
}
