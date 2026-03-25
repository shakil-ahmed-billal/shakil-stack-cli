# 🚀 Shakil-Stack CLI

[![npm version](https://img.shields.io/npm/v/@shakil-dev/shakil-stack.svg?style=flat-square)](https://www.npmjs.com/package/@shakil-dev/shakil-stack)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/github/actions/workflow/status/shakil-ahmed-billal/shakil-stack-cli/publish.yml?branch=main&style=flat-square)](https://github.com/shakil-ahmed-billal/shakil-stack-cli/actions)
[![npm downloads](https://img.shields.io/npm/dm/@shakil-dev/shakil-stack?style=flat-square)](https://www.npmjs.com/package/@shakil-dev/shakil-stack)

**Shakil-Stack** is a high-performance, developer-first full-stack project generator CLI. It scaffolds production-ready applications with a professional **Express/Prisma** backend and a state-of-the-art **Next.js 16 / React 19** frontend — complete with unified branding, authentication, and a premium UI system out of the box.

---

## 📖 Documentation & Guides

Full walkthrough and advanced usage:  
👉 [**Shakil-Stack CLI Mastering Guide**](https://xhakil.vercel.app/blog/shakil-stack-cli-guide)

---

## ✨ What's New (v2.2.9)

- 🎨 **Unified Branding System** — `<Logo />` component with dark/light SVG variants auto-copied into `public/logos/`
- 🔲 **`<Separator />` Component** — Premium diagonal-pattern divider for rhythmic UI sectioning
- 🔗 **`<SocialLinks />` Component** — Footer social links (Email, LinkedIn, GitHub, Portfolio) wired to the author's real profiles
- 🔑 **Google OAuth UI** — Login & Register forms now feature a Google sign-in button (replacing the old GitHub button)
- 🖼️ **Dual-Pane Auth Layout** — Premium split-screen login/register with gradient backdrop and quote panel
- 📁 **Favicons & Logos Asset Pipeline** — Static assets organized into `public/favicons/` and `public/logos/`; CLI automatically physicalizes them during `init`
- 🧱 **Shadcn Base UI (New API)** — Migrated to the new `Field`, `FieldGroup`, `FieldLabel`, and `render` prop pattern — fully compatible with React 19, zero hydration errors
- 🔌 **TanStack Query** — Pre-wired `<Providers />` with `QueryClientProvider` + `ThemeProvider`
- 🌐 **Geist Font** — Global Geist sans font loaded via `next/font/google`
- 🗑️ **Boilerplate Cleanup** — Default Next.js `page.tsx`, `globals.css`, and asset files are removed and replaced during generation

---

## 🌟 Key Features

### 🛡️ Backend (Professional EchoNet Architecture)
- **Modular Architecture** — Clean, scalable `src/app/module` pattern
- **Prisma 7+** — Next-gen ORM with pre-configured PostgreSQL adapters and local generated client
- **Better Auth Integration** — Pre-built authentication schemas (User, Session, Account)
- **Security First** — Integrated Helmet, CORS, Rate Limiting, and XSS Sanitization
- **Centralized Error Handling** — Global error handler and structured `ApiError` class

### 🌐 Frontend (Next.js 16 / React 19)
- **App Router** — Latest Next.js App Router patterns with Server Actions
- **TypeScript & Tailwind CSS** — Pre-configured for visual excellence and type safety
- **Shadcn/UI (Base UI)** — New component API (`Field`, `FieldGroup`, render props) — no hydration errors
- **Geist Font** — Modern, clean sans-serif font via `next/font/google`
- **Dark / Light Mode** — `ThemeProvider` with system preference detection
- **TanStack Query** — Ready-to-use `QueryClientProvider` in `<Providers />`
- **Sonner Toasts** — Beautiful toast notifications pre-wired globally

### 🎨 Branding & UI Components
| Component | Path | Description |
|---|---|---|
| `<Logo />` | `components/logo.tsx` | Themed logo with dark/light SVG swap, optional text |
| `<Separator />` | `components/separator.tsx` | Diagonal-pattern full-width section divider |
| `<SocialLinks />` | `components/social-links.tsx` | Icon links for Email, LinkedIn, GitHub, Portfolio |
| `<Navbar />` | `components/navbar.tsx` | Sticky responsive nav with user dropdown, mobile Sheet |
| `<Footer />` | `components/footer.tsx` | Multi-column footer with `<Logo />` + `<SocialLinks />` |
| `<UserAvatar />` | `components/user-avatar.tsx` | Dropdown avatar with logout, dashboard, profile links |
| `<ThemeSwitcher />` | `components/theme-switcher.tsx` | One-click dark/light mode toggle |

### 🔑 Authentication
- **Dual-Pane Layout** — Left: gradient brand panel with logo + quote. Right: form panel
- **Login Form** — Email + Password with Zod validation + Google sign-in button
- **Register Form** — Name, Email, Password, Confirm Password with Zod validation + Google sign-in button
- **Server Actions** — `loginAction`, `registerAction`, `logoutAction` using `httpClient` (axios)
- **JWT Session** — `getSession()` reads and decodes `accessToken` from server-side cookies
- **Secure Cookies** — `httpOnly`, `SameSite=None` + `Secure=true` in production

### 🛠️ Developer Experience (CLI)
- **One-Command Scaffolding** — Full-stack project in seconds with `init`
- **Smart Module Generation** — Scaffold full backend modules (Controller, Service, Route, Interface, Validation, Constant)
- **Asset Physicalization** — Logos and favicons automatically copied into `public/` during project init
- **Boilerplate Cleanup** — Default Next.js starter files removed automatically
- **Built-in Prisma Tools** — `prisma generate` and `prisma migrate` without leaving the CLI
- **Production Build** — TypeScript compilation via `tsup` targeting Node 20

---

## 🚀 Commands Guide

### 1. Initialize a New Project
```bash
npx @shakil-dev/shakil-stack init my-awesome-app
```
Scaffolds the complete full-stack project interactively — backend, frontend, assets, and all components.

### 2. Scaffold a New Module
Generate a complete backend module with all layers:
```bash
# Must be run in the project root
shakil-stack g module Product
```
**Generated Files:**
| File | Purpose |
|---|---|
| `product.controller.ts` | Request / Response handling |
| `product.service.ts` | Business logic & Database interaction |
| `product.route.ts` | API endpoint definitions |
| `product.interface.ts` | TypeScript types and contracts |
| `product.validation.ts` | Zod schema validation |
| `product.constant.ts` | Reusable constants |

### 3. Production Build
```bash
shakil-stack build
```

### 4. Prisma Power Tools
```bash
shakil-stack prisma generate   # Update Prisma Client
shakil-stack prisma migrate    # Apply migrations to DB
```

---

## 📂 Project Structure

```text
my-awesome-app/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # DB schema (User, Session, Account)
│   │   └── migrations/
│   ├── src/
│   │   ├── server.ts            # Entry point
│   │   └── app/
│   │       ├── module/          # Feature-based modules
│   │       ├── middleware/      # Security & Global handlers
│   │       └── utils/           # Reusable helpers
│   └── tsconfig.json
│
└── frontend/ (Next.js 16 / React 19)
    ├── public/
    │   ├── logos/
    │   │   ├── logo-dark.svg    # Dark mode logo
    │   │   ├── logo-light.svg   # Light mode logo
    │   │   └── logo-icon.png    # Favicon source
    │   └── favicons/
    │       ├── favicon.ico
    │       ├── favicon-16x16.png
    │       ├── favicon-32x32.png
    │       ├── apple-touch-icon.png
    │       └── site.webmanifest
    └── src/
        ├── app/
        │   ├── layout.tsx           # Root layout (Geist font, metadata, Providers)
        │   ├── (main)/              # Public-facing pages
        │   │   ├── layout.tsx       # Navbar + Footer layout
        │   │   └── page.tsx         # Landing page
        │   ├── (auth)/              # Auth pages (no navbar/footer)
        │   │   ├── login/page.tsx
        │   │   └── register/page.tsx
        │   └── dashboard/
        │       └── page.tsx
        ├── components/
        │   ├── logo.tsx             # <Logo /> with dark/light SVG swap
        │   ├── separator.tsx        # <Separator /> diagonal-pattern divider
        │   ├── social-links.tsx     # <SocialLinks /> icon links
        │   ├── navbar.tsx           # Responsive sticky navbar
        │   ├── footer.tsx           # Multi-column footer
        │   ├── user-avatar.tsx      # Avatar dropdown (logout, dashboard, profile)
        │   ├── theme-switcher.tsx   # Dark/light mode toggle
        │   ├── Providers.tsx        # QueryClientProvider + ThemeProvider
        │   └── auth/
        │       ├── login-form.tsx   # Dual-pane login form
        │       └── register-form.tsx # Dual-pane register form
        ├── lib/
        │   ├── utils.ts             # cn() utility
        │   ├── session.ts           # getSession() JWT cookie reader
        │   ├── axios/
        │   │   └── httpClient.ts    # Configured axios instance
        │   ├── tokenUtils.ts        # setTokenInCookies (server action)
        │   └── cookieUtils.ts       # deleteCookie (server action)
        └── services/
            └── auth.actions.ts      # loginAction, registerAction, logoutAction
```

---

## 🛠️ Post-Setup Checklist

1. **Backend Environment** — Fill in `backend/.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
   ACCESS_TOKEN_SECRET="your-secret"
   REFRESH_TOKEN_SECRET="your-secret"
   ```

2. **Frontend Environment** — Fill in `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:8000/api/v1"
   ```

3. **Database** — Run migrations:
   ```bash
   shakil-stack prisma migrate
   ```

4. **Launch** — Start both servers in separate terminals:
   ```bash
   # Backend
   cd backend && npm run dev

   # Frontend
   cd frontend && npm run dev
   ```

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS v4, Shadcn/UI (Base UI) |
| **Font** | Geist (via `next/font/google`) |
| **Auth UI** | Dual-pane layout, Google OAuth button |
| **State / Data** | TanStack Query (React Query v5) |
| **Toasts** | Sonner |
| **Forms** | React Hook Form + Zod |
| **HTTP Client** | Axios |
| **Backend** | Express.js, TypeScript |
| **ORM** | Prisma 7+ (PostgreSQL) |
| **Auth** | Better Auth |
| **Security** | Helmet, CORS, Rate Limit, XSS |

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

Built with ⚡ by **[Shakil Ahmed Billal](https://xhakil.vercel.app)**  
[📧 Email](mailto:shakil.dev99@gmail.com) · [💼 LinkedIn](https://linkedin.com/in/shakil-ahmed-billal) · [🐙 GitHub](https://github.com/shakil-ahmed-billal) · [🌐 Portfolio](https://xhakil.vercel.app)
