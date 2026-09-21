import { Reveal } from "./Reveal";
import { cn } from "@/lib/cn";

type Props = React.PropsWithChildren<{
  id: string;
  /** "01" */
  number: string;
  title: string;
  className?: string;
  /** Max content width in rem — the reference narrows About to ~900px. */
  narrow?: boolean;
}>;

/** Numbered section heading with the trailing rule, as in the reference. */
export function Section({ id, number, title, className, narrow, children }: Props) {
  const titleId = `${id}-title`;
  return (
    <Reveal as="section" className={cn("mx-auto w-full px-6 py-24 md:px-12 lg:px-0 lg:py-32", narrow ? "max-w-[56.25rem]" : "max-w-content", className)}>
      <div id={id} aria-labelledby={titleId} className="scroll-mt-24">
        <h2 id={titleId} className="mb-10 flex items-center gap-3 font-display text-display font-bold text-text after:ml-2 after:h-px after:w-full after:max-w-[300px] after:shrink after:bg-border-strong after:content-[''] md:whitespace-nowrap">
          <span className="font-mono text-[0.7em] font-medium text-accent">{number}.</span>
          {title}
        </h2>
        {children}
      </div>
    </Reveal>
  );
}
