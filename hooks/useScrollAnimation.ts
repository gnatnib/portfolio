import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { useAnimation } from "framer-motion"

export function useScrollAnimation() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const controls = useAnimation()
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (inView && !hasAnimated) {
      controls.start({ opacity: 1, y: 0 })
      setHasAnimated(true)
    }
  }, [controls, inView, hasAnimated])

  return { ref, controls, initial: { opacity: 0, y: 50 } }
}

