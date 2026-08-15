/* Single source of truth for the CV asset + the summary shown alongside it. */

export const RESUME_FILE = "/CV_Bintang_Syafrian_Rizal.pdf";
export const RESUME_DOWNLOAD_NAME = "Bintang_Syafrian_Rizal_CV.pdf";
/* Bump when the PDF is replaced so browsers don't serve a stale cached copy.
   Re-render the page images too: see scripts/render-cv.py */
export const RESUME_VERSION = "2026-08b";

export const resumeUrl = `${RESUME_FILE}?v=${RESUME_VERSION}`;

/* Pre-rendered page images. The CV is shown as images rather than an embedded
   PDF because browser PDF plugins are unreliable — download managers (IDM) and
   most mobile browsers intercept the file, leaving a blank frame. Images always
   render, so visitors can read the CV without downloading anything. */
export const resumePages = [
  { src: "/cv/page-1.png", width: 1429, height: 2021 },
  { src: "/cv/page-2.png", width: 1429, height: 2021 },
];

export const RESUME_PREVIEW = resumePages[0].src;

export const resumeFacts = [
  { label: "Degree", value: "B.Sc. Computer Science — Universitas Diponegoro" },
  { label: "GPA", value: "3.65 / 4.00" },
  { label: "Graduating", value: "June 2026" },
  { label: "Focus", value: "Software Engineering · Machine Learning" },
];

export const resumeHighlights = [
  {
    period: "2024",
    role: "Full Stack Developer Intern",
    org: "PT. Usaha Gedung Mandiri",
  },
  {
    period: "2024",
    role: "Laboratory Teaching Assistant",
    org: "Computer Networks & Data Structures",
  },
  {
    period: "2026",
    role: "Thesis — Extractive Summarization with LLMs",
    org: "Indonesian palm oil regulatory documents",
  },
];
