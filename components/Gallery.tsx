"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const galleryImages = [
    {
        src: "/Panitia POINTS 2023.jpg",
        alt: "POINTS 2023",
        caption: "POINTS 2023",
        size: "large",
    },
    {
        src: "/Liaison Officer_ICICoS 2024.png",
        alt: "ICICoS 2024",
        caption: "LO @ ICICoS 2024",
        size: "medium",
    },
    {
        src: "/Laboratory_Assistant_Data Structure.png",
        alt: "Data Structure Teaching Assistant",
        caption: "Data Structures TA",
        size: "medium",
    },
    {
        src: "/Fullstack Developer Intern @PT.Usaha Gedung Mandiri.png",
        alt: "Internship at PT. UG Mandiri",
        caption: "Internship @ UG Mandiri",
        size: "large",
    },
    {
        src: "/Laboratory_Assistant_Computer Network.png",
        alt: "Computer Network TA",
        caption: "Computer Network TA",
        size: "medium",
    },
    {
        src: "/ICP Web3 Workshop.png",
        alt: "ICP Web3 Workshop",
        caption: "ICP Web3 Workshop",
        size: "medium",
    },
];

export default function Gallery() {
    return (
        <section id="gallery" className="py-20 section-separator">
            <div className="max-w-6xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Gallery
                    </h2>
                    <p className="text-gray-500 max-w-2xl leading-relaxed">
                        A curated visual anthology capturing fragments and chronicles of my technological odyssey
                        —showcasing endeavors in software craftsmanship, robotic ingenuity, collaborative
                        ventures, and digital explorations.
                    </p>
                </motion.div>

                {/* Masonry Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {galleryImages.filter((_, i) => i % 2 === 0).map((image, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group relative overflow-hidden cursor-pointer"
                            >
                                <div className={`relative ${image.size === 'large' ? 'aspect-[4/3]' : 'aspect-[16/10]'}`}>
                                    <Image
                                        src={image.src}
                                        alt={image.alt}
                                        fill
                                        className="object-cover bw-hover"
                                    />
                                    {/* Caption overlay at bottom */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="text-white text-sm font-medium">{image.caption}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {galleryImages.filter((_, i) => i % 2 === 1).map((image, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 + 0.05 }}
                                className="group relative overflow-hidden cursor-pointer"
                            >
                                <div className={`relative ${image.size === 'large' ? 'aspect-[4/3]' : 'aspect-[16/10]'}`}>
                                    <Image
                                        src={image.src}
                                        alt={image.alt}
                                        fill
                                        className="object-cover bw-hover"
                                    />
                                    {/* Caption overlay at bottom */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="text-white text-sm font-medium">{image.caption}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
