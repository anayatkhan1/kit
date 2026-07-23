"use client"

import Image from "next/image"
import * as React from "react"
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
        "group relative bg-secondary flex aspect-video items-center justify-center overflow-hidden rounded-lg",
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
          "h-full w-full rounded-lg object-cover transition-transform duration-500",
          "group-hover:scale-[1.03] group-hover:brightness-[1.03]"
        )}
        quality={100}
      />

      {/* Ambient glow */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0"
        whileHover={reduced ? undefined : { opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(109,119,213,0.26), transparent 55%)",
        }}
      />

      {/* Single shimmer sweep on hover */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0"
        whileHover={
          reduced
            ? undefined
            : {
                opacity: 1,
                x: "30%",
                transition: { duration: 0.8, ease: "easeOut" },
              }
        }
        initial={reduced ? false : { opacity: 0, x: "-30%" }}
        style={{
          background:
            "linear-gradient(120deg, transparent 30%, rgba(109,119,213,0.35) 50%, transparent 70%)",
          filter: "blur(0.5px)",
        }}
      />
    </motion.div>
  )
}

