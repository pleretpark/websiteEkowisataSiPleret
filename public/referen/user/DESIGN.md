---
name: Aquatic Harmony
colors:
  surface: '#faf9f4'
  surface-dim: '#dbdad5'
  surface-bright: '#faf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f4ef'
  surface-container: '#efeee9'
  surface-container-high: '#e9e8e3'
  surface-container-highest: '#e3e3de'
  on-surface: '#1b1c19'
  on-surface-variant: '#3d4947'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f1ec'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a61'
  primary: '#00685f'
  on-primary: '#ffffff'
  primary-container: '#008378'
  on-primary-container: '#f4fffc'
  inverse-primary: '#6bd8cb'
  secondary: '#00668a'
  on-secondary: '#ffffff'
  secondary-container: '#40c2fd'
  on-secondary-container: '#004d6a'
  tertiary: '#3d6700'
  on-tertiary: '#ffffff'
  tertiary-container: '#528115'
  on-tertiary-container: '#f9ffea'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#c4e7ff'
  secondary-fixed-dim: '#7bd0ff'
  on-secondary-fixed: '#001e2c'
  on-secondary-fixed-variant: '#004c69'
  tertiary-fixed: '#bbf37c'
  tertiary-fixed-dim: '#a0d663'
  on-tertiary-fixed: '#0f2000'
  on-tertiary-fixed-variant: '#2e4f00'
  background: '#faf9f4'
  on-background: '#1b1c19'
  surface-variant: '#e3e3de'
typography:
  display-lg:
    fontFamily: Lexend
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Lexend
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Lexend
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Lexend
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Lexend
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The design system is centered on the intersection of community-driven aquaculture and local wisdom. It evokes a sense of serenity, sustainability, and approachability, tailored for a target audience that ranges from local MSME (UMKM) owners to eco-conscious tourists. 

The visual style is a fusion of **Modern Minimalism** and **Glassmorphism**, emphasizing organic movement and transparency. The UI should feel as fluid as water, utilizing soft layers and generous whitespace to reduce cognitive load while fostering a friendly, communal atmosphere.

## Colors

The palette is derived from the freshwater ecosystem. 
- **Primary (Teal):** Used for main actions and branding, representing deep freshwater and stability.
- **Secondary (Azure/Cyan):** Used for highlights, accents, and interactive feedback, representing clarity and movement.
- **Tertiary (Moss/Sage):** Used for nature-related labels and sustainability indicators.
- **Neutral (Cream/Beige):** The primary background color to provide a warmer, more organic feel than pure white, reducing eye strain.

State colors (Success, Warning, Error) should be softened to match the organic tone, utilizing pastel variations of standard semantic hues.

## Typography

Lexend is selected for its exceptional readability and friendly, open character widths, which align with the accessible nature of MSME platforms. 

- **Headlines:** Use Bold or SemiBold weights with tighter letter spacing for a modern, impactful look.
- **Body Text:** Use Regular weight with generous line height (1.5x) to ensure legibility during long-form reading about local wisdom or product descriptions.
- **Labels:** Use Medium weight for small UI elements like badges and button text to maintain clarity at smaller scales.

## Layout & Spacing

The design system utilizes a **Fluid Grid** with a soft, 8px-based rhythmic scale. 
- **Desktop:** 12-column grid with 40px margins and 24px gutters.
- **Tablet:** 8-column grid with 24px margins.
- **Mobile:** 4-column grid with 16px margins.

Layouts should favor **Floating Containers** that overlap slightly to create depth. Use asymmetrical positioning for images and cards to mimic the organic, non-linear patterns found in nature.

## Elevation & Depth

Hierarchy is established through **Ambient Shadows** and **Glassmorphism**. 

- **Surface Level 0:** The soft cream background.
- **Surface Level 1 (Cards/Containers):** Pure white or ultra-soft teal tint (#F0FDFA) with a large, low-opacity shadow (e.g., `box-shadow: 0 20px 40px rgba(13, 148, 136, 0.08)`).
- **Surface Level 2 (Overlays/Modals):** Glassmorphic surfaces with a `backdrop-filter: blur(12px)` and a subtle 1px white border at 20% opacity. 

Shadows should never be pure black; they should carry a hint of the primary teal or secondary blue to maintain the "Aquatic" theme.

## Shapes

The shape language is defined by extreme roundedness. 
- **Main Cards:** Use 32px (`rounded-3xl`) to create a soft, safe, and modern container.
- **Secondary Elements:** Small UI components like tags or nested inputs use 16px.
- **Buttons/Interactive:** Strictly pill-shaped (full radius) to encourage touch and interaction.

## Components

### Buttons
Primary buttons are pill-shaped, using the Primary Teal with white text. Secondary buttons utilize a subtle Azure ghost-style or a soft-tinted background. Use a gentle "lift" animation (shadow increase and slight Y-axis shift) on hover.

### Cards
Cards are the primary vehicle for MSME products. They must feature a high border radius (32px), a subtle 1px border (`#E2E8F0`), and the signature ambient shadow. Product images within cards should also follow the high roundedness or use organic mask shapes (blobs).

### Chips & Badges
Used for categories like "Freshwater," "Organic," or "Local Craft." These should be pill-shaped with low-saturation backgrounds derived from the primary or tertiary colors.

### Input Fields
Inputs use a soft white fill with a 16px radius. On focus, the border transitions to Primary Teal with a subtle outer glow (glow color matches the Azure secondary).

### Navigation
The navigation bar should be a floating glassmorphic element, pinned to the top with a significant blur effect, allowing the background colors of the page to bleed through as the user scrolls.