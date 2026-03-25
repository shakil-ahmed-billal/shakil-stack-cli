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

export const providersTsx = `
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
`;
