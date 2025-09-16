import { PropsWithChildren } from "react";
import clsx from "clsx";

export function GlassCard({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-[#1E2A29]/80 bg-[#0F1517]/80 backdrop-blur-xl",
        "shadow-[0_0_0_1px_#0CF29D20,0_0_30px_#0CF29D10]",
        className
      )}
    >
      {children}
    </div>
  );
}

export default GlassCard;

