import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Technologies } from "@/components/sections/Technologies";
import { Experience } from "@/components/sections/Experience";
import { Work } from "@/components/sections/Work";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main id="main" className="flex-1">
      <Hero />
      <About />
      <Technologies />
      <Experience />
      <Work />
      <Contact />
    </main>
  );
}
