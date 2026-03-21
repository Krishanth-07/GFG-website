# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Online Compiler On Vercel

This project exposes a production API route at `api/execute.js` for code execution.

- Frontend calls `/api/execute`
- Vercel runs this function server-side
- The function forwards execution to a hosted runtime provider (Judge0 CE)

Optional environment variable:

- `JUDGE0_BASE_URL` (default `https://ce.judge0.com`)
- `JUDGE0_TIMEOUT_MS` (default `45000`)

After changing environment variables on Vercel, redeploy the project.
