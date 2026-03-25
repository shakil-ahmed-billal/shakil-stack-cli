export const navbarTsx = `
"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, User, LogOut, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Logo } from "@/components/logo";
import { logoutAction } from "@/services/auth.actions";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

const menu: MenuItem[] = [
  {
    title: "Products",
    url: "#",
    items: [
      {
        title: "Platform",
        description: "The complete platform for building modern web apps.",
        icon: <LayoutDashboard className="size-5 shrink-0" />,
        url: "#",
      },
      {
        title: "Enterprise",
        description: "Scalable solutions for large organizations.",
        icon: <User className="size-5 shrink-0" />,
        url: "#",
      },
    ],
  },
  {
    title: "Pricing",
    url: "/#pricing",
  },
  {
    title: "Documentation",
    url: "https://xhakil.vercel.app/blog/shakil-stack-cli-guide",
  },
];

export function Navbar({ user }: { user: any }) {
  return (
    <section className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md shadow-sm py-3 transition-all duration-300">
      <div className="container mx-auto px-4 md:px-8">
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Logo />
            </Link>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => (
                    <NavigationMenuItem key={item.title}>
                      {item.items ? (
                        <>
                          <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="grid w-[600px] grid-cols-2 p-3">
                              {item.items.map((subItem) => (
                                <li key={subItem.title}>
                                  <NavigationMenuLink href={subItem.url}>
                                    {subItem.icon}
                                    <div>
                                      <div className="text-sm font-semibold">{subItem.title}</div>
                                      {subItem.description && (
                                        <p className="text-sm leading-snug text-muted-foreground">
                                          {subItem.description}
                                        </p>
                                      )}
                                    </div>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <NavigationMenuLink href={item.url} className={navigationMenuTriggerStyle()}>
                          {item.title}
                        </NavigationMenuLink>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" className="relative h-9 w-9 rounded-full" />}>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.image || ""} alt={user.name} />
                    <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    render={
                      <Link href="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    }
                  />
                  <DropdownMenuItem
                    render={
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    }
                  />
                  <DropdownMenuSeparator />
                  <form action={async () => { await logoutAction(); }}>
                    <DropdownMenuItem
                      // @ts-ignore
                      nativeButton
                      render={
                        <button type="submit" className="w-full h-full text-left outline-none cursor-pointer flex items-center text-destructive focus:text-destructive">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </button>
                      }
                    />
                  </form>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
                  Log in
                </Link>
                <Link href="/register" className={buttonVariants()}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Logo />
            </Link>
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <Sheet>
                <SheetTrigger className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                  <Menu className="size-4" />
                </SheetTrigger>
                <SheetContent className="overflow-y-auto w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>
                      <Link href="/">
                        <Logo />
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="my-8 flex flex-col gap-4">
                    <Accordion className="w-full">
                      {menu.map((item) => (
                        <AccordionItem key={item.title} value={item.title} className="border-none">
                          {item.items ? (
                            <>
                              <AccordionTrigger className="hover:no-underline">{item.title}</AccordionTrigger>
                              <AccordionContent>
                                <ul className="grid gap-2">
                                  {item.items.map((subItem) => (
                                    <li key={subItem.title}>
                                      <Link
                                        href={subItem.url}
                                        className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
                                      >
                                        {subItem.icon}
                                        <div>
                                          <div className="text-sm font-semibold">{subItem.title}</div>
                                          {subItem.description && (
                                            <p className="text-sm leading-snug text-muted-foreground">
                                              {subItem.description}
                                            </p>
                                          )}
                                        </div>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </AccordionContent>
                            </>
                          ) : (
                            <Link href={item.url} className="flex py-4 text-sm font-medium hover:underline">
                              {item.title}
                            </Link>
                          )}
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                  <div className="flex flex-col gap-4 mt-auto">
                    {user ? (
                      <>
                        <Link href="/dashboard" className={buttonVariants({ variant: "outline", className: "w-full" })}>
                          Dashboard
                        </Link>
                        <form action={async () => { await logoutAction(); }}>
                          <Button type="submit" variant="destructive" className="w-full">
                            Log out
                          </Button>
                        </form>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className={buttonVariants({ variant: "outline", className: "w-full" })}>
                          Log in
                        </Link>
                        <Link href="/register" className={buttonVariants({ className: "w-full" })}>
                          Sign up
                        </Link>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
`;

export const userAvatarTsx = `
"use client";

import { logoutAction } from "@/services/auth.actions";
import { useTransition } from "react";
import { toast } from "sonner";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { LayoutDashboard, LogOut, User } from "lucide-react";

interface UserAvatarProps {
  user: { name: string; email: string };
}

export function UserAvatar({ user }: UserAvatarProps) {
  const [isPending, startTransition] = useTransition();

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    startTransition(async () => {
      toast.loading("Logging out...");
      await logoutAction();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" className="relative h-9 w-9 rounded-full p-0" />}>
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={
            <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          }
        />
        <DropdownMenuItem
          render={
            <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
              <User className="h-4 w-4" />
              Profile
            </Link>
          }
        />
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isPending}
          className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          {isPending ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
`;

export const footerTsx = `
import { Logo } from "@/components/logo";
import { SocialLinks } from "@/components/social-links";

const sections = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "#" },
      { name: "Pricing", href: "#" },
      { name: "Documentation", href: "#" },
      { name: "API", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy", href: "#" },
      { name: "Terms", href: "#" },
      { name: "Cookie Policy", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-background py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-6 text-foreground hover:opacity-80 transition-opacity">
              <Logo />
            </a>
            <p className="max-w-xs text-muted-foreground mb-8 font-sans leading-relaxed">
              The ultimate full-stack boilerplate for modern web applications. Build faster, deploy smarter with a premium developer experience.
            </p>
            <SocialLinks />
          </div>
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-bold mb-4 uppercase text-xs tracking-wider text-muted-foreground font-sans">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors font-sans text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground font-sans">
          <p>© {new Date().getFullYear()} Shakil Ahmed Billal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
`;

export const layoutTsx = `
 import { Inter, Geist } from "next/font/google";
 import "./globals.css";
 import { Toaster } from "@/components/ui/sonner";
 import { Providers } from "@/components/Providers";
 import { cn } from "@/lib/utils";

 const geist = Geist({subsets:['latin'],variable:'--font-sans'});

 export const metadata = {
   title: "Shakil Stack - Full Stack Boilerplate",
   description: "Modern full-stack boilerplate with Next.js, Prisma, and Better-Auth.",
   icons: {
     icon: [
       { url: "/favicons/favicon.ico", sizes: "any" },
       { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
       { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" }
     ],
     apple: "/favicons/apple-touch-icon.png",
   },
   manifest: "/favicons/site.webmanifest",
 };

 export default async function RootLayout({
   children,
 }: {
   children: React.ReactNode;
 }) {
   return (
     <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
       <body className="font-sans antialiased min-h-screen">
         <Providers>
           {children}
           <Toaster />
         </Providers>
       </body>
     </html>
   );
 }
 `;

export const mainLayoutTsx = `
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getSession } from "@/lib/session";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
`;

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

export const separatorTsx = `import { cn } from "@/lib/utils";

export function Separator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-8 w-full border-x border-border",
        "before:absolute before:-left-[100vw] before:-z-1 before:h-8 before:w-[200vw]",
        "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-border)]/56",
        className
      )}
    />
  );
}
`;

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

export const dashboardPageTsx = `import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Build Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
`;

export const navMainTsx = `"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronRightIcon } from "lucide-react"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            render={<SidebarMenuItem />}
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
              <CollapsibleTrigger
                render={
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon}
                    <span>{item.title}</span>
                    <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                }
              />
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        render={
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        }
                      />
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
`;

export const navProjectsTsx = `"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { MoreHorizontalIcon, FolderIcon, ArrowRightIcon, Trash2Icon } from "lucide-react"

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: React.ReactNode
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              render={
                <a href={item.url}>
                  {item.icon}
                  <span>{item.name}</span>
                </a>
              }
            />
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuAction
                    showOnHover
                    className="aria-expanded:bg-muted"
                  >
                    <MoreHorizontalIcon />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                }
              />
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <FolderIcon className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArrowRightIcon className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2Icon className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontalIcon className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
`;

export const navUserTsx = `"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronsUpDownIcon, SparklesIcon, BadgeCheckIcon, CreditCardIcon, BellIcon, LogOutIcon } from "lucide-react"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDownIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <SparklesIcon
                />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheckIcon
                />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon
                />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon
                />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOutIcon
              />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
`;

export const teamSwitcherTsx = `"use client"

import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronsUpDownIcon, PlusIcon } from "lucide-react"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ReactNode
    plan: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  if (!activeTeam) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  {activeTeam.logo}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{activeTeam.name}</span>
                  <span className="truncate text-xs">{activeTeam.plan}</span>
                </div>
                <ChevronsUpDownIcon className="ml-auto" />
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Teams
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  {team.logo}
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <PlusIcon className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
`;

export const appSidebarTsx = `"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { GalleryVerticalEndIcon, AudioLinesIcon, TerminalIcon, TerminalSquareIcon, BotIcon, BookOpenIcon, Settings2Icon, FrameIcon, PieChartIcon, MapIcon } from "lucide-react"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: (
        <GalleryVerticalEndIcon
        />
      ),
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: (
        <AudioLinesIcon
        />
      ),
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: (
        <TerminalIcon
        />
      ),
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: (
        <TerminalSquareIcon
        />
      ),
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: (
        <BotIcon
        />
      ),
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: (
        <BookOpenIcon
        />
      ),
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: (
        <Settings2Icon
        />
      ),
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: (
        <FrameIcon
        />
      ),
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: (
        <PieChartIcon
        />
      ),
    },
    {
      name: "Travel",
      url: "#",
      icon: (
        <MapIcon
        />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
`;

export const dashboardLayoutTsx = `
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
`;

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
              <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">Faster Than Ever</span>
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
            <div className="mx-auto rounded-3xl bg-primary px-6 py-16 md:px-16 md:py-20 text-center text-primary-foreground shadow-2xl overflow-hidden relative">
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
