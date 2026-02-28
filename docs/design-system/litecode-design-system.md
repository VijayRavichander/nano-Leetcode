# LiteCode Design System

This document captures the visual system currently used on the landing page so the rest of the product can be migrated toward the same language.

## Design Direction

The current direction is:

- warm light background
- quiet editorial typography
- minimal chrome
- restrained accent usage
- generous whitespace
- product-first copy

Reference style family:

- `benji.org` for density, restraint, and whitespace
- `agentation.dev` for hero typography treatment and accent handling

This is not a generic SaaS system. It should feel calm, sharp, and intentional.

## Core Principles

1. Keep the page quiet.
2. Let whitespace do most of the work.
3. Use typography, not decoration, as the primary visual tool.
4. Use color sparingly and with clear purpose.
5. Prefer one strong idea per section.
6. Keep UI readable before making it expressive.

## Color System

These landing variables are defined in [globals.css](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/apps/web/app/globals.css#L39).

| Token | Value | Role |
| --- | --- | --- |
| `--landing-bg` | `#f5f3ee` | main page background, warm paper tone |
| `--landing-surface` | `#f8f6f2` | cards, pills, dropdowns, soft surfaces |
| `--landing-text` | `#171717` | primary text |
| `--landing-muted` | `#8a867d` | secondary text, metadata, support copy |
| `--landing-border` | `#ddd8cf` | low-contrast borders and dividers |
| `--landing-accent-blue` | `#cfd8ff` | hero highlight, subtle emphasis |
| `--landing-accent-blue-strong` | `#6f86ff` | reserved stronger accent if needed |
| `--landing-accent-red` | `#e26a5a` | underline accent, tiny moments of emphasis |
| `--landing-link` | `#171717` | links and CTA text |

### Color Rules

- Backgrounds should feel warm, not stark white.
- Main text should be nearly black, never gray enough to feel weak.
- Muted text should stay readable and deliberate.
- Blue accent should be rare.
- Red accent should be rarer.
- Borders should separate, not decorate.

### Avoid

- neon accents
- purple-heavy branding
- strong gradients
- glassmorphism
- large glows
- dark charcoal marketing surfaces on light pages

## Typography

Font setup is defined in [layout.tsx](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/apps/web/app/layout.tsx#L7).

### Font Families

- `Inter`
  - default body font
  - nav
  - buttons
  - form labels
  - tables
  - cards
  - app UI
- `IBM Plex Serif`
  - reserved for large marketing headlines only
  - use sparingly

### Typography Rules

- Body/UI should mostly use `Inter`.
- Serif should not appear in dense product UI.
- Avoid all-caps in this system.
- Avoid overly bold display treatment.
- Use slightly negative tracking only on large headlines.
- Keep body copy readable with relaxed line-height.

### Recommended Type Roles

| Role | Font | Guidance |
| --- | --- | --- |
| Hero headline | `IBM Plex Serif` | large, editorial, high impact |
| Section label / kicker | `Inter` | small, muted, understated |
| Body copy | `Inter` | normal weight, relaxed leading |
| Nav and CTA | `Inter` | medium weight |
| Product UI headings | `Inter` | medium weight, not display-like |

## Layout

Key helpers are defined in [globals.css](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/apps/web/app/globals.css#L138).

### Containers

- `landing-container`
  - max width: `76rem`
  - horizontal padding: `1.5rem` mobile, `2rem` desktop
- `landing-narrow`
  - max width: `46rem`
  - used for editorial reading width

### Layout Rules

- Keep primary marketing content in a narrow measure.
- Resist full-width content unless it is structurally necessary.
- Prefer one-column reading flow for copy-led sections.
- Use wide spacing between major sections and tight spacing within a section.

## Spacing

This system relies more on spacing than decoration.

### General Rhythm

- top-level page sections: large vertical spacing
- internal text stacks: `mt-2`, `mt-4`, `mt-8` style rhythm
- nav and footer: compact but not cramped

### Practical Guidance

- Give headlines room above and below.
- Do not crowd buttons directly under long paragraphs.
- Keep cards from touching the viewport edges.
- Avoid dense multi-card grids unless the content truly needs them.

## Shape Language

### Radii

- buttons: `8px`
- panels/cards: `10px` to `14px`
- avatar/pill-only elements: `9999px` when necessary

### Shape Rules

- Prefer soft corners, not hard rectangles.
- Do not overuse pills.
- Use rounded-full only for small controls, not large page structures.

## Borders and Shadows

### Borders

- Use `--landing-border` almost everywhere.
- Borders should be subtle and low contrast.
- Borders are structural, not ornamental.

### Shadows

- Very light shadow only on floating surfaces or dropdowns.
- Example current treatment:
  - proof card: soft, low-opacity shadow
  - dropdown: slightly elevated but still subtle

### Avoid

- hard shadows
- dark lifted cards
- inset glow effects
- layered bevel systems on light marketing pages

## Motion

Motion is intentionally minimal.

Current landing motion is defined in [globals.css](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/apps/web/app/globals.css#L226).

### Allowed Motion

- short fade-up on page load
- subtle hover color changes
- gentle state transitions on controls

### Motion Rules

- entrance durations: around `180ms`
- hover transitions: around `120ms`
- use `ease` or restrained `ease-out`
- prefer opacity and very small translate values

### Avoid

- large stagger chains
- floating decorations
- bouncy marketing motion
- moving backgrounds
- strong parallax

Reduced motion support should remain in place.

## Component Patterns

## Navbar

Current landing navbar lives in [Navbar.tsx](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/apps/web/components/Navbar.tsx#L138).

Rules:

- align to the same container width as page content
- use a plain wordmark
- keep the right side sparse
- use one understated action
- logged-in and logged-out states should share the same visual language

Avoid:

- heavy top bars
- dark nav shells on light pages
- multiple competing CTAs

## Buttons and Links

Current landing button style is defined in [globals.css](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/apps/web/app/globals.css#L198).

Rules:

- primary CTA can be lightly bordered rather than heavily filled
- secondary actions should often be text links
- hover should slightly adjust border or surface, not transform heavily
- labels should be sentence case

## Panels and Proof Blocks

Current example is in [page.tsx](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/apps/web/app/page.tsx#L42).

Rules:

- use one clean bordered surface
- keep internal hierarchy obvious
- avoid dashboard complexity
- do not stack too many nested containers

## Dropdowns

Current landing dropdown variant lives in [ActionDropDown.tsx](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/apps/web/components/ActionDropDown.tsx#L21).

Rules:

- dropdown trigger should match surrounding page surfaces
- menu background should use `--landing-surface`
- border should stay subtle
- menu items should highlight with light surface changes, not dark inversion

## Footer

Current landing footer is in [Footer.tsx](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/apps/web/components/Footer.tsx#L11).

Rules:

- keep it to one line or one short stack
- use muted copy
- avoid large sitemap-style layouts unless truly needed

## Copywriting Tone

The current landing copy direction is:

- product-focused
- calm
- direct
- low-hype
- confidence-oriented

### Good Tone

- “Turn patterns into confidence.”
- “Built for steady practice.”
- “Explore problems.”

### Avoid

- talking too much about the interface itself
- vague startup phrases
- aggressive productivity language
- exaggerated claims
- clever copy that hides the product value

## Design Rules for Product Screens

When adapting the rest of the website, do not blindly copy the marketing layout. Reuse the system, not the exact page structure.

### Keep for Product Pages

- warm light surfaces
- restrained borders
- `Inter` as default UI font
- sparse accent usage
- cleaner spacing
- calmer dropdowns, forms, and panels

### Use More Carefully in Product Pages

- serif headlines
- red underline accent
- highlighted text treatments

These should stay mostly on marketing or top-level overview pages.

## Migration Guidance

Recommended order for restyling the full app:

1. global surfaces and text colors
2. navbar, footer, dropdowns, buttons
3. cards, panels, and forms
4. problem list page
5. problem detail workspace chrome
6. auth and profile pages

## Implementation Notes

The current landing implementation uses:

- custom landing variables in [globals.css](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/apps/web/app/globals.css#L39)
- `Inter` and `IBM Plex Serif` in [layout.tsx](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/apps/web/app/layout.tsx#L7)
- landing-only component branching in:
  - [Navbar.tsx](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/apps/web/components/Navbar.tsx#L138)
  - [Footer.tsx](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/apps/web/components/Footer.tsx#L11)
  - [ActionDropDown.tsx](/Users/vijayravichander/Code/nano-Litecode/nano-leetcode/apps/web/components/ActionDropDown.tsx#L21)

## Quick Checklist

Before shipping any new page in this design system, check:

- Is the page background warm and calm?
- Is the typography mostly `Inter`?
- Is serif used only where it adds value?
- Are accents rare and intentional?
- Is the layout simple enough?
- Is copy focused on the product, not the UI?
- Are borders subtle?
- Is motion restrained?
- Does the page feel lighter after removing unnecessary elements?

If the answer to the last question is no, the page is probably still carrying too much visual weight.
