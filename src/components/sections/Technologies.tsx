import { Section } from "@/components/ui/Section";
import { TechAccordion } from "./TechAccordion";
import { TechMarquee } from "./TechMarquee";

export function Technologies() {
  return (
    <Section id="technologies" number="02" title="Technologies">
      <p className="mb-10 max-w-[38rem] text-body text-text-muted">
        The stack I ship with day to day — front end to database to deploy. Open a layer to see what&apos;s in it.
      </p>
      <TechAccordion />
      <TechMarquee />
    </Section>
  );
}
