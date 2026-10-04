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
  year: string
  blurb: string
  points: string[]
  stack: string[]
  href: string
  linkLabel: string
  cover: 'docs' | 'board' | 'cities' | 'graph'
}

export const resume = {
  firstName: 'Ayush',
  lastName: 'Chaurasiya',
  role: 'Full-stack developer',
  tagline:
    'I build and ship scalable web apps and AI-powered platforms, from the first commit to production on AWS.',
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

  about: {
    lead: 'Full-stack developer who takes products all the way: design the system, write the code, ship it to production, and keep it running.',
    body: [
      'I was Co-Founder and CTO at Ximverse, where I led product and engineering for an AI-powered export compliance platform that automates Indian customs export filing. Before that I was a full-stack developer intern at LeapX, PW Institute of Innovation.',
      'I built BruteForce, a DSA tracking platform used by 800+ students at PW IOI. I care about scalable systems, sharp problem-solving, and software that real people depend on.',
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
      name: 'Data',
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
      name: 'AI',
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
        { name: 'AWS EC2', note: 'production hosting' },
        { name: 'AWS S3', note: 'BruteForce' },
        { name: 'Docker', note: 'Ximverse' },
        { name: 'CI / CD', note: 'pipelines' },
        { name: 'BullMQ', note: 'BruteForce' },
        { name: 'Git + GitHub', note: 'daily' },
        { name: 'Vercel', note: 'deploys' },
        { name: 'Postman', note: 'API testing' },
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
      hash: 'l3apx25',
      role: 'Full Stack Developer Intern',
      org: 'LeapX, PW Institute of Innovation',
      period: 'Feb 2025 — May 2025',
      points: [
        'Delivered end-to-end product features from implementation to deployment in a collaborative engineering team.',
        'Improved application performance and fixed production issues through debugging and code optimization.',
      ],
      tags: ['Full stack', 'Production debugging', 'Performance'],
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
      kind: 'Export compliance and shipping-bill automation platform',
      year: '2025 — 26',
      blurb:
        'A cross-border trade platform with a modern product catalogue and end-to-end export documentation, so exporters create and manage essential trade documents in one place.',
      points: [
        'AI-powered workflow automation understands user requests and fills the relevant forms automatically.',
        'Cuts manual work across the export documentation process.',
      ],
      stack: ['Next.js', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'AWS', 'Docker'],
      href: 'https://www.ximverse.com/',
      linkLabel: 'ximverse.com',
      cover: 'docs',
    },
    {
      title: 'BruteForce',
      kind: 'DSA tracker and admin dashboard',
      year: '2025',
      blurb:
        'A full-stack analytics platform that tracks coding activity, rankings and student performance across coding platforms.',
      points: [
        'Adopted in real-world use at PW IOI for tracking student performance and activity.',
        'Used by 800+ students.',
      ],
      stack: ['Next.js', 'React', 'Node.js', 'Express.js', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Redis', 'BullMQ', 'AWS S3'],
      href: 'https://bruteforce.pwioi.com/',
      linkLabel: 'bruteforce.pwioi.com',
      cover: 'board',
    },
    {
      title: 'RIFT Hackathon',
      kind: 'Organizer, multi-city hackathon',
      year: 'Leadership',
      blurb:
        'Organized RIFT Hackathon across four cities, attracting 8,000+ registrations and 2,200+ participants.',
      points: ['Four cities.', '8,000+ registrations, 2,200+ participants.'],
      stack: ['Community', 'Operations', 'Leadership'],
      href: '',
      linkLabel: '',
      cover: 'cities',
    },
    {
      title: 'More on GitHub',
      kind: 'Experiments, DSA and side builds',
      year: 'Ongoing',
      blurb:
        '1,000+ DSA problems solved across Codeforces, CodeChef, LeetCode and GeeksforGeeks, plus everything else I am tinkering with.',
      points: [],
      stack: ['Codeforces', 'CodeChef', 'LeetCode', 'GeeksforGeeks'],
      href: 'https://github.com/ayush-init',
      linkLabel: 'github.com/ayush-init',
      cover: 'graph',
    },
  ] as Project[],
}
