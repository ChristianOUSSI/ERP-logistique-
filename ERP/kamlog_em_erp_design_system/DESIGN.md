---
name: KAMLOG EM-ERP Design System
colors:
  surface: '#f9f9ff'
  surface-dim: '#d8d9e3'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3fd'
  surface-container: '#ecedf7'
  surface-container-high: '#e6e7f2'
  surface-container-highest: '#e1e2ec'
  on-surface: '#191b23'
  on-surface-variant: '#424754'
  inverse-surface: '#2e3038'
  inverse-on-surface: '#eff0fa'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  primary: '#0058be'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#924700'
  on-tertiary: '#ffffff'
  tertiary-container: '#b75b00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  background: '#f9f9ff'
  on-background: '#191b23'
  surface-variant: '#e1e2ec'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-base:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-data:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-margin: 2rem
  gutter: 1.5rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 1.5rem
  grid-row-height: 40px
---

## Brand & Style
The design system for this ERP is built on the principles of **Efficiency, Precision, and Modular Clarity**. As a mission-critical tool for logistics and port management, the UI prioritizes high-density information processing while maintaining a low cognitive load. 

The visual style is **Corporate Modern**, blending the systematic reliability of enterprise software with the refined aesthetics of modern SaaS. It utilizes a modular color-coding architecture to provide immediate mental shortcuts for users navigating between diverse functional modules (Transport, Finance, Parc, etc.). The interface is characterized by a "Glass-and-Grid" approach: structured, high-contrast data containers paired with subtle depth to guide the user's focus through complex workflows.

## Colors
This design system uses a **Functional Palette**. Color is not merely decorative but acts as a wayfinding mechanism. Each module has a dedicated "Signature Hue" used for its header accents, active states, and primary actions within that context.

- **Neutral Scale:** Uses a cool-gray palette (Slate) to ensure data tables and text remain highly legible.
- **Surface Colors:** Backgrounds use a very light gray (`#F8FAFC`) to provide contrast against white (`#FFFFFF`) card-based containers.
- **Semantic Status:** Critical for logistics. "Normal" (Green), "Endommagé" (Orange), and "Périmé" (Red) are mapped to consistent status tokens across all modules to ensure safety and compliance at a glance.

## Typography
**Inter** is the primary typeface for its exceptional legibility in data-heavy environments. The hierarchy is tight and disciplined.

- **Data Grids:** Use `body-sm` for standard cell content to maximize information density without sacrificing readability.
- **Transaction Codes:** Transaction codes (e.g., "KM24") and ID numbers should utilize a monospaced font (JetBrains Mono) to prevent character confusion and ensure vertical alignment in lists.
- **Micro-copy:** `label-caps` is reserved for table headers and section labels to create a clear visual distinction from the data itself.

## Layout & Spacing
The design system employs a **Fixed-Fluid Hybrid Grid**. 
- **Navigation:** A fixed 260px sidebar for primary module navigation.
- **Content:** A fluid 12-column grid with a maximum scale-out for ultra-wide monitors (common in logistics control rooms).
- **Density:** The system supports "Comfortable" and "Compact" modes. Default row heights for data grids are 40px, providing enough click-target area for touch-enabled tablets while maintaining professional density.
- **Forms:** Multi-column form layouts should span 2 or 3 columns depending on field length (e.g., "Quantity" is 1 column, "Description" is 2 columns).

## Elevation & Depth
Elevation in this design system is used to separate the global navigation from the workspace and the workspace from temporary overlays (modals/drawers).

- **Level 0 (Background):** `#F8FAFC`  The canvas.
- **Level 1 (Cards):** White background with a 1px border (`#E2E8F0`) and a subtle "Soft Shadow" (Y: 1px, Blur: 3px, Opacity: 0.05).
- **Level 2 (Hover/Active):** Slightly deeper shadow to indicate interactivity.
- **Level 3 (Modals/Popovers):** Higher elevation (Y: 10px, Blur: 20px, Opacity: 0.1) with a 40% backdrop blur (Glassmorphism) to keep the underlying context visible but non-distracting.

## Shapes
The shape language is **Professional and Precise**. 
- **Standard Radius:** 0.25rem (4px) for buttons, input fields, and internal UI elements. This maintains a sharp, technical feel.
- **Card Radius:** 0.5rem (8px) for main containers to provide a modern, organized structure.
- **Status Pills:** Fully rounded (pill-shaped) to distinguish status indicators from clickable buttons.

## Components
### Data Grids & Tables
- **Headers:** Sticky headers with a subtle bottom border. Text is `label-caps` in Slate-500.
- **Cells:** High-contrast text on white. Alternating row stripes (Zebra striping) are used only in "Compact" mode.
- **Interactive Cells:** Action icons (Edit, Delete, View) appear on row hover to reduce visual clutter.

### Search Bar (T-Code Support)
- **Structure:** Global search bar positioned in the top-right or header. 
- **Behavior:** Explicit support for Transaction Codes. When a user types a 4-character code (e.g., "KM24"), a specific "Quick Jump" visual hint appears in the dropdown.

### Buttons
- **Primary:** Filled with the module's signature color.
- **Secondary:** Outlined with a 1px border of the module's signature color.
- **Tertiary:** Ghost style for low-priority actions.

### Multi-step Forms
- **Progress Indicator:** Horizontal stepper at the top of the card. Steps are numbered and use the module's signature color for the active state.
- **Sticky Footer:** Form actions (Back, Save, Continue) are pinned to the bottom of the viewport or card container to ensure they are always accessible.

### Alerts & Status Indicators
- **Normal:** Badge with light green background and dark green text.
- **Endommagé:** Badge with light orange background and deep orange text.
- **Périmé:** Badge with light red background and dark red text.