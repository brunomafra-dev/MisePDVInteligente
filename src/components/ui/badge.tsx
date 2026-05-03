import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/15 text-primary",
        neutral: "border-border bg-muted text-muted-foreground",
        success: "border-emerald-600/20 bg-emerald-500/10 text-emerald-700",
        warning: "border-amber-600/25 bg-amber-500/15 text-amber-800",
        danger: "border-red-600/20 bg-red-500/10 text-red-700",
        info: "border-sky-600/20 bg-sky-500/10 text-sky-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}
