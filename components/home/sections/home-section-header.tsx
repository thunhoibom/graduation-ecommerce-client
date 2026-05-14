import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HomeSectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function HomeSectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: HomeSectionHeaderProps) {
  return (
    <div className={cn("mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl">
        <p className="section-subtitle">{eyebrow}</p>
        <h2 className="section-title mt-2">{title}</h2>
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-[0.95rem]">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div> : null}
    </div>
  );
}
