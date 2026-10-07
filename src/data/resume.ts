// Every word on the site comes from this file. Edit here; nothing else needs to change.

export type Skill = { name: string; note: string }
export type Layer = { code: string; name: string; blurb: string; skills: Skill[] }
export type Commit = {
  kind: 'work' | 'edu'
  hash: string
  role: string
  org: string
  orgNote?: string
  period: string
  points: string[]
  tags: string[]
}
export type Project = {
  title: string
  kind: string
  // Keep every blurb to roughly the same length (about 140 characters) so the cards stay identical in size.
  blurb: string
  href: string
  linkLabel: string
  // File in /public/projects. 'shot' is a site screenshot shown in a browser frame; 'logo' is a cut-out mark.
  image: string
  imageKind: 'shot' | 'logo'
}

export const resume = {
  firstName: 'Ayush',
  lastName: 'Chaurasiya',
  role: 'Full-stack developer',
  tagline:
    'Building scalable web applications and AI-powered products from idea to production.',
  location: 'Bengaluru, India',
  email: 'ayushchaurasiya@example.com',
  // Phone is left off the public site on purpose. Add it here to show it in the contact section.
  phone: '',
  links: [
    { label: 'GitHub', handle: 'ayush-init', href: 'https://github.com/ayush-init' },
    { label: 'LinkedIn', handle: 'in/ayush2006', href: 'https://www.linkedin.com/in/ayush2006/' },
  ],
  // Drop a PDF in /public and set this to '/Ayush-Chaurasiya-Resume.pdf' to show a download button.
  resumeUrl: '',
  // The hero character. A transparent cutout in /public, with its relief map "<name>-depth.png" beside it.
  // Set to '' to fall back to a rigged GLB (avatarModel) or the coded mascot.
  avatarImage: 'avatar.webp',
  // Leave empty for the built-in mascot. To use your own rigged model, put the GLB in /public and name it here, e.g. 'avatar.glb'.
  avatarModel: '',

  about: {
    // Headline: what I do and why it matters, in one line. The name is already the hero, so it is not repeated here.
    lead: 'I build software that real people',
    leadAccent: 'depend on.',
    // Proof first (one specific thing per paragraph), then what I care about. Numbers live in the stats row below.
    body: [
      'As Co-Founder and CTO of Ximverse, I led product and engineering for an AI-powered platform that automates Indian customs export filing. It was incubated at PIEDS, BITS Pilani, and backed by a government grant.',
      'I also built BruteForce, a DSA tracking platform that students at PW IOI use to follow their coding activity, rankings and progress.',
      'I care about scalable systems, sharp problem-solving, and owning a product end to end: design it, build it, ship it, and keep it running.',
    ],
    stats: [
      { value: 1000, suffix: '+', label: 'DSA problems solved' },
      { value: 800, suffix: '+', label: 'students on BruteForce' },
      { value: 7, prefix: '₹', suffix: 'L', label: 'government grant secured' },
      { value: 2200, suffix: '+', label: 'hackathon participants' },
    ],
  },

  stack: [
    {
      code: 'L0',
      name: 'Frontend',
      blurb: 'The surface. Interfaces people actually touch, fast and typed.',
      skills: [
        { name: 'React.js', note: 'UI / components' },
        { name: 'Next.js', note: 'full-stack web' },
        { name: 'TypeScript', note: 'type-safe code' },
        { name: 'JavaScript', note: 'core language' },
        { name: 'Tailwind CSS', note: 'UI / styling' },
      ],
    },
    {
      code: 'L1',
      name: 'Backend',
      blurb: 'APIs, services and business logic that hold up under real traffic.',
      skills: [
        { name: 'Node.js', note: 'server runtime' },
        { name: 'Express.js', note: 'REST APIs' },
        { name: 'Spring Boot', note: 'Java services' },
        { name: 'FastAPI', note: 'API / services' },
        { name: 'REST APIs', note: 'system integration' },
        { name: 'BullMQ', note: 'background jobs' },
      ],
    },
    {
      code: 'L2',
      name: 'Databases & ORM',
      blurb: 'Where state lives. Relational, document, cache and queue.',
      skills: [
        { name: 'PostgreSQL', note: 'relational data' },
        { name: 'MongoDB', note: 'document data' },
        { name: 'MySQL', note: 'relational data' },
        { name: 'Prisma ORM', note: 'database ORM' },
        { name: 'JPA / Hibernate', note: 'Java ORM' },
        { name: 'Redis', note: 'cache / queues' },
      ],
    },
    {
      code: 'L3',
      name: 'AI Engineering',
      blurb: 'LLMs wired into real workflows, not bolted on as a demo.',
      skills: [
        { name: 'LLM Integration', note: 'AI features' },
        { name: 'RAG', note: 'knowledge retrieval' },
        { name: 'LangChain', note: 'AI workflows' },
        { name: 'Vector DBs', note: 'embedding search' },
        { name: 'Agentic AI', note: 'autonomous workflows' },
        { name: 'Prompt Engineering', note: 'AI behavior' },
      ],
    },
    {
      code: 'L4',
      name: 'Cloud and DevOps',
      blurb: 'The ground floor. Build, ship, monitor, repeat.',
      skills: [
        { name: 'AWS EC2 & S3', note: 'cloud infrastructure' },
        { name: 'Docker', note: 'containerization' },
        { name: 'CI / CD', note: 'automated delivery' },
        { name: 'BullMQ', note: 'background jobs' },
        { name: 'Git + GitHub', note: 'version control' },
        { name: 'Vercel', note: 'web deployment' },
      ],
    },
  ] as Layer[],

  experience: [
    {
      kind: 'work',
      hash: 'x1mv3r5',
      role: 'Co-Founder and CTO',
      org: 'Ximverse',
      orgNote: 'Export and trade-compliance SaaS',
      period: 'Dec 2025 - Jun 2026',
      points: [
        'Co-founded Ximverse and led the development of an AI-powered B2B platform that orchestrates cross-border trade and EXIM operations in India.',
        'Incubated at PIEDS, BITS Pilani, and secured a ₹7 lakh government grant to build and scale the platform.',
        'Built AI-assisted document parsing and validation workflows to reduce manual processing.',
      ],
      tags: [],
    },
    {
      kind: 'work',
      hash: 'r1ft4c1',
      role: 'Event Organiser',
      org: 'RIFT Hackathon',
      orgNote: 'Multi-city hackathon',
      // Add the dates here, e.g. 'Jan 2026 - Mar 2026'.
      period: '',
      points: [
        'Organised RIFT Hackathon with the team, running it across four cities.',
        'Drew 8,000+ registrations and 2,200+ participants.',
        'Built and maintained the official hackathon platform for registrations, team formation, submissions, judging, and organizer workflows.',
      ],
      tags: [],
    },
    {
      kind: 'edu',
      hash: 'bca2427',
      role: 'Bachelor of Computer Applications (BCA)',
      org: 'Manipal University Jaipur',
      period: '2024 - 2027',
      points: [],
      tags: [],
    },
    {
      kind: 'edu',
      hash: 'pwioi24',
      role: 'Skills Upskilling Residential Program',
      org: 'PW Institute of Innovation (PW IOI), Bengaluru',
      period: '2024 - 2028',
      points: [],
      tags: [],
    },
  ] as Commit[],

  projects: [
    {
      title: 'Ximverse',
      kind: 'Export compliance platform',
      blurb:
        'An AI-powered B2B platform that orchestrates cross-border trade and EXIM operations, helping Indian exporters manage compliance, documentation, and customs workflows in one place.',
      href: 'https://www.ximverse.com/',
      linkLabel: 'ximverse.com',
      image: 'ximverse.webp',
      imageKind: 'shot',
    },
    {
      title: 'BruteForce',
      kind: 'DSA tracker and dashboard',
      blurb:
        'A DSA tracking platform that follows coding activity, rankings and progress across coding platforms, used by 800+ students at PW IOI.',
      href: 'https://bruteforce.pwioi.com/',
      linkLabel: 'bruteforce.pwioi.com',
      image: 'bruteforce.webp',
      imageKind: 'shot',
    },
    {
      title: 'Kusumita',
      kind: 'NGO foundation website',
      blurb:
        'The website for Kusumita Foundation, an NGO restoring nature and supporting communities, with programs, events, donations and volunteer sign-up.',
      href: 'https://kusumita.vercel.app/',
      linkLabel: 'kusumita.vercel.app',
      image: 'kusumita.webp',
      imageKind: 'shot',
    },
    {
      title: 'GitHub',
      kind: 'Still Building',
      blurb:
        'Not everything I build makes it to this portfolio. Explore more projects, experiments and open-source work on my Github.',
      href: 'https://github.com/ayush-init',
      linkLabel: 'github.com/ayush-init',
      image: 'github.webp',
      imageKind: 'logo',
    },
  ] as Project[],
}
