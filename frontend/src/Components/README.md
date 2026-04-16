# Component Structure Guide

Use this folder as the single source for shared UI and page-level components.

## Folder layout

- `pages/`: route-level pages (`Homepage`, `Shop`, `Cart`, etc.)
- `auth/`: authentication and profile completion pages
- `guards/`: route access wrappers (`ProtectedRoute`, `AdminRoute`, `AdvisorRoute`)
- `layout/`: shared chrome (`NavBar`, `Footer`)
- `admin/`: admin-only views
- `advisor/`: advisor-only views

## How to add components

1. Create the component file in the correct subfolder (for example `pages/Orders.jsx`).
2. If needed, add a paired style file (for example `Orders.css`).
3. Export it from `index.js` so imports stay consistent across the app.
4. Use the component through grouped imports:

```jsx
import { Orders } from '../Components'
```

## Current roles

- Page components: `pages/`
- Access wrappers: `guards/`
- Role pages: `admin/` and `advisor/`
- Auth/profile: `auth/`
- Shared layout: `layout/`

## Routing location

All route declarations are centralized in `src/routes/AppRoutes.jsx`.
`App.jsx` only composes top-level providers and mounts `AppRoutes`.