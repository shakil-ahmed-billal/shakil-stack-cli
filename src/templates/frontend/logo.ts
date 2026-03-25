export const logoTsx = `import * as React from "react"
import { cn } from "@/lib/utils"

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  imgClassName?: string;
  showText?: boolean;
}

export function Logo({ className, imgClassName, showText = true, ...props }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)} {...props}>
      <img 
        src="/logos/logo-dark.svg" 
        className={cn("block dark:hidden w-8", imgClassName)} 
        alt="Logo" 
      />
      <img 
        src="/logos/logo-light.svg" 
        className={cn("hidden dark:block w-8", imgClassName)} 
        alt="Logo" 
      />
      {showText && <span className="text-xl font-bold tracking-tight">Shakil Stack</span>}
    </div>
  )
}
`;
