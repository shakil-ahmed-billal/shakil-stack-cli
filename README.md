# 🚀 Shakil-Stack

[![npm version](https://img.shields.io/npm/v/@shakil-dev/shakil-stack.svg?style=flat-square)](https://www.npmjs.com/package/@shakil-dev/shakil-stack)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/github/actions/workflow/status/shakil-ahmed-billal/shakil-stack-cli/publish.yml?branch=main&style=flat-square)](https://github.com/shakil-ahmed-billal/shakil-stack-cli/actions)

**Shakil-Stack** is a high-performance, developer-first full-stack project generator. It scaffolds production-ready applications mirroring the **EchoNet** backend architecture paired with a state-of-the-art **Next.js** frontend.

---

## 🌟 Key Features

### 🛡️ Backend Excellence (Professional Coding Style)
- **Modular Architecture**: Clean, scalable `src/app/module` pattern.
- **Prisma 7+**: Next-gen database ORM with pre-configured PostgreSQL adapters.
- **Better Auth Integration**: Pre-built authentication schemas (User, Session, Account).
- **Security First**: Integrated Helmet, CORS, Rate Limiting, and XSS Sanitization.
- **Robust Error Handling**: Centralized global error handler and structured `ApiError` class.

### 🌐 Modern Frontend (Next.js)
- **App Router**: Leveraging the latest Next.js 14/15 patterns.
- **TypeScript & Tailwind**: Pre-configured for visual excellence and type safety.
- **Clean Structure**: Dedicated directories for hooks, services, lib, and types.

### 🛠️ Developer Experience (CLI)
- **One-Command Scaffolding**: Setup your entire stack in seconds.
- **Smart Generation**: Scaffold modules (Controller, Service, Route) with zero boilerplate.
- **Built-in Utilities**: Quick access to Prisma and build commands.

---

## 📖 Documentation & Guides
Check out our detailed guide for a thorough walkthrough of building with Shakil-Stack:
👉 [**Shakil-Stack CLI Mastering Guide**](https://xhakil.vercel.app/blog/shakil-stack-cli-guide)

---

## 🚀 Commands Guide

### 1. Initialize a New Project
Create your full-stack dream project interactively:
```bash
npx @shakil-dev/shakil-stack init my-awesome-app
```

### 2. Scaffold a New Module (g)
Generate a complete module with all layers instantly:
```bash
# Must be run in the project root
shakil-stack g module Product
```
**Generated Files:**
- `product.controller.ts`: Request/Response handling.
- `product.service.ts`: Business logic & Database interaction.
- `product.route.ts`: API endpoint definitions.
- `product.interface.ts`: Data types and contracts.
- `product.validation.ts`: Zod schema validation.
- `product.constant.ts`: Reusable constants.

### 3. Production Build
Prepare your application for the real world:
```bash
shakil-stack build
```

### 4. Prisma Power Tools
Manage your database without leaving the CLI:
```bash
shakil-stack prisma generate  # Update Prisma Client
shakil-stack prisma migrate   # Apply migrations to DB
```

---

## 📂 Project Structure

```text
my-awesome-app/
├── backend/
│   ├── prisma/             # Schema & Config
│   ├── src/
│   │   ├── server.ts       # Entry point
│   │   └── app/            # Core logic
│   │       ├── module/     # Feature-based modules
│   │       ├── middleware/ # Security & Global handlers
│   │       └── utils/      # Reusable helpers
│   └── tsconfig.json
├── frontend/ (Next.js)
│   ├── src/
│   │   ├── app/            # Routes & Pages
│   │   ├── components/     # UI Components
│   │   └── services/       # API integration
└── README.md
```

---

## 🛠️ Post-Setup Checklist
1.  **Environment**: Update `backend/.env` with your `DATABASE_URL`.
2.  **Database**: Run `shakil-stack prisma migrate` to setup your tables.
3.  **Launch**: Run `npm dev` in both folders.

---

## 🤝 Contributing
Contributions make the open-source community an amazing place to learn, inspire, and create.
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

Please read our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ⚡ by **Shakil Ahmed Billal**
