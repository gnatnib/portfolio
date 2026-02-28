"use client";

// import { useState } from "react";
// import Image from "next/image";
// import HeroSection from "@/components/HeroSection";
// import { Section } from "@/components/Section";
// import ViewAnimation from "@/components/ViewAnimation";
// import { motion, AnimatePresence } from "framer-motion";

// const galleryImages = [
//   { src: "/Fullstack Developer Intern @PT.Usaha Gedung Mandiri.png", label: "Internship @ UG Mandiri" },
//   { src: "/Liaison Officer_ICICoS 2024.png", label: "LO @ ICICoS 2024" },
//   { src: "/Laboratory_Assistant_Data Structure.png", label: "Data Structures TA" },
//   { src: "/Laboratory_Assistant_Computer Network.png", label: "Computer Network TA" },
//   { src: "/Certification Panitia POINTS 2023.jpg", label: "POINTS 2023 Committee" },
//   { src: "/ICP Web3 Workshop.png", label: "ICP Web3 Workshop" },
//   { src: "/Alibaba Cloud Certification.jpg", label: "Alibaba Cloud" },
//   { src: "/HackerRank Problem Solving (Intermediate).png", label: "HackerRank" },
//   { src: "/Hackerrank Software Engineer Intern.png", label: "HackerRank SWE Intern" },
//   { src: "/ORACLE Academy_Database Programming with SQL.png", label: "Oracle DB with SQL" },
// ];

// export default function GalleryPage() {
//   const [selectedImage, setSelectedImage] = useState<number | null>(null);

//   return (
//     <>
//       <HeroSection
//         title="Gallery"
//         sectionNumber="GL.01"
//         description="A curated visual anthology capturing fragments and chronicles of my technological odyssey — showcasing endeavors in software craftsmanship, robotic ingenuity, and digital explorations."
//       />

//       <Section sectionNumber="GL.02" label="Photos">
//         <div className="py-12 sm:py-20 px-4 sm:px-6">
//           <ViewAnimation
//             initial={{ opacity: 0, translateY: -4 }}
//             whileInView={{ opacity: 1, translateY: 0 }}
//             delay={0.2}
//             viewport={{ once: true }}
//           >
//             {/* Three-column masonry with staggered heights */}
//             <div className="columns-2 sm:columns-3 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
//               {galleryImages.map((item, index) => (
//                 <motion.div
//                   key={index}
//                   className="relative overflow-hidden rounded-sm cursor-pointer group break-inside-avoid"
//                   whileHover={{ scale: 0.98 }}
//                   transition={{ duration: 0.25 }}
//                   onClick={() => setSelectedImage(index)}
//                 >
//                   <div className="relative overflow-hidden" style={{ aspectRatio: index % 3 === 0 ? "3/4" : index % 3 === 1 ? "4/3" : "1/1" }}>
//                     <Image
//                       src={item.src}
//                       alt={item.label}
//                       fill
//                       className="object-cover bw-hover group-hover:scale-105 transition-transform duration-500"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//                     {/* Label on hover */}
//                     <span className="absolute bottom-3 left-3 text-white/0 group-hover:text-white/90 text-xs font-medium transition-colors duration-300 drop-shadow-lg">
//                       {item.label}
//                     </span>

//                     {/* Coordinate marker */}
//                     <span className="absolute top-2 left-2 font-mono-accent text-[9px] text-white/0 group-hover:text-white/40 transition-colors duration-300">
//                       [{String(index + 1).padStart(2, "0")}]
//                     </span>

//                     {/* Corner ticks */}
//                     <div className="absolute top-2 right-2 w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                       <div className="absolute top-0 right-0 w-2.5 h-px bg-white/40" />
//                       <div className="absolute top-0 right-0 w-px h-2.5 bg-white/40" />
//                     </div>
//                     <div className="absolute bottom-2 right-2 w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                       <div className="absolute bottom-0 right-0 w-2.5 h-px bg-white/40" />
//                       <div className="absolute bottom-0 right-0 w-px h-2.5 bg-white/40" />
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </ViewAnimation>
//         </div>
//       </Section>

//       {/* Lightbox */}
//       <AnimatePresence>
//         {selectedImage !== null && (
//           <motion.div
//             className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-4 cursor-pointer"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={() => setSelectedImage(null)}
//           >
//             <motion.div
//               className="relative max-w-4xl w-full max-h-[80vh] aspect-[3/2] rounded-sm overflow-hidden"
//               initial={{ scale: 0.85, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.85, opacity: 0 }}
//               transition={{ type: "spring", bounce: 0.12, duration: 0.5 }}
//             >
//               <Image
//                 src={galleryImages[selectedImage].src}
//                 alt={galleryImages[selectedImage].label}
//                 fill
//                 className="object-contain"
//                 sizes="(max-width: 896px) 100vw, 896px"
//               />
//             </motion.div>

//             {/* Info below */}
//             <motion.div
//               className="mt-4 text-center"
//               initial={{ y: 10, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.2 }}
//             >
//               <p className="text-white text-sm font-medium">{galleryImages[selectedImage].label}</p>
//               <p className="font-mono-accent text-white/30 text-[10px] mt-1">
//                 {selectedImage + 1} / {galleryImages.length}
//               </p>
//             </motion.div>

//             {/* Nav buttons */}
//             <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setSelectedImage((p) => (p! === 0 ? galleryImages.length - 1 : p! - 1));
//                 }}
//                 className="pointer-events-auto w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-colors backdrop-blur-sm border border-white/10"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
//                 </svg>
//               </button>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setSelectedImage((p) => (p! === galleryImages.length - 1 ? 0 : p! + 1));
//                 }}
//                 className="pointer-events-auto w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-colors backdrop-blur-sm border border-white/10"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }
