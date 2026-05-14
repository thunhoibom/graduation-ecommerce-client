import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroArrowButtonProps {
  href: string;
  variant?: "primary" | "outline";
  label: string;
  arrow?: boolean;
  className?: string;
}

export function HeroArrowButton({
  href,
  variant = "primary",
  label,
  arrow = false,
  className,
}: HeroArrowButtonProps) {
  if (variant === "primary") {
    return (
      <Button asChild size="lg" className={cn("gap-2", className)}>
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
      className={cn(
        "border-neutral-300 text-neutral-900 hover:border-neutral-900 dark:border-neutral-700 dark:text-neutral-100 dark:hover:border-neutral-100",
        className,
      )}
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
}
