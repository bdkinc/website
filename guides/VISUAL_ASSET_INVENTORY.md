# Visual Asset Inventory & Design Specification: BDKinc

## 1. Aesthetic Direction: "Technical Authority"
The visual identity for BDKinc must strictly adhere to existing brand guidelines while elevating the presentation.

### Concept: "The Grid & The Flow"
- **The Grid**: Represents the MSP/Infrastructure side. Structured, stable, reliable.
- **The Flow**: Represents the Dev Shop/AI side. Dynamic, fluid, innovative.

## 2. Brand Constraints (STRICT)
- **Typography**: Must remain **Montserrat** for headings/display and **Open Sans** for body text. No exceptions.
- **Colors**: Must preserve the existing **Primary Color** (`#00d4ff`) as defined in `global.css`.

## 3. Asset Inventory (Placeholders to Replace)

### 2.1 Hero Assets (High Priority)
| Location | Asset Type | Concept | Status |
|----------|------------|---------|--------|
| Homepage Hero | Interactive Canvas | Refined particle network with "data stream" trails. | Existing (Needs Polish) |
| Service: Managed IT | Illustration/Photo | High-angle shot of a clean, modern NOC (Network Operations Center). | Placeholder |
| Service: Cloud | Illustration | Abstract "layers of light" representing Private/Hybrid/Public stacks. | Placeholder |
| Service: Dev Shop | Code Visual | stylized IDE window showing BDK-branded code snippets in a technical "glow" style. | Placeholder |

### 2.2 Global Design Elements
- **Typography**: Replace generic sans-serifs with a more technical pairing:
  - **Display**: "Geist Mono" or "JetBrains Mono" for labels and accents.
  - **Heading**: "Geist" or "Space Grotesk" (used sparingly) or "Uncut Sans".
  - **Body**: "Inter" (refined) or "Hanken Grotesk".
- **Iconography**: Standardize on **Lucide** for functional UI and a custom **Duotone** style for large service icons.

## 3. Component Enhancements

### 3.1 Trust Badge System
- Instead of a simple grid, create a "rotating perimeter" or a "technical ledger" style list that feels integrated into the circuit board theme.

### 3.2 Service Cards
- Add a "micro-circuit" trace that animates on hover, connecting the icon to the title.
- Enhance the spotlight effect with a "scanning" scanline overlay.

### 3.3 The "Eastern Shore" Accent
- Subtle map coordinates of Easton, MD (38.7743° N, 76.0763° W) as decorative text elements in the background.
- Stylized Maryland Eastern Shore coastline outline as a very faint watermark in large sections.

## 4. Design Guidelines for Frontend-Specialist
- **Borders**: Use `border-primary/20` with `backdrop-blur`.
- **Glows**: Limit `shadow-[--shadow-glow]` to active interactions only to prevent visual noise.
- **Motion**: Stagger all entries with 50ms increments. Use `cubic-bezier(0.16, 1, 0.3, 1)` for all transitions.
