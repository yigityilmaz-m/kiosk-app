import Image from "next/image";

// TODO: swap for a real asset later
const HEADER_IMAGE =
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1600&h=600&fit=crop";

export function AppHeader() {
  return (
    <header className="relative h-[30vh] shrink-0 overflow-hidden">
      <Image
        src={HEADER_IMAGE}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="absolute inset-x-0 bottom-0 px-8 pb-12">
        <h1 className="text-4xl font-black leading-tight tracking-tight text-white">
          DO YOU HAVE ANY
          <br />
          ORDER TODAY?
        </h1>
        <p className="mt-1 text-xs font-medium uppercase tracking-widest text-white/70">
          Freshly made for you today.
        </p>
      </div>
    </header>
  );
}
