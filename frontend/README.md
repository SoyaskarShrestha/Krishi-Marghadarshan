# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# Krishi-Marghadarshan

## Django backend

This frontend can talk to the Django REST backend in `backend/`.

1. Set `VITE_API_URL` in the repository root `.env` file.
2. Start the backend from `backend/`.
3. Start the frontend with `npm run dev`.

## Firebase OAuth Setup (Google + GitHub)

This project now uses real Firebase Authentication for the OAuth buttons on signup/login pages.

1. Create a Firebase project.
2. In Firebase console, go to Authentication > Sign-in method.
3. Enable providers:
	- Google
	- GitHub (add your GitHub OAuth app Client ID and Secret)
4. Add your app domain to Firebase authorized domains (for local dev this is usually `localhost`).
5. Fill in all `VITE_FIREBASE_*` values in the repository root `.env` file.
6. Restart the Vite dev server after changing `.env`.

Without these environment values, OAuth buttons will show a configuration error message.
