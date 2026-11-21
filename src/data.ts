import type { ImageMetadata } from "astro";

import pangan from "./assets/projects/pangan.png";
import scanmbg from "./assets/projects/scanmbg.png";
import zonakhas from "./assets/projects/zonakhas.png";
import rumeet from "./assets/projects/rumeet.png";
import sipp from "./assets/projects/sipp.png";
import etarteel from "./assets/projects/etarteel.png";
import twentyfour from "./assets/projects/twentyfour.png";
import helmet from "./assets/projects/helmet.png";
import financipal from "./assets/projects/financipal.png";
import sumanto from "./assets/projects/sumanto.png";

import logoSan from "./assets/experience/logo/san.png";
import logoUgm from "./assets/experience/logo/ugmandiri.png";
import logoUndip from "./assets/experience/logo/undipexp.png";
import logoIeee from "./assets/experience/logo/IEEEIS.png";
import logoSma from "./assets/experience/logo/sman4.png";
import photoSan from "./assets/experience/san.png";
import photoUgm from "./assets/experience/ugm.png";
import photoLabDs from "./assets/experience/lab-ds.png";
import photoLabNet from "./assets/experience/lab-net.png";
import photoIcicos from "./assets/experience/icicos.png";
import photoSma from "./assets/experience/sma.jpg";
import photoCimb1 from "./assets/experience/cimb-1.png";
import photoCimb2 from "./assets/experience/cimb-2.jpg";

export const person = {
  name: "Bintang Syafrian Rizal",
  handle: "gnatnib",
  role: "Software Developer",
  email: "bintang.syafrian@gmail.com",
  phone: "+62 851 7215 2969",
  city: "Semarang, Indonesia",
  site: "gnatnib.site",
};

export const socials = [
  { label: "GitHub", href: "https://github.com/gnatnib" },
  { label: "LinkedIn", href: "https://linkedin.com/in/bintangsyafrian" },
  { label: "Instagram", href: "https://instagram.com/bintwang" },
  { label: "X", href: "https://x.com/carpacciao" },
];

export const resume = {
  file: "/CV_Bintang_Syafrian_Rizal.pdf",
  downloadName: "Bintang_Syafrian_Rizal_CV.pdf",
  // Bump when the PDF is replaced so browsers drop the cached copy.
  // Re-render src/assets/cv/page-*.png too: see scripts/render-cv.py
  version: "2026-08b",
};
export const resumeUrl = `${resume.file}?v=${resume.version}`;

export const facts = [
  { label: "Degree", value: "B.Sc. Computer Science, Universitas Diponegoro" },
  { label: "GPA", value: "3.65 / 4.00" },
  { label: "Studied", value: "Aug 2022 to Jun 2026" },
  { label: "Focus", value: "Full-stack web, machine learning" },
];

export type Project = {
  slug: string;
  title: string;
  kind: string;
  client: string;
  year: string;
  summary: string;
  detail?: string;
  stack: string[];
  image: ImageMetadata;
  repo?: string;
  live?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "pangan-id",
    title: "Pangan.id",
    kind: "Web app",
    client: "Personal",
    year: "2026",
    summary: "Daily food prices across all 38 Indonesian provinces.",
    detail:
      "A fast, mobile-first dashboard over Bank Indonesia's official PIHPS price data. Compare commodities, provinces and dates without opening a spreadsheet.",
    stack: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    image: pangan,
    repo: "https://github.com/gnatnib/pangan.id",
    live: "https://pangan-id.vercel.app",
    featured: true,
  },
  {
    slug: "scanmbg",
    title: "ScanMBG",
    kind: "Web app, AI",
    client: "Community service",
    year: "2026",
    summary: "Nutrition analysis for Makan Bergizi Gratis food trays.",
    detail:
      "Scan or upload a photo of an MBG tray. Gemini 2.5 Flash, with Qwen 3.5 as fallback, recognizes each item and estimates portion and price, cross-checked against the TKPI nutrition database, then returns a 0 to 10 health score and a macro breakdown.",
    stack: ["Next.js", "JavaScript", "Gemini", "Tailwind CSS"],
    image: scanmbg,
    repo: "https://github.com/gnatnib/scanmbg",
    live: "https://scanmbg.vercel.app/",
    featured: true,
  },
  {
    slug: "rumeet",
    title: "Rumeet",
    kind: "Internal tool",
    client: "PT Usaha Gedung Mandiri",
    year: "2025",
    summary: "Meeting room booking for 50+ employees.",
    detail:
      "Built during my internship in a four-person team under a one-month deadline. Replaced manual coordination with a booking calendar that prevents scheduling conflicts.",
    stack: ["Laravel", "PHP", "MySQL", "Bootstrap"],
    image: rumeet,
    repo: "https://github.com/gnatnib/ugbooking",
    featured: true,
  },
  {
    slug: "helmet-detection",
    title: "Helmet Detection",
    kind: "Computer vision",
    client: "Academic",
    year: "2025",
    summary: "Real-time helmet detection on motorcyclists.",
    detail:
      "A YOLOv11 model that flags riders without a helmet in traffic footage, served through a Streamlit app.",
    stack: ["Python", "YOLOv11", "Streamlit"],
    image: helmet,
    repo: "https://github.com/gnatnib/helmet_detection",
    live: "https://helmetdetectioncomvis.streamlit.app/",
    featured: true,
  },
  {
    slug: "sipp",
    title: "SiPP",
    kind: "Internal tool",
    client: "PT Usaha Gedung Mandiri",
    year: "2025",
    summary: "Procurement management with a simpler approval flow.",
    stack: ["Laravel", "PHP", "MySQL", "Bootstrap"],
    image: sipp,
    repo: "https://github.com/gnatnib/ugprocurement",
  },
  {
    slug: "zona-khas",
    title: "Zona KHAS Sendangmulyo",
    kind: "Web app",
    client: "Community service",
    year: "2025",
    summary: "Information system for the Kelurahan's UMKM and local food program.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    image: zonakhas,
    repo: "https://github.com/gnatnib/idbu81",
    live: "https://khasklipang.vercel.app",
  },
  {
    slug: "e-tarteel",
    title: "E-Tarteel",
    kind: "Web app",
    client: "Personal",
    year: "2025",
    summary: "Quran reading and recitation app.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    image: etarteel,
    repo: "https://github.com/gnatnib/e-tarteel",
    live: "https://etarteel.vercel.app",
  },
  {
    slug: "twentyfour",
    title: "Twentyfour",
    kind: "Game",
    client: "Personal",
    year: "2025",
    summary: "Multiplayer 24 card game with an arcade look.",
    stack: ["JavaScript", "HTML", "Firebase"],
    image: twentyfour,
    repo: "https://github.com/gnatnib/twentyfour",
    live: "https://twentyfourgame.vercel.app",
  },
  {
    slug: "financipal",
    title: "Financipal",
    kind: "Web app",
    client: "Personal",
    year: "2024",
    summary: "Personal finance tracker with income and expense analytics.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    image: financipal,
    repo: "https://github.com/gnatnib/financipal",
    live: "https://financipal.vercel.app",
  },
  {
    slug: "sumanto",
    title: "Sumanto",
    kind: "Web app",
    client: "Academic",
    year: "2023",
    summary: "Academic management system.",
    stack: ["Laravel", "PHP", "MySQL", "Bootstrap"],
    image: sumanto,
    repo: "https://github.com/gnatnib/Sumanto",
  },
];

/* `from`/`to` are YYYY-MM and drive the timeline. Equal values draw a point;
   `to: null` means ongoing. `logo: null` falls back to `mark` as a lettermark.
   `photos` can hold several; the detail panel scrolls through them. */
export type Experience = {
  role: string;
  org: string;
  kind: "Work" | "Teaching" | "Event" | "Study";
  from: string;
  to: string | null;
  period: string;
  text: string;
  logo: ImageMetadata | null;
  mark?: string;
  photos: ImageMetadata[];
};

export const experience: Experience[] = [
  {
    role: "Software Engineer",
    org: "CIMB Niaga, CIPTA Data Analyst",
    kind: "Work",
    from: "2026-09",
    to: null,
    period: "Sep 2026 to now",
    text: "Building internal tools for the bank, starting with a no-code platform HR teams use to assemble their own forms, approvals and reports.",
    logo: null,
    mark: "CIMB",
    photos: [photoCimb1, photoCimb2],
  },
  {
    role: "Fullstack Developer Intern",
    org: "PT Sinergi Asta Nusantara",
    kind: "Work",
    from: "2026-02",
    to: "2026-04",
    period: "Feb to Apr 2026",
    text: "HR system for 150+ employees: attendance, payroll, self-service.",
    logo: logoSan,
    photos: [photoSan],
  },
  {
    role: "Fullstack Developer Intern",
    org: "PT Usaha Gedung Mandiri",
    kind: "Work",
    from: "2025-01",
    to: "2025-02",
    period: "Jan to Feb 2025",
    text: "Shipped Rumeet and SiPP in one month, four-person team.",
    logo: logoUgm,
    photos: [photoUgm],
  },
  {
    role: "Teaching Assistant, Data Structures",
    org: "Universitas Diponegoro",
    kind: "Teaching",
    from: "2024-09",
    to: "2024-12",
    period: "Sep to Dec 2024",
    text: "Tutorials on lists, trees and graphs; grading and office hours.",
    logo: logoUndip,
    photos: [photoLabDs],
  },
  {
    role: "Liaison Officer, ICICoS 2024",
    org: "Undip with IEEE Indonesia Section",
    kind: "Event",
    from: "2024-07",
    to: "2024-07",
    period: "Jul 2024",
    text: "Point of contact for international speakers at the conference.",
    logo: logoIeee,
    photos: [photoIcicos],
  },
  {
    role: "Teaching Assistant, Computer Networks",
    org: "Universitas Diponegoro",
    kind: "Teaching",
    from: "2024-02",
    to: "2024-05",
    period: "Feb to May 2024",
    text: "Networking labs with Cisco Packet Tracer.",
    logo: logoUndip,
    photos: [photoLabNet],
  },
  {
    role: "B.Sc. Computer Science",
    org: "Universitas Diponegoro",
    kind: "Study",
    from: "2022-08",
    to: "2026-06",
    period: "Aug 2022 to Jun 2026",
    text: "GPA 3.65. Thesis on LLM extractive summarization.",
    logo: logoUndip,
    photos: [],
  },
  {
    role: "Graduated high school",
    org: "SMA Negeri 4 Semarang",
    kind: "Study",
    from: "2022-07",
    to: "2022-07",
    period: "Jul 2022",
    text: "Science track.",
    logo: logoSma,
    photos: [photoSma],
  },
];

const certImages = import.meta.glob<{ default: ImageMetadata }>(
  "./assets/certs/*.{png,jpg}",
  { eager: true },
);
const cert = (file: string) => {
  const mod = certImages[`./assets/certs/${file}`];
  if (!mod) throw new Error(`Missing certificate image: ${file}`);
  return mod.default;
};

export const certificateGroups = [
  {
    issuer: "Amazon Web Services",
    items: [
      { title: "AWS Certified AI Practitioner (AIF-C01), practice exam", image: cert("aws-ai-practitioner.png") },
      { title: "AWS Solutions Architect Associate (SAA-C03), practice exam", image: cert("aws-solutions-architect.png") },
      { title: "AWS Certified Cloud Practitioner (CLF-C02), practice exam", image: cert("aws-cloud-practitioner.png") },
      { title: "AWS Academy Graduate, Machine Learning Foundations", image: cert("aws-academy-ml-foundations.png") },
      { title: "AWS Academy Graduate, Cloud Foundations", image: cert("aws-academy-cloud-foundations.png") },
    ],
  },
  {
    issuer: "HackerRank",
    items: [
      { title: "Problem Solving (Intermediate)", image: cert("hr-problem-solving-intermediate.png") },
      { title: "Problem Solving (Basic)", image: cert("hr-problem-solving-basic.png") },
      { title: "Software Engineer Intern", image: cert("hr-swe-intern.png") },
      { title: "SQL (Basic)", image: cert("hr-sql-basic.png") },
      { title: "Python (Basic)", image: cert("hr-python-basic.png") },
    ],
  },
  {
    issuer: "Oracle Academy",
    items: [
      { title: "Database Programming with SQL", image: cert("oracle-db-programming-sql.png") },
      { title: "Database Design", image: cert("oracle-db-design.png") },
    ],
  },
  {
    issuer: "Dicoding",
    items: [
      { title: "Memulai Pemrograman dengan Java", image: cert("dicoding-java.png") },
      { title: "Memulai Pemrograman dengan C", image: cert("dicoding-c.png") },
    ],
  },
  {
    issuer: "Alibaba Cloud Academy",
    items: [
      { title: "Alibaba Cloud Certification", image: cert("alibaba-cloud.jpg") },
      { title: "The History of Cloud Computing", image: cert("alibaba-0ef21bdf766d04c0c4b38c06c741255e.png") },
      { title: "ECS Fundamentals", image: cert("alibaba-1be594f24d811463f46eaaea34f78a65.png") },
      { title: "Cloud Computing and Application in Sports", image: cert("alibaba-4a43149da98595ff9b7dcbf973188246.png") },
      { title: "ApsaraDB RDS Fundamentals", image: cert("alibaba-5c720758bbeeae29df36e836d217b7cf.png") },
      { title: "Alibaba Cloud Academy Online Conference", image: cert("alibaba-2969f056d87f8c2b0a6029a2a6220b4d.png") },
      { title: "VPC Fundamentals", image: cert("alibaba-577d6d43dbcb6c8672935bed4e2f39d6.png") },
      { title: "Fundamentals of Cloud Computing", image: cert("alibaba-6808b8bffb62813a3702c4f6322faaa5.png") },
      { title: "Key Technologies in Cloud Computing", image: cert("alibaba-717f4daee32bcb6c4d2fe3b9da132ec2.png") },
      { title: "OSS Fundamentals", image: cert("alibaba-7faaefce0782713b8b8f6a7eb7514f24.png") },
      { title: "Uncovering your Stable, Secured and Reliable Cloud", image: cert("alibaba-839353e88a7be7fbe195d8fcde2d2cac.png") },
      { title: "Certificate of Achievement", image: cert("alibaba-88e7f9df7afe84bc763f4c18c1f19fd3.png") },
      { title: "SLB Fundamentals", image: cert("alibaba-b6f0dedb8475a34c7194c5182c54eba1.png") },
      { title: "The Benefits of Cloud Computing", image: cert("alibaba-cf1618e0ec491d79485edd0afd993b97.png") },
      { title: "Deploying MySQL on ECS", image: cert("alibaba-cf4ea38957ed87b659045f5b6d797be7.png") },
      { title: "Auto Scaling Fundamentals", image: cert("alibaba-eda48a8dfa150907867499e3a514feb7.png") },
    ],
  },
  {
    issuer: "Other",
    items: [
      { title: "ICP Web3 Workshop", image: cert("icp-web3.png") },
      { title: "Committee, POINTS 2023", image: cert("points-2023.jpg") },
    ],
  },
];

/* `icon` is a simple-icons slug; items without one render as a lettermark
   (simple-icons has no AWS entry). */
export const stack = [
  { name: "TypeScript", icon: "typescript", group: "Web" },
  { name: "JavaScript", icon: "javascript", group: "Web" },
  { name: "React", icon: "react", group: "Web" },
  { name: "Next.js", icon: "nextdotjs", group: "Web" },
  { name: "Astro", icon: "astro", group: "Web" },
  { name: "Node.js", icon: "nodedotjs", group: "Web" },
  { name: "Laravel", icon: "laravel", group: "Web" },
  { name: "PHP", icon: "php", group: "Web" },
  { name: "Tailwind CSS", icon: "tailwindcss", group: "Web" },
  { name: "Python", icon: "python", group: "Data" },
  { name: "pandas", icon: "pandas", group: "Data" },
  { name: "NumPy", icon: "numpy", group: "Data" },
  { name: "PyTorch", icon: "pytorch", group: "Data" },
  { name: "YOLO", icon: "ultralytics", group: "Data" },
  { name: "OpenCV", icon: "opencv", group: "Data" },
  { name: "Streamlit", icon: "streamlit", group: "Data" },
  { name: "Jupyter", icon: "jupyter", group: "Data" },
  { name: "Gemini", icon: "googlegemini", group: "Data" },
  { name: "PostgreSQL", icon: "postgresql", group: "Infra" },
  { name: "MySQL", icon: "mysql", group: "Infra" },
  { name: "Supabase", icon: "supabase", group: "Infra" },
  { name: "Prisma", icon: "prisma", group: "Infra" },
  { name: "Firebase", icon: "firebase", group: "Infra" },
  { name: "Docker", icon: "docker", group: "Infra" },
  { name: "AWS", icon: null, group: "Infra" },
  { name: "Vercel", icon: "vercel", group: "Infra" },
  { name: "Git", icon: "git", group: "Infra" },
  { name: "Linux", icon: "linux", group: "Infra" },
] as const;
