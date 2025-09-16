"use client";

import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

export function NeonBackground({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen">
      {/* Gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[#0CF29D]/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#0CF29D]/10 blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(12, 242, 157, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(12, 242, 157, 0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px, 48px 48px",
          maskImage:
            "radial-gradient(100% 60% at 50% 40%, black 40%, transparent 80%)",
        }}
      />

      {/* Soft noise */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #000, #000 1px, transparent 1px, transparent 2px)",
        }}
      />

      {/* Shimmer sweep inspired by glass highlights */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-1/2 left-0 right-0 h-[120%]"
        initial={{ x: "-40%" }}
        animate={{ x: "140%" }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "linear-gradient(75deg, transparent 45%, rgba(255,255,255,0.06) 50%, transparent 55%)",
        }}
      />

      {children}
    </div>
  );
}

export default NeonBackground;

