export const socialLinksTsx = `import { Mail, Globe } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
        fill="currentColor"
      />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        d="M21.418 1H2.584C1.634 1 1 1.628 1 2.572v18.855C1 22.373 1.792 23 2.583 23h18.834c.95 0 1.583-.628 1.583-1.572V2.573C23.001 1.627 22.367 1 21.418 1ZM7.49 19.7H4.166V9.172h3.323L7.49 19.7ZM5.906 7.757c-1.108 0-1.898-.785-1.898-1.885S4.8 3.985 5.906 3.985c1.11 0 1.9.787 1.9 1.887s-.95 1.885-1.9 1.885ZM19.836 19.7h-3.324v-5.028c0-1.257 0-2.83-1.742-2.83-1.74 0-1.9 1.258-1.9 2.673V19.7H9.548V9.172h3.166v1.413c.633-1.1 1.9-1.728 3.165-1.728 3.325 0 3.957 2.2 3.957 5.028V19.7Z"
        fill="currentColor"
      />
    </svg>
  );
}

function VerticalSeparator() {
  return <div className="flex h-11 w-px bg-border" />;
}

export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Link href="mailto:shakil.dev99@gmail.com" target="_blank" className="flex items-center text-muted-foreground transition-colors hover:text-foreground">
        <Mail className="size-4" />
        <span className="sr-only">Email</span>
      </Link>
      
      <VerticalSeparator />

      <Link href="https://linkedin.com/in/shakil-ahmed-billal" target="_blank" className="flex items-center text-muted-foreground transition-colors hover:text-foreground">
        <LinkedinIcon className="size-4" />
        <span className="sr-only">LinkedIn</span>
      </Link>
      
      <VerticalSeparator />

      <Link href="https://github.com/shakil-ahmed-billal" target="_blank" className="flex items-center text-muted-foreground transition-colors hover:text-foreground">
        <GithubIcon className="size-4" />
        <span className="sr-only">GitHub</span>
      </Link>
      
      <VerticalSeparator />

      <Link href="https://xhakil.vercel.app" target="_blank" className="flex items-center text-muted-foreground transition-colors hover:text-foreground">
        <Globe className="size-4" />
        <span className="sr-only">Website</span>
      </Link>
    </div>
  );
}
`;
