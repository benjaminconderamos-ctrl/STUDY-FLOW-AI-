import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 28, className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center flex-shrink-0", className)}>
      {/* Light mode: black mark on white bg — multiply blends white into cream background */}
      <Image
        src="/logo-light.png"
        alt="StudyFlow AI"
        width={size}
        height={size}
        className="dark:hidden rounded-[6px] [mix-blend-mode:multiply]"
        priority
      />
      {/* Dark mode: white mark on black bg — screen blends black into dark background */}
      <Image
        src="/logo-dark.png"
        alt="StudyFlow AI"
        width={size}
        height={size}
        className="hidden dark:inline-block rounded-[6px] [mix-blend-mode:screen]"
        priority
      />
    </span>
  );
}
