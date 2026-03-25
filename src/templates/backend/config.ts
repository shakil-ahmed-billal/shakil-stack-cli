export const tsconfigTs = (setupVercel: boolean) => `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "${setupVercel ? "esnext" : "NodeNext"}",
    "moduleResolution": "${setupVercel ? "bundler" : "NodeNext"}",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
`;

