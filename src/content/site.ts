/**
 * Single source of content for the site. Real copy only — no placeholders.
 * Anything not yet known is left out rather than invented.
 */

export const person = {
  name: "Muhammad Fahad",
  role: "Full-Stack Developer",
  stackLine: "React, Next.js, Node.js",
  location: "Faisalabad, Pakistan",
  email: "mdfahadzulfiqar@gmail.com",
  phone: "+92 342 0072298",
  phoneHref: "tel:+923420072298",
  linkedin: { label: "linkedin.com/in/mr-fahad", href: "https://linkedin.com/in/mr-fahad" },
  availability:
    "Available for remote roles worldwide. Open to relocation to the UK, US or EU with visa sponsorship.",
} as const;

export const hero = {
  greeting: "Hi, my name is",
  name: "Muhammad Fahad.",
  tagline: "I create modern web applications.",
  /** Rotates under the name with a typing effect; the first is also the static fallback. */
  taglines: [
    "I create modern web applications.",
    "I develop scalable digital solutions.",
    "I turn ideas into working websites.",
    "I build fast and responsive platforms.",
    "I develop complete web solutions.",
    "I craft clean and functional interfaces.",
    "I transform concepts into digital products.",
    "I engineer reliable web experiences.",
    "I bring web projects from idea to launch.",
  ],
  /** Phrases in `lede` that render in the accent colour — highlighted, not linked. */
  lede:
    "I'm a full-stack developer with six years shipping production web applications in React, Next.js and Node.js. Currently a Senior Web Developer at Tech Solutionor and a part-time Full Stack Engineer at Best Super Cleaning.",
  ledeHighlights: ["Tech Solutionor", "Best Super Cleaning"],
  cta: { label: "Check out my work!", href: "#work" },
} as const;

export const resume = { label: "Resume", href: "/resume.pdf" } as const;

export const socials = [
  { label: "GitHub", href: "https://github.com/mr-fahad-03", icon: "github" },
  { label: "Instagram", href: "https://www.instagram.com/mr_fahad_03/", icon: "instagram" },
  { label: "LinkedIn", href: "https://linkedin.com/in/mr-fahad", icon: "linkedin" },
  { label: "Email", href: "mailto:mdfahadzulfiqar@gmail.com", icon: "mail" },
  { label: "Phone", href: "tel:+923420072298", icon: "phone" },
] as const;

/** Header wordmark, rendered as a code tag in the Resume-button style. */
export const logo = { open: "<", name: "Mr.Fahad", close: " />" } as const;

export type Project = {
  name: string;
  domain: string;
  href: string;
  what: string;
  /** Lower-case noun phrase; rendered as "Built the …" after `what`. */
  built: string;
  /** Screenshot of the live site under public/projects (captured 2026-09-21). */
  image: string;
  /** Descriptive facets from the résumé — what the product is, not a tech claim. */
  tags: readonly string[];
  /** Not on the source résumé — add when known, do not guess. */
  stack?: readonly string[];
};

export const projects: readonly Project[] = [
  {
    name: "Grabatoz",
    domain: "grabatoz.ae",
    href: "https://grabatoz.ae",
    what: "Multi-region e-commerce marketplace trading across five countries — a general-merchandise storefront spanning electronics, home and lifestyle ranges.",
    built:
      "catalogue, search and filtering, cart and checkout, with per-market pricing and currency handling.",
    image: "/projects/grabatoz.jpg",
    tags: ["E-commerce", "5 markets", "Multi-currency", "Checkout"],
  },
  {
    name: "Seen Alif",
    domain: "seenalif.com",
    href: "https://seenalif.com",
    what: "B2B technology storefront for the UAE market, covering POS systems, printers and scanners, security hardware, computing and software.",
    built:
      "category catalogue, product search, wishlist and customer account flows, served across English and Arabic locales.",
    image: "/projects/seenalif.jpg",
    tags: ["B2B storefront", "English / Arabic", "Wishlist", "Accounts"],
  },
  {
    name: "Ask Your Mufti",
    domain: "askyourmufti.com",
    href: "https://askyourmufti.com",
    what: "Multilingual religious knowledge platform where users submit questions and receive scholar-reviewed answers.",
    built:
      "localisation layer serving content across several languages, alongside the moderated submission, review and publishing workflow.",
    image: "/projects/askyourmufti.jpg",
    tags: ["Multilingual", "Moderation workflow", "Publishing", "Q&A platform"],
  },
  {
    name: "AUS Visa Experts",
    domain: "ausvisaexperts.com.au",
    href: "https://ausvisaexperts.com.au",
    what: "Client-facing platform for an Australian immigration consultancy.",
    built:
      "service and eligibility pages together with the enquiry and lead-capture flow feeding the firm's consultation pipeline.",
    image: "/projects/ausvisaexperts.jpg",
    tags: ["Consultancy", "Lead capture", "Eligibility", "Enquiry flow"],
  },
];

export type Role = {
  start: string;
  end: string;
  title: string;
  kind?: "Part-time" | "Freelance" | "Contract";
  company: string;
  location: string;
  points: readonly string[];
  /** Only where the résumé names the stack for that role. */
  stack?: readonly string[];
  /** Real favicon under public/logos, fetched from the company's site. Falls back to initials. */
  logo?: string;
  /** "mono": recolour the mark to white in dark theme and black in light (for single-colour logos). */
  logoTone?: "mono";
  /** Shrink a mark that fills its tile edge-to-edge (1 = fill). */
  logoScale?: number;
  /** Circular crop — used for a person rather than a company mark. */
  logoRound?: boolean;
  /** For companies without a logo: the letters to show and their colour (e.g. a brand gold). */
  mark?: { text: string; color: string };
};

export const experience: readonly Role[] = [
  {
    start: "Jun 2025",
    end: "Present",
    title: "Senior Web Developer",
    company: "Tech Solutionor",
    logo: "/logos/techsolutionor.png",
    logoScale: 0.7,
    location: "Faisalabad, Pakistan",
    points: [
      "Lead design and development of client web applications, from architecture through delivery.",
      "Review code and mentor junior developers across the team's projects.",
      "Own the full delivery cycle: requirements, implementation, testing and deployment.",
    ],
  },
  {
    start: "Jul 2026",
    end: "Present",
    title: "Full Stack Engineer",
    kind: "Part-time",
    company: "Best Super Cleaning",
    logo: "/logos/bestsupercleaning.png",
    logoTone: "mono",
    location: "Remote (North America)",
    points: [
      "Build and maintain the company's customer-facing web platform across the front end, API layer and database.",
      "Own features end to end, from specification through code review and deployment.",
      "Work asynchronously with a US-based team across a nine-hour time difference.",
    ],
  },
  {
    start: "Jan 2024",
    end: "Present",
    title: "Independent Full-Stack Developer",
    kind: "Freelance",
    company: "Self-employed",
    logo: "/logos/upwork.svg",
    logoScale: 0.62,
    location: "Remote, international clients",
    points: [
      "Scope, build and ship web applications for international clients across e-commerce, consulting and content platforms.",
      "Hold Top Rated status on Upwork, sustained through client ratings and on-time delivery.",
    ],
  },
  {
    start: "Dec 2025",
    end: "Feb 2026",
    title: "Full Stack Web & App Developer",
    kind: "Contract",
    company: "Muhammad Labs LTD",
    logo: "/logos/muhammadlabs.png",
    location: "Remote",
    points: [
      "Contributed to end-to-end development of web and mobile applications, covering both client interfaces and back-end services.",
    ],
  },
  {
    start: "Oct 2021",
    end: "Dec 2023",
    title: "Full Stack Developer",
    company: "FA Tech & Solutions",
    mark: { text: "FA", color: "#D4AF37" },
    location: "Faisalabad, Pakistan",
    points: [
      "Built and shipped client web applications using React, Node.js and relational databases.",
      "Worked the full delivery cycle: requirements, implementation, testing and deployment.",
    ],
    stack: ["React", "Node.js", "SQL"],
  },
  {
    start: "Aug 2020",
    end: "Sep 2021",
    title: "Backend Engineer",
    company: "Gamica Cloud",
    logo: "/logos/gamicacloud.png",
    location: "Faisalabad, Pakistan",
    points: [
      "Developed REST APIs and server-side services in Node.js and Express.",
      "Designed database schemas and wrote queries against MySQL and MongoDB.",
    ],
    stack: ["Node.js", "Express", "MySQL", "MongoDB"],
  },
];

export const about = {
  /** 1200px JPEG derived from public/pic.png (the 7 MB original); next/image serves it resized. */
  photo: "/pic.jpg" as string | undefined,
  paragraphs: [
    "Hello! I'm Fahad, a full-stack developer from Faisalabad, Pakistan. I started in 2020 building REST APIs in Node.js at a cloud startup — and quickly found that what I enjoy most is owning a product from the database schema to the pixels.",
    "Six years on, I've shipped production web applications across the JavaScript ecosystem: React and Next.js on the front end; Node.js, Express and NestJS behind it; PostgreSQL and MongoDB underneath. That includes a multi-region e-commerce marketplace, a bilingual B2B storefront and a multilingual knowledge platform.",
    "Today I'm a Senior Web Developer at Tech Solutionor, a part-time Full Stack Engineer at Best Super Cleaning working async with a US team, and a Top Rated freelancer on Upwork. I'm open to remote roles worldwide and relocation to the UK, US or EU with sponsorship.",
  ],
  stack: [
    { group: "Front end", items: "React, Next.js, TypeScript, JavaScript (ES6+), Redux, Tailwind CSS, HTML5, CSS3" },
    { group: "Back end", items: "Node.js, Express, NestJS, REST API design, authentication and authorisation" },
    { group: "Data", items: "PostgreSQL, MySQL, MongoDB, Mongoose, Prisma" },
    { group: "Infrastructure", items: "Docker, AWS, Vercel, Git, GitHub Actions, CI/CD" },
    { group: "Ways of working", items: "Agile delivery, code review, async remote collaboration, client communication" },
  ],
  education: {
    degree: "BS Computer Science",
    school: "Government College University, Faisalabad",
    years: "2023 — 2027 (expected)",
    note: "Studying at weekends alongside full-time software work.",
  },
  languages: [
    { name: "English", level: "Professional working proficiency" },
    { name: "Urdu", level: "Native" },
    { name: "Punjabi", level: "Native" },
  ],
} as const;

export const nav = [
  { label: "About", href: "#about" },
  { label: "Technologies", href: "#technologies" },
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
] as const;


export type TechGroup = "Front end" | "Back end" | "Data" | "Infrastructure";

export type Tech = {
  name: string;
  group: TechGroup;
  /** Key into the icon map in components/sections/TechIcon.tsx. */
  icon: string;
  /** One short line shown under the name. */
  role: string;
};

export const techGroups: readonly TechGroup[] = ["Front end", "Back end", "Data", "Infrastructure"];

/** From the résumé's "Technical skills". Order within a group = display order. */
export const technologies: readonly Tech[] = [
  { name: "React", group: "Front end", icon: "react", role: "Component UIs" },
  { name: "Next.js", group: "Front end", icon: "nextjs", role: "App Router, SSR" },
  { name: "TypeScript", group: "Front end", icon: "typescript", role: "Typed everything" },
  { name: "JavaScript", group: "Front end", icon: "javascript", role: "ES6+" },
  { name: "Redux", group: "Front end", icon: "redux", role: "State management" },
  { name: "Tailwind CSS", group: "Front end", icon: "tailwind", role: "Utility styling" },
  { name: "HTML5", group: "Front end", icon: "html", role: "Semantic markup" },
  { name: "CSS3", group: "Front end", icon: "css", role: "Layout & motion" },
  { name: "Flutter", group: "Front end", icon: "flutter", role: "Cross-platform apps" },
  { name: "Node.js", group: "Back end", icon: "node", role: "Server runtime" },
  { name: "Express", group: "Back end", icon: "express", role: "REST APIs" },
  { name: "NestJS", group: "Back end", icon: "nestjs", role: "Structured services" },
  { name: "REST API design", group: "Back end", icon: "api", role: "Contracts & versioning" },
  { name: "Auth", group: "Back end", icon: "auth", role: "Authentication & authorisation" },
  { name: "Python", group: "Back end", icon: "python", role: "Scripts & services" },
  { name: "PostgreSQL", group: "Data", icon: "postgres", role: "Relational" },
  { name: "MySQL", group: "Data", icon: "mysql", role: "Relational" },
  { name: "MongoDB", group: "Data", icon: "mongodb", role: "Document store" },
  { name: "Mongoose", group: "Data", icon: "mongoose", role: "ODM" },
  { name: "Prisma", group: "Data", icon: "prisma", role: "Type-safe ORM" },
  { name: "Docker", group: "Infrastructure", icon: "docker", role: "Containers" },
  { name: "AWS", group: "Infrastructure", icon: "aws", role: "Cloud" },
  { name: "Vercel", group: "Infrastructure", icon: "vercel", role: "Deploys" },
  { name: "Git", group: "Infrastructure", icon: "git", role: "Version control" },
  { name: "GitHub Actions", group: "Infrastructure", icon: "githubactions", role: "CI/CD" },
];

/** Scrolls in the marquee under the grid. */
export const waysOfWorking = ["Agile delivery", "Code review", "Async remote collaboration", "Client communication", "Top Rated on Upwork", "Requirements → deploy"] as const;
