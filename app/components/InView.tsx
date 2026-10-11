"use client";

import { type CSSProperties, type ReactNode } from "react";
import { useInView } from "../hooks/useInView";

interface InViewProps {
  children: ReactNode;
  animation?: "fade-in-up" | "scale-in";
  delay?: number;
  className?: string;
  style?: CSSProperties;
}

export default function InView({
  children,
  animation = "fade-in-up",
  delay = 0,
  className = "",
  style,
}: InViewProps) {
  const ref = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      data-reveal=""
      data-reveal-animation={animation}
      className={className}
      style={{ animationDelay: `${delay}s`, ...style }}
    >
      {children}
    </div>
  );
}