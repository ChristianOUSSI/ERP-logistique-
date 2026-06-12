---
name: KAMLOG EM-ERP
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce2f3'
  on-surface: '#151c27'
  on-surface-variant: '#424754'
  inverse-surface: '#2a313d'
  inverse-on-surface: '#ebf1ff'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  primary: '#0058be'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#825100'
  on-tertiary: '#ffffff'
  tertiary-container: '#a36700'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce2f3'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
  data-tabular:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  xxs: 0.25rem
  xs: 0.5rem
  sm: 0.75rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
  gutter: 1rem
  margin-desktop: 1.5rem
  max-width: 1600px
---

## Brand & Style
This design system is engineered for high-stakes port logistics, where operational speed and data accuracy are paramount. The brand personality is rooted in **Industrial Precision**—it is systematic, resilient, and highly efficient. It avoids unnecessary decoration in favor of utility, ensuring that users can navigate complex workflows without cognitive overload.

The visual style is **Modern Corporate**, utilizing a flat design language with ample whitespace used strategically to separate dense data clusters. The interface prioritizes clear information hierarchy to support rapid decision-making in high-pressure environments like shipping terminals and warehouses. The emotional response is one of reliability and control; the UI acts as a calm, transparent window into the chaotic world of global logistics.

## Colors
The color strategy employs a modular semantic system to differentiate between various ERP functions. While the primary blue drives administrative and core interactions, the palette expands to include distinct identifiers for specific logistics domains.

- **Auth/Admin (#3B82F6):** Used for primary actions, navigation, and administrative controls.
- **Master Data (#10B981):** Signifies core records and foundational information integrity.
- **K-Transport (#F59E0B):** Applied to active logistics, movement tracking, and shipping routes.
- **K-Finance (#8B5CF6):** Dedicated to invoicing, ledgers, and budgetary modules.
- **K-Magasin (#EF4444):** Identifies inventory, warehouse management, and storage.
- **K-Parc (#06B6D4):** Used for terminal yard management and fleet tracking.
- **Alerts (#F97316):** Reserved for time-sensitive notifications and operational bottlenecks.

The background utilizes a **Surface-Container-Low (#F3F4F6)** strategy to provide a soft, non-reflective canvas that reduces eye strain during long shifts, while maintaining high contrast for text legibility.

## Typography
The typography system uses **Inter** for its exceptional legibility in high-density environments. To maximize data per square inch without sacrificing readability, the system utilizes "Tabular Figures" (`tnum`) for all numerical data in tables, ensuring columns of numbers align perfectly for rapid scanning.

The scale is intentionally compact. **Body-sm (13px)** serves as the primary size for data entry and table rows, while **Label-sm (11px uppercase)** is used for column headers and category tags. This tight vertical rhythm allows more rows of data to be visible above the fold, a critical requirement for port dispatchers and inventory managers.

## Layout & Spacing
This design system employs a **Fluid Grid** with a maximum container width of 1600px, designed primarily for 1080p and 1440p enterprise monitors. The layout uses a 12-column structure with narrow 16px (1rem) gutters to maintain a high-density feel.

A "Multi-Pane" philosophy is utilized:
1.  **Primary Sidebar:** A collapsible 240px navigation bar for high-level module switching.
2.  **Contextual Pane:** A secondary 200px rail for T-Code shortcuts and sub-module navigation.
3.  **Main Stage:** The central area for data tables and forms.

The spacing rhythm is strictly based on a **4px baseline grid**. Internal component padding is kept tight (8px-12px) to ensure that the interface remains functional on rugged tablets used in the field while appearing crisp and professional on desktop.

## Elevation & Depth
To maintain a modern, flat aesthetic, this design system moves away from heavy shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**. Depth is established through subtle shifts in background color rather than Z-axis height.

- **Level 0 (Base):** Surface-container-low (#F3F4F6) for the main application background.
- **Level 1 (Cards/Tables):** White (#FFFFFF) surfaces with a 1px border (#E5E7EB).
- **Level 2 (Popovers/Modals):** White surfaces with a very soft, diffused ambient shadow (10% opacity) to provide separation from the main stage.
- **Active State:** Module-specific colors are used for 2px left-border "active indicators" in navigation lists and sidebar items, creating clear focus without adding visual bulk.

## Shapes
The shape language is **Soft (0.25rem/4px)**. This choice balances the need for a modern, approachable UI with the structural rigidity required for complex enterprise tables. 

- **Buttons & Inputs:** Use the standard 4px radius.
- **Status Badges:** Use a fully rounded pill shape (999px) to distinguish them from interactive buttons.
- **Table Rows:** Remain sharp (0px) to ensure a seamless grid look, but the containing table card uses the 4px radius at the corners.

## Components
Consistent styling across components ensures that the user's learned behaviors in one module (like K-Finance) transfer seamlessly to others (like K-Parc).

- **High-Density Tables:** Rows are 32px-40px high. Use Zebra-striping (alternating White and #F9FAFB) for readability. Headers are sticky and use a slightly darker background (#F3F4F6).
- **T-Code Search Bar:** A prominent global search bar in the header or sidebar that accepts legacy transaction codes. It should feature an "active" focus state using the primary blue and include an icon indicating the current module context.
- **Status Badges:** Compact labels using 10% opacity versions of the module colors for backgrounds, with 100% opacity text of the same color for high contrast (e.g., K-Magasin status uses #FEE2E2 background with #EF4444 text).
- **Multi-Select Dropdowns:** Use checkboxes within the dropdown list and a "chip-cloud" in the input field to show selected items, ensuring space-efficiency.
- **Modular Sidebar:** Features high-contrast active states. When a module is active, the icon and label take on the module's specific color, supported by a 4px vertical bar on the leading edge.
- **Breadcrumbs:** Small, persistent links above page titles to provide immediate orientation within the deep ERP hierarchy.