// "use client";

// import { useRef } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Section } from "@/components/Section";
// import ViewAnimation from "@/components/ViewAnimation";
// import { motion, useMotionValue } from "framer-motion";

// const previewImages = [
//   { src: "/Fullstack Developer Intern @PT.Usaha Gedung Mandiri.png", label: "Internship" },
//   { src: "/Liaison Officer_ICICoS 2024.png", label: "ICICoS 2024" },
//   { src: "/Laboratory_Assistant_Data Structure.png", label: "Data Structures" },
//   { src: "/ICP Web3 Workshop.png", label: "Web3 Workshop" },
//   { src: "/Alibaba Cloud Certification.jpg", label: "Alibaba Cloud" },
//   { src: "/Laboratory_Assistant_Computer Network.png", label: "Networking" },
// ];

// export default function GalleryPreview() {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const x = useMotionValue(0);

//   const cardWidth = 260;
//   const gap = 12;
//   const totalWidth = previewImages.length * (cardWidth + gap) - gap;

//   return (
//     <Section sectionNumber="04" label="Gallery">
//       <div className="py-12 sm:py-16 px-4 sm:px-6 overflow-hidden">
//         <ViewAnimation
//           initial={{ opacity: 0, translateY: -4 }}
//           whileInView={{ opacity: 1, translateY: 0 }}
//           delay={0.2}
//           viewport={{ once: true }}
//           className="flex items-end justify-between mb-8"
//         >
//           <div>
//             <h2 className="text-2xl sm:text-4xl font-medium tracking-tight mb-2">
//               Gallery
//             </h2>
//             <p className="text-sm text-muted-foreground max-w-md">
//               Moments captured through my lens.
//             </p>
//           </div>
//           <Link
//             href="/gallery"
//             className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
//           >
//             View all →
//           </Link>
//         </ViewAnimation>

//         {/* Draggable carousel */}
//         <ViewAnimation
//           initial={{ opacity: 0, translateY: -4 }}
//           whileInView={{ opacity: 1, translateY: 0 }}
//           delay={0.3}
//           viewport={{ once: true }}
//         >
//           <div ref={containerRef} className="cursor-grab active:cursor-grabbing">
//             <motion.div
//               className="flex"
//               style={{ x, gap: `${gap}px` }}
//               drag="x"
//               dragConstraints={{
//                 left: -(totalWidth - (containerRef.current?.clientWidth || 600)),
//                 right: 0,
//               }}
//               dragElastic={0.08}
//               dragTransition={{ bounceStiffness: 400, bounceDamping: 35 }}
//             >
//               {previewImages.map((img, i) => (
//                 <motion.div
//                   key={i}
//                   className="flex-shrink-0 group"
//                   style={{ width: cardWidth }}
//                   whileHover={{ y: -4 }}
//                   transition={{ duration: 0.25 }}
//                 >
//                   <Link href="/gallery" draggable={false}>
//                     <div className="relative aspect-[4/3] overflow-hidden bg-muted rounded-sm">
//                       <Image
//                         src={img.src}
//                         alt={img.label}
//                         fill
//                         className="object-cover bw-hover group-hover:scale-105 transition-transform duration-500"
//                         draggable={false}
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                       <span className="absolute bottom-3 left-3 text-white/0 group-hover:text-white/80 text-xs font-medium transition-colors duration-300 drop-shadow-lg">
//                         {img.label}
//                       </span>
//                     </div>
//                   </Link>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </div>

//           <p className="font-mono-accent text-[10px] text-muted-foreground/25 mt-4 select-none tracking-wider">
//             ← DRAG TO EXPLORE →
//           </p>
//         </ViewAnimation>
//       </div>
//     </Section>
//   );
// }
