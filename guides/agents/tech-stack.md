# Tech Stack Strategy

## Core Technologies
- **Framework:** Astro (Static generation preferred)
- **Interactive UI:** React (Selective hydration)
- **Styling:** Tailwind CSS + ShadCN

## Hydration Strategy (Astro Islands)
**Ship HTML by default.** Only hydrate what is truly interactive.

**Directives Decision Tree:**
1. **`client:load`**: Above-the-fold critical interactivity (Navigation).
2. **`client:visible`**: Below-the-fold interactive components (Carousels, Modals).
3. **`client:idle`**: Low priority.
4. **No Directive**: Static content (even if written in React) -> Renders as plain HTML.

```astro
<!-- ✅ Good -->
<Navigation client:load />
<Footer /> <!-- Renders static HTML -->

<!-- ❌ Bad -->
<StaticContent client:load />
```

## Component Usage
- **`.astro`**: Layouts, Pages, Static content blocks.
- **`.tsx` (components/react)**: Components needing `useState`, `useEffect`, `onClick`.
- **`.tsx` (components/ui)**: Reusable primitives (Buttons, Cards).
