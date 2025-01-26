"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GithubIcon, ExternalLinkIcon } from "lucide-react"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"

const projects = [
  {
    title: "E-commerce Platform",
    description: "A full-featured online store built with Next.js, Stripe, and MongoDB.",
    image: "/project1.jpg",
    github: "https://github.com/yourusername/project1",
    live: "https://project1.com",
  },
  {
    title: "Task Management App",
    description: "A Trello-like application developed using React, Node.js, and PostgreSQL.",
    image: "/project2.jpg",
    github: "https://github.com/yourusername/project2",
    live: "https://project2.com",
  },
  {
    title: "Weather Dashboard",
    description: "A responsive weather app built with React and OpenWeatherMap API.",
    image: "/project3.jpg",
    github: "https://github.com/yourusername/project3",
    live: "https://project3.com",
  },
]

export default function Projects() {
  const { ref, controls, initial } = useScrollAnimation()

  return (
    <section id="projects" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">My Projects</h2>
        <motion.div
          ref={ref}
          initial={initial}
          animate={controls}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="p-0">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle>{project.title}</CardTitle>
                <CardDescription className="mt-2">{project.description}</CardDescription>
              </CardContent>
              <CardFooter className="bg-muted p-6 flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <GithubIcon className="w-4 h-4 mr-2" />
                    GitHub
                  </a>
                </Button>
                <Button size="sm" asChild>
                  <a href={project.live} target="_blank" rel="noopener noreferrer">
                    <ExternalLinkIcon className="w-4 h-4 mr-2" />
                    Live Demo
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

