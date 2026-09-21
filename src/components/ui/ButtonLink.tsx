import { cn } from "@/lib/cn";

type Size = "sm" | "lg";
type Props = React.ComponentPropsWithoutRef<"a"> & { size?: Size };

/** The reference's outlined teal mono button. */
export function ButtonLink({ size = "lg", className, children, ...rest }: Props) {
  return (
    <a
      className={cn(
        "inline-flex items-center justify-center rounded-sm border-2 border-accent font-mono font-bold text-accent no-underline",
        "transition-[background-color,transform] duration-250 ease-out hover:bg-accent-subtle hover:-translate-y-0.5 active:translate-y-0",
        size === "lg" ? "min-h-12 px-7 py-4 text-sm" : "min-h-11 px-4 py-3 text-mono",
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}
