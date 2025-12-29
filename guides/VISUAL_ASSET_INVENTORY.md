# BDKinc Visual Assets Inventory (What We Need + Status)

Use this guide to track which images/illustrations/visuals we need, where they belong in the site, and their current status (placeholder vs final). It is intentionally lightweight and actionable.

**Use this for:** asset requests, status tracking, art direction notes.

**Not for:** UI implementation details (see `guides/DESIGN_GUIDE.md`) or marketing messaging (see `guides/MESSAGING_FRAMEWORK.md`).

## 1. Aesthetic Direction: "Executive Confidence"

The visual identity for BDKinc must strictly adhere to existing brand guidelines while elevating the presentation to appeal to professional IT decision-makers (CIOs, CTOs, IT Directors).

### Concept: "Structure & Insight"

- **Structure**: Represents the MSP/Infrastructure side. Clean lines, solid foundations, reliability.
- **Insight**: Represents the Dev Shop/AI side. Data visualization, clear metrics, strategic value.

## 2. Brand Constraints (STRICT)

- Implementation details and design rules live in `guides/DESIGN_GUIDE.md`.
- **Typography**: Must remain **Montserrat** for headings/display and **Open Sans** for body text.
- **Colors**: Must preserve the existing primary cyan as defined in `src/styles/global.css`.

## 3. Asset Inventory (Placeholders to Replace)

### 2.1 Hero Assets (High Priority)

| Location            | Asset Type         | Concept                                                                          | Status                  |
| ------------------- | ------------------ | -------------------------------------------------------------------------------- | ----------------------- |
| Homepage Hero       | Interactive Canvas | Subtle, abstract data flow or network topology. Clean and professional.          | Existing (Needs Polish) |
| Service: Managed IT | Illustration/Photo | Professional enterprise environment or abstract network visualization.           | Placeholder             |
| Service: Cloud      | Illustration       | Clean, architectural representation of hybrid cloud infrastructure.              | Placeholder             |
| Service: Dev Shop   | UI Mockup          | High-fidelity dashboard or application interface showing business value/metrics. | Placeholder             |

### 2.2 Global Design Elements

- **Typography**: Must remain Montserrat (headings/display) and Open Sans (body).
- **Iconography**: Standardize on Phosphor Icons (Pi) for a clean, professional look.

## 3. Component Enhancements

### 3.1 Trust Badge System

- A clean, horizontal scrolling ticker or a structured grid. Professional and understated.

### 3.2 Service Cards

- Use subtle depth (shadows/glassmorphism) rather than "tech" effects.
- Focus on content hierarchy and clear calls to action.
- Hover effects should be smooth lifts or subtle glow, not "glitch" or "scanline".

### 3.3 The "Eastern Shore" Accent

- Subtle map coordinates of Easton, MD (38.7743° N, 76.0763° W) as decorative text elements in the background.
- Stylized Maryland Eastern Shore coastline outline as a very faint watermark in large sections.

## 4. Implementation Notes

- Any UI styling rules (borders, glows, motion, component patterns) should live in `guides/DESIGN_GUIDE.md`.
- Keep this document focused on _what assets we need_, _where they go_, and _their status_.
