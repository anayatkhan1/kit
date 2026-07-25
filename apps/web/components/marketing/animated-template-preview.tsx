"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

export function AnimatedTemplatePreview({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const reduced = useReducedMotion() ?? false

  return (
    <motion.div
      className={cn(
        "group relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-secondary",
        className
      )}
      initial={reduced ? false : { opacity: 0, y: 8 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      whileHover={
        reduced
          ? undefined
          : {
              y: -3,
              transition: { duration: 0.25, ease: "easeOut" },
            }
      }
    >
      <Image
        src={src}
        alt={alt}
        width={540}
        height={310}
        className={cn(
          "h-full w-full rounded-lg object-cover transition-[transform,filter] duration-500 ease-out",
          !reduced && "group-hover:scale-[1.03] group-hover:brightness-[1.03]"
        )}
        quality={100}
      />

      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(109,119,213,0.26),transparent_55%)] opacity-0 transition-opacity duration-300 ease-out",
          !reduced && "group-hover:opacity-100"
        )}
      />

      {!reduced ? (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 w-1/2",
            "bg-[linear-gradient(120deg,transparent_20%,rgba(109,119,213,0.35)_50%,transparent_80%)]",
            "opacity-0 blur-[0.5px]",
            "-translate-x-full transition-[transform,opacity] duration-700 ease-out",
            "group-hover:translate-x-[200%] group-hover:opacity-100"
          )}
        />
      ) : null}
    </motion.div>
  )
}
