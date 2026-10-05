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
        { name: 'React.js', note: 'BruteForce' },
        { name: 'Next.js', note: 'Ximverse · BruteForce' },
        { name: 'TypeScript', note: 'Ximverse' },
        { name: 'JavaScript', note: 'everywhere' },
        { name: 'Tailwind CSS', note: 'Ximverse · BruteForce' },
      ],
    },
    {
      code: 'L1',
      name: 'Backend',
      blurb: 'APIs, services and business logic that hold up under real traffic.',
      skills: [
        { name: 'Node.js', note: 'Ximverse · BruteForce' },
        { name: 'Express.js', note: 'Ximverse · BruteForce' },
        { name: 'Spring Boot', note: 'Java services' },
        { name: 'Java', note: 'language' },
        { name: 'Python', note: 'language' },
        { name: 'C / C++', note: 'DSA · 1,000+ problems' },
      ],
    },
    {
      code: 'L2',
      name: 'Databases & ORM',
      blurb: 'Where state lives. Relational, document, cache and queue.',
      skills: [
        { name: 'PostgreSQL', note: 'Ximverse · BruteForce' },
        { name: 'MongoDB', note: 'document store' },
        { name: 'MySQL', note: 'relational' },
        { name: 'Prisma ORM', note: 'Ximverse · BruteForce' },
        { name: 'JPA / Hibernate', note: 'with Spring Boot' },
        { name: 'Redis', note: 'BruteForce' },
      ],
    },
    {
      code: 'L3',
      name: 'AI Engineering',
      blurb: 'LLMs wired into real workflows, not bolted on as a demo.',
      skills: [
        { name: 'LLM integration', note: 'Ximverse' },
        { name: 'RAG', note: 'retrieval pipelines' },
        { name: 'LangChain', note: 'orchestration' },
        { name: 'Vector DBs', note: 'vector stores' },
        { name: 'Agentic AI', note: 'Ximverse automation' },
        { name: 'Prompt eng.', note: 'prompt engineering' },
      ],
    },
    {
      code: 'L4',
      name: 'Cloud and DevOps',
      blurb: 'The ground floor. Build, ship, monitor, repeat.',
      skills: [
        { name: 'AWS EC2 & S3', note: 'hosting · BruteForce' },
        { name: 'Docker', note: 'Ximverse' },
        { name: 'CI / CD', note: 'pipelines' },
        { name: 'BullMQ', note: 'BruteForce' },
        { name: 'Git + GitHub', note: 'daily' },
        { name: 'Vercel', note: 'deploys' },      ],
    },
  ] as Layer[],

  experience: [
    {
      kind: 'work',
      hash: 'x1mv3r5',
      role: 'Co-Founder and CTO',
      org: 'Ximverse',
      orgNote: 'Export and trade-compliance SaaS',
      period: 'Dec 2025 — Jun 2026',
      points: [
        'Co-founded Ximverse and led development of an AI-powered export compliance platform that automates Indian customs export filing.',
        'Incubated at PIEDS, BITS Pilani, and secured a ₹7 lakh government grant to build and scale the platform.',
        'Built AI-assisted document parsing and validation workflows to reduce manual processing.',
      ],
      tags: ['Leadership', 'AI workflows', 'Next.js', 'PostgreSQL', 'AWS'],
    },
    {
      kind: 'work',
      hash: 'r1ft4c1',
      role: 'Event Coordinator',
      org: 'RIFT Hackathon',
      orgNote: 'Multi-city hackathon',
      // Add the dates here, e.g. 'Jan 2026 — Mar 2026'.
      period: '',
      points: [
        'Organised RIFT Hackathon with the team, running it across four cities.',
        'Drew 8,000+ registrations and 2,200+ participants.',
      ],
      tags: ['Leadership', 'Event operations', 'Community'],
    },
    {
      kind: 'edu',
      hash: 'bca2427',
      role: 'Bachelor of Computer Applications (BCA)',
      org: 'Manipal University Jaipur',
      period: '2024 — 2027',
      points: [],
      tags: ['Degree'],
    },
    {
      kind: 'edu',
      hash: 'pwioi24',
      role: 'Skills Upskilling Residential Program',
      org: 'PW Institute of Innovation (PW IOI), Bengaluru',
      period: '2024 — 2028',
      points: [],
      tags: ['Residential program'],
    },
  ] as Commit[],

  projects: [
    {
      title: 'Ximverse',
      kind: 'Export compliance platform',
      blurb:
        'An AI-powered export compliance platform that automates Indian customs export filing, so exporters handle their trade documents in one place.',
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
      kind: 'Open source and side builds',
      blurb:
        'I am an active contributor on GitHub. It is where my experiments, side builds and the code behind these projects live, commit by commit.',
      href: 'https://github.com/ayush-init',
      linkLabel: 'github.com/ayush-init',
      image: 'github.webp',
      imageKind: 'logo',
    },
  ] as Project[],
}
