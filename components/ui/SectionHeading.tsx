import React from "react";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const alignClasses = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col ${alignClasses} ${className}`}>
      {eyebrow && (
        <span className="text-[#9E6544] text-xs font-heading font-bold uppercase tracking-[0.2em] mb-1.5">
          {eyebrow}
        </span>
      )}
      <h2 className="text-[#1A1816] font-serif text-2xl sm:text-3xl md:text-4xl tracking-tight font-normal">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1 font-serif italic text-xs sm:text-sm text-[#78716A] max-w-xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
