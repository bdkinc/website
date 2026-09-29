# Tech Stack Strategy

Applies to `apps/bdkinc` and temporary Astro review frontends `apps/design-editorial` (light) and `apps/design-systems` (dark). Keep PHP/WP-CLI for `apps/wp-cms` inside Docker. Coordinate content-model changes through `packages/content`.

## Core technologies

- App-local Astro 7 and Node adapter 11 are used (lockfile currently resolves Astro 7.3.5 and the adapter 11.1.6; manifest ranges are not installed pins, so consult the lockfile rather than quoting point versions). Node follows root `engines` (^22.18 || ^24.11 || >=26.0.0); the main app Dockerfile uses Node 24. Use workspace scripts rather than the potentially different root-hoisted Astro executable.
- npm workspaces are retained. Root `vite-plus@1.0.0` is installed and root/workspace `vite` specs resolve to the `npm:@voidzero-dev/vite-plus-core@1.0.0` alias. Root scripts delegate with `vp run <workspace>#<script>` (for example `vp run @bdkinc/bdkinc#dev`); workspace commands themselves remain `astro dev` / `astro build` / `astro preview` / `astro check`, not generic `vp dev`/`vp build`. ESLint + Prettier are retained for Astro support.
- Most public pages are prerendered. Contact, private previews, and media endpoints require the Node server runtime.
- All three sites support selective React islands through `@astrojs/react` 7 with `compiler: true`. This enables the Oxc React Compiler (`oxc-transform-react@0.145.0`, matched peers) on client React code; it does not compile Astro templates and is distinct from Vite+. It does not replace Astro with Vite+.
- React styling uses the StyleX Vite unplugin (0.19+) with extracted CSS in all three apps. Main-site config orders the generated layer after theme/base/components and before utilities (`@layer theme, base, components, stylex, utilities`); review apps use the same `stylex` prefix with smaller `before` sets. When the client bundle has no CSS asset, the unplugin `writeBundle` fallback emits the collected client rules to the stable vendor-defined path `assets/stylex.css`; `Layout.astro` links that fallback PROD-only via `import.meta.env.BASE_URL` (DEV keeps the virtual `virtual:stylex.css` link/runtime). Vite keeps `cssCodeSplit: false` so builds emit merged per-entry aggregates (Astro's multiple passes surface as two identical-linkage `style.*.css` assets). Default splitting was tried and reverted: with it the unplugin `generateBundle` path injects into per-entry assets, the `writeBundle` fallback never fires, no `assets/stylex.css` is emitted, and the ContactChat client payload stays 50/172 missing with the Layout fallback link 404ing. The shared UI primitives retain their Base UI/shadcn-derived behavior plus `className`/`style`/`ref` and variant-string APIs; pass `xstyle` for migrated StyleX overrides (applied last) and keep `className` for Astro/legacy caller utility overrides. Existing main-site Astro templates and React components not yet migrated still use Tailwind; do not remove Tailwind while those consumers remain.
- WordPress published REST data is validated by `@bdkinc/content`. Shared Zod schemas live in `packages/content/src/schemas.ts`; fixed copy/media definitions live in `packages/content/editorial`. Original local content remains migration input, not runtime fallback.
- Review apps have independent templates but share content and canonical routes. All concept pages are noindex and canonicalize to the main site.

## Hydration strategy

**Ship HTML by default.** Only hydrate genuinely interactive components. Prefer the accessible shared UI primitives where appropriate, then choose the lightest directive:

1. `client:load`: above-the-fold critical interaction, such as navigation.
2. `client:visible`: below-the-fold interaction, such as carousels and modals.
3. `client:idle`: low-priority interaction.
4. No directive: static content, including React components rendered as HTML.

Use `.astro` for layouts, pages and static blocks; `.tsx` for React interaction and UI primitives. Do not add hydration merely to render CMS copy.

## Editorial boundary

Marketers edit labeled copy/media fields and limited safe Gutenberg blog prose. Layout, section structure, order, icons and routes stay in code. There is no page builder, JSON editor or ACF Pro requirement. Existing ContactChat remains simulated; CMS integration does not add lead delivery.

For content changes read [shared contracts](../../packages/content/README.md); for authoring and preview read [WordPress setup](../../apps/wp-cms/README.md). Branding continues to follow `guides/`.
