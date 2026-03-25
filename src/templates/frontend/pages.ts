export const landingPageTsx = `
"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, Check, Zap, Shield, Rocket, Smartphone, Globe, Code, Layers } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/separator";

const features = [
  {
    title: "Next.js 15 (App Router)",
    description: "The latest React framework with Server Actions, React Compiler, and deeply optimized performance.",
    icon: <Rocket className="size-5 text-primary" />,
  },
  {
    title: "Better-Auth",
    description: "State-of-the-art authentication with multi-session, multi-device, and advanced security configurations.",
    icon: <Shield className="size-5 text-primary" />,
  },
  {
    title: "Prisma 7 & PostgreSQL",
    description: "Modern ORM with type-safe queries, seamless migrations, and high-performance database access.",
    icon: <Zap className="size-5 text-primary" />,
  },
  {
    title: "Tailwind CSS v4",
    description: "Lightning-fast styling with the latest Tailwind compiler and a gorgeous default design system.",
    icon: <Layers className="size-5 text-primary" />,
  },
  {
    title: "Monorepo & Turborepo",
    description: "Seamlessly scale your backend and frontend in a unified, blazingly fast workspace.",
    icon: <Globe className="size-5 text-primary" />,
  },
  {
    title: "Beautiful Components",
    description: "Pre-built, accessible, and deeply customizable UI blocks powered by Base UI & Shadcn.",
    icon: <Code className="size-5 text-primary" />,
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-background selection:bg-primary/20">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-50 blur-[100px]"></div>
      </div>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-[calc(100vh-61px)] flex items-center pt-16 pb-32">
          <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
            <Link href="https://xhakil.vercel.app/" target="_blank" className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium bg-secondary/50 text-secondary-foreground ring-1 ring-border mb-8 transition-colors hover:bg-secondary">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
              Created by Shakil
              <ArrowRight className="ml-2 size-4" />
            </Link>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 lg:mb-8 max-w-5xl mx-auto text-balance drop-shadow-sm">
              Build Your Next Big Thing <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Faster Than Ever</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 md:mb-12 leading-relaxed text-balance">
              The ultimate full-stack boilerplate with Next.js, Prisma, Better-Auth, and Tailwind v4. 
              Beautifully crafted, deeply integrated, and ready for production.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "px-8 h-14 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:-translate-y-0.5 w-full sm:w-auto")}>
                Start Building Now
              </Link>
              <Link href="https://xhakil.vercel.app/blog/shakil-stack-cli-guide" target="_blank" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-8 h-14 text-base font-semibold bg-background/50 backdrop-blur-sm w-full sm:w-auto")}>
                Read Documentation
              </Link>
            </div>
          </div>
        </section>

        <Separator />

        {/* Features Section */}
        <section className="py-24 relative bg-slate-50/50 dark:bg-slate-900/10">
          <div className="absolute inset-y-0 w-full h-px bg-border top-0" />
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 md:mb-24">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Everything you need to scale</h2>
              <p className="text-lg md:text-xl text-muted-foreground">
                We've carefully engineered the perfect foundation. No more spending days configuring tools—start shipping features immediately.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="group relative p-8 rounded-3xl bg-background border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 tracking-tight">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute inset-y-0 w-full h-px bg-border bottom-0" />
        </section>

        <Separator />

        {/* CTA Section */}
        <section className="py-24 md:py-32 relative overflow-hidden">
           <div className="absolute inset-0 bg-primary/5" />
           <div className="container mx-auto px-4 md:px-8 relative z-10">
            <div className="max-w-4xl mx-auto rounded-3xl bg-primary px-6 py-16 md:px-16 md:py-20 text-center text-primary-foreground shadow-2xl overflow-hidden relative">
              {/* Decorative elements inside CTA */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/10 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-balance">
                  Turn Your Vision into Reality
                </h2>
                <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-10 font-medium text-balance">
                  Stop wrestling with configuration. Start shipping features that matter. Join the community of builders using Shakil Stack to launch faster.
                </p>
                <Link href="/register" className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "px-10 h-14 text-base font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1")}>
                  Start Building for Free
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </div>
            </div>
           </div>
        </section>
      </main>
    </div>
  );
}
`;

