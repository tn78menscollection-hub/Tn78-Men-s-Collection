import React from "react";
import Link from "next/link";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "sand" | "gold" | "glass" | "dark";
  size?: "sm" | "md" | "lg";
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-heading font-black uppercase tracking-[0.14em] transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95 cursor-pointer rounded-full";

  const sizeStyles = {
    sm: "px-5 py-2 text-[11px]",
    md: "px-7 py-3 text-xs sm:text-[13px]",
    lg: "px-9 py-3.5 text-xs sm:text-sm tracking-[0.18em]",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#E2C58A] via-[#EDD6A7] to-[#C6A467] text-[#0A0B0E] hover:shadow-glow-gold hover:scale-105 btn-shimmer shadow-md",
    gold:
      "bg-gradient-to-r from-[#E2C58A] via-[#EDD6A7] to-[#C6A467] text-[#0A0B0E] hover:shadow-glow-gold hover:scale-105 btn-shimmer shadow-md",
    sand:
      "bg-gradient-to-r from-[#E2C58A] via-[#EDD6A7] to-[#C6A467] text-[#0A0B0E] hover:shadow-glow-gold hover:scale-105 btn-shimmer shadow-md",
    outline:
      "border border-[#E2C58A]/50 text-[#E2C58A] hover:bg-[#E2C58A] hover:text-[#0A0B0E] bg-transparent hover:shadow-glow-gold transition-all duration-300",
    glass:
      "bg-white/5 border border-white/15 text-white hover:bg-white/10 backdrop-blur-md hover:border-white/30",
    dark:
      "bg-[#13151C] border border-[#232733] text-white hover:border-[#E2C58A]/60 hover:text-[#E2C58A]",
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
