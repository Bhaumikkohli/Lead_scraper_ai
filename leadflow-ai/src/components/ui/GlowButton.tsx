"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import clsx from "clsx";
import type { ReactNode } from "react";

type GlowButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children?: ReactNode;
  className?: string;
};

export function GlowButton({ className, children, ...props }: GlowButtonProps): JSX.Element {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={clsx(
        "relative inline-flex items-center justify-center px-4 py-2 rounded-md",
        "bg-[#0CF29D] text-black font-semibold",
        "shadow-[0_0_0_1px_#0CF29D60,0_0_20px_#0CF29D40] hover:brightness-95",
        className
      )}
      {...props}
    >
      {children}
      <span aria-hidden className="absolute inset-0 rounded-md opacity-30 bg-gradient-to-br from-white/40 to-transparent" />
    </motion.button>
  );
}

export default GlowButton;

