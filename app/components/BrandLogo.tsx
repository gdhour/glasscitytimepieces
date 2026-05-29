import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg" | "hero";
  linked?: boolean;
};

const sizes = {
  sm: { width: 180, height: 180, className: "h-14 w-auto max-h-14 sm:h-16 sm:max-h-16" },
  md: { width: 200, height: 200, className: "h-16 w-auto" },
  lg: { width: 320, height: 320, className: "h-48 w-auto sm:h-56" },
  hero: {
    width: 560,
    height: 560,
    className:
      "h-[min(70vw,18rem)] w-auto sm:h-[min(50vw,20rem)] md:h-80 lg:h-[min(42vw,26rem)] lg:max-h-[32rem]",
  },
} as const;

export default function BrandLogo({
  className = "",
  size = "md",
  linked = true,
}: BrandLogoProps) {
  const { width, height, className: sizeClass } = sizes[size];

  const image = (
    <Image
      src="/logo.png"
      alt="Glass City Timepieces"
      width={width}
      height={height}
      className={`${sizeClass} object-contain ${className}`}
      priority={size === "hero" || size === "lg"}
    />
  );

  if (!linked) return image;

  return (
    <Link href="/" className="inline-block shrink-0 transition-opacity hover:opacity-90">
      {image}
    </Link>
  );
}
