# <span class="font-display font-extrabold">BDKinc</span> Website

A modern, technical-themed website for <span class="font-display font-extrabold">BDKinc</span> built with Astro, React, and Tailwind CSS.

## Tech Stack

- **Astro 5.x** - Static site generator with islands architecture
- **React 19** - For interactive components
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **React Bits** - Animation library for smooth interactions
- **TypeScript** - Type safety throughout

## Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn components (Button, Card, etc.)
│   │   ├── react/           # React components
│   │   └── Navigation.tsx   # Main navigation
│   ├── layouts/
│   │   └── Layout.astro     # Base layout
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── pages/
│   │   ├── index.astro      # Homepage
│   │   ├── services.astro   # Services page
│   │   ├── about.astro      # About page
│   │   └── contact.astro    # Contact page
│   └── styles/
│       └── global.css       # Global styles with technical theme
└── public/                  # Static assets
```

## Getting Started

### Development

```bash
npm run dev
```

Visit http://localhost:4321

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Design System

### Colors

The site uses a dark technical theme inspired by modern dev tools:

- **Primary**: `#00d4ff` (Cyan blue)
- **Secondary**: `#7c3aed` (Purple)
- **Background**: `#0a0e27` (Dark navy)
- **Surface**: `#111827` (Dark gray)

### Components

All UI components are in `/src/components/ui/` and use the `cn()` utility for class merging.

### Animations

React Bits is installed and ready to use for advanced animations. Import from `react-bits`.

## Pages

- **Homepage** - Hero section, services overview, testimonials, CTA
- **Services** - Detailed service descriptions
- **About** - Company history and mission
- **Contact** - Contact form and location info

## Customization

### Theme

Edit `/src/styles/global.css` to customize the color theme and global styles.

### Navigation

Update `/src/components/Navigation.tsx` to modify navigation items.

### Components

Add new shadcn components by creating them in `/src/components/ui/`.

## Next Steps

1. Replace placeholder content with actual company information
2. Add real testimonials and case studies
3. Integrate contact form with backend/email service
4. Add more React Bits animations for enhanced interactivity
5. Optimize images and assets
6. Set up SEO metadata
7. Configure deployment (Vercel, Netlify, etc.)

## Learn More

- [Astro Documentation](https://docs.astro.build)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [React Bits](https://react-bits.dev)
