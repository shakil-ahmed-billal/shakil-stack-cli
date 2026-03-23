# Shakil-Stack Project Generator 🚀

**Shakil-Stack** is a powerful full-stack project generator CLI that scaffolds a robust, production-ready environment based on the **EchoNet** backend architecture and a modern **Next.js** frontend.

## ✨ Features

- **🛡️ EchoNet-Style Backend**:
    - **Architecture**: Clean `src/app/...` structure (config, middleware, routes, utils).
    - **Database**: Prisma 7+ with PostgreSQL adapter.
    - **Authentication**: Pre-configured **Better Auth** with User, Session, and Account models.
    - **Security**: Helmet, Express Rate Limit, and Request Sanitizer.
    - **Error Handling**: Global error handler with `ApiError` support.
    - **Validation**: Zod-ready structure.
- **🌐 Next.js Frontend**:
    - Modern Next.js (App Router, TypeScript, Tailwind CSS).
    - Pre-defined project folders: `config`, `hooks`, `lib`, `services`, `types`.
- **🛠️ Interactive Setup**: Choose your package manager (npm, pnpm, yarn) and auto-install dependencies.

## 🚀 Getting Started

You can generate a new project instantly using `npx`:

```bash
npx @shakil-dev/shakil-stack my-awesome-project
```

### Or, if already installed globally:

```bash
shakil-stack my-awesome-project
```

## 📂 Project Structure

```text
my-awesome-project/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma (Better Auth & Prisma 7 ready)
│   ├── src/
│   │   ├── server.ts
│   │   └── app/ (EchoNet logic)
│   └── .env
├── frontend/ (Next.js App)
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── ...
└── README.md
```

## 🏗️ Post-Installation Steps

After the generator finishes, follow these steps to start your development:

1.  **Configure Database**: Update the `DATABASE_URL` in `backend/.env`.
2.  **Start Backend**:
    ```bash
    cd backend
    pnpm dev  # or npm run dev
    ```
3.  **Start Frontend**:
    ```bash
    cd frontend
    pnpm dev  # or npm run dev
    ```

## 📜 Commands (Backend)

- `pnpm dev`: Starts the server with `tsx` and `nodemon`.
- `pnpm build`: Builds the project using `tsup`.
- `pnpm start`: Runs the built project from  `dist/`.

## 🤝 Contributing

Feel free to open issues or submit pull requests to improve the Shakil-Stack generator!

---
Developed with by **Shakil Ahmed Billal**
