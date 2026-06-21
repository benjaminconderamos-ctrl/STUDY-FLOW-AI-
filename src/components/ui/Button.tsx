"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "default" | "secondary" | "ghost" | "outline" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-[var(--foreground)] text-[var(--background)] hover:opacity-90",
  secondary: "bg-muted text-foreground hover:bg-border",
  ghost: "text-foreground-muted hover:bg-muted hover:text-foreground",
  outline: "border border-border text-foreground bg-transparent hover:bg-muted",
  destructive: "bg-red-600 text-white hover:bg-red-700",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[13px] rounded-[8px] gap-1.5",
  md: "h-9 px-4 text-[14px] rounded-[10px]",
  lg: "h-11 px-6 text-[15px] rounded-[12px]",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 font-sans font-medium leading-none transition-all duration-[160ms] ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 cursor-pointer";

type ButtonProps = (
  | (ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
  | { href: string; disabled?: boolean; className?: string; [key: string]: unknown }
) & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
};

export function Button({
  variant = "default",
  size = "md",
  loading = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = "disabled" in props && !!props.disabled;

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    (isDisabled || loading) && "opacity-50 cursor-not-allowed active:scale-100",
    className
  );

  const content = loading ? (
    <>
      <span
        className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin-smooth"
        aria-hidden="true"
      />
      <span>{children}</span>
    </>
  ) : (
    children
  );

  if ("href" in props && props.href !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { href, disabled, variant: _v, size: _s, loading: _l, ...rest } = props as {
      href: string;
      disabled?: boolean;
      variant?: ButtonVariant;
      size?: ButtonSize;
      loading?: boolean;
      className?: string;
      [key: string]: unknown;
    };
    return (
      <Link
        href={href}
        aria-disabled={disabled}
        className={cn(classes, disabled && "pointer-events-none")}
        {...(rest as object)}
      >
        {content}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _v, size: _s, loading: _l, href: _h, ...buttonRest } =
    props as ButtonHTMLAttributes<HTMLButtonElement> & {
      variant?: ButtonVariant;
      size?: ButtonSize;
      loading?: boolean;
      href?: undefined;
    };

  return (
    <button
      disabled={isDisabled || loading}
      className={classes}
      {...buttonRest}
    >
      {content}
    </button>
  );
}
