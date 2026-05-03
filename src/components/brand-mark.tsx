import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-9 items-center justify-center rounded-md border border-primary/20 bg-primary text-primary-foreground shadow-sm",
        className,
      )}
    >
      <svg
        viewBox="0 0 36 36"
        className="size-7"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 22.5h18"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.4"
        />
        <path
          d="M11.25 22.5c.35-6.05 3.95-9.25 6.75-9.25s6.4 3.2 6.75 9.25"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.4"
        />
        <path
          d="M18 10.25V8"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.4"
        />
        <path
          d="M12 27h12"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.4"
        />
        <path
          d="M14.25 16.75c1.55-1.55 3.25-2.3 5.1-2.05"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
          opacity="0.55"
        />
      </svg>
    </span>
  );
}
