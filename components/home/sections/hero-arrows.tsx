import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroArrowButtonProps {
  href: string;
  variant?: "primary" | "outline";
  label: string;
  arrow?: boolean;
}

export function HeroArrowButton({
  href,
  variant = "primary",
  label,
  arrow = false,
}: HeroArrowButtonProps) {
  if (variant === "primary") {
    return (
      <Button asChild size="lg" className="gap-2">
        <Link href={href}>
          {label}
          {arrow && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      asChild
      variant="outline"
      size="lg"
      className="border-neutral-300 text-neutral-900 hover:border-neutral-900 dark:border-neutral-700 dark:text-neutral-100 dark:hover:border-neutral-100"
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
}
