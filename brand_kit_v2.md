# FitHubPoint Brand Kit & Design System v2.0

## 1. Core Philosophy
**Professional. Bio-Digital. High-Performance.**
The FitHubPoint aesthetic combines the organic vitality of health (Greens) with the precision of digital management (Dark, Glass, Neon). The interface should feel **premium**, **fast**, and **trustworthy**.

---

## 2. Typography
**Primary Font:** `Poppins` (Google Fonts)
*   **Weights:**
    *   `Light (300)`: Body text, secondary descriptions.
    *   `Regular (400)`: Standard input text, labels.
    *   `Medium (500)`: Buttons, navigation, subheaders.
    *   `SemiBold (600)`: Card titles, emphasized actions.
    *   `Bold (700)`: Hero headings, brand identifiers.

---

## 3. Color System

### Primary Brand Colors
| Name | Hex | Usage |
| :--- | :--- | :--- |
| **Caribbean Green** | `#00DF81` | Primary Actions, Success States, Glows, Logos. The "SaaS" energy color. |
| **Bangladesh Green** | `#03624C` | Gradients, Secondary Backgrounds, Borders. |
| **Rich Black** | `#021B1A` | Main App Background. Deep, organic dark. |

### Neural Neutrals (Dark Theme)
| Name | Hex | Usage |
| :--- | :--- | :--- |
| **Pine** | `#06302B` | Card Backgrounds, Sidebar, Popovers. |
| **Forest** | `#095544` | Borders, Input Backgrounds, Separators. |
| **Stone** | `#7D7D7D` | Placeholder text, De-emphasized labels. |
| **Anti-Flash White** | `#F1F7F6` | Primary Text, Headings. |

### Functional Colors
*   **Error:** `#EF4444` (Red-500) - Validation errors, destructive actions.
*   **Success:** `#00DF81` (Caribbean Green) - Completion, active states.
*   **Warning:** `#F59E0B` (Amber-500) - Alerts.

---

## 4. Visual Effects & Styles

### Glassmorphism (The "Premium" Touch)
Used on panels, cards, and overlays to create depth without clutter.
```css
.glass-panel {
  background: rgba(6, 48, 43, 0.4); /* Pine with opacity */
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Gradients
*   **Brand Gradient:** `linear-gradient(135deg, #03624C 0%, #00DF81 100%)`
    *   *Usage:* Primary Buttons, Logos, Active Borders.
*   **Glow Overlay:** `radial-gradient(circle, rgba(0,223,129,0.2) 0%, transparent 70%)`

### Shadows
*   **Glow:** `0 0 30px rgba(0, 223, 129, 0.5)`
    *   *Usage:* Hover states on primary buttons, active inputs.
*   **Depth:** `0 10px 30px rgba(0, 0, 0, 0.5)`
    *   *Usage:* Modals, Dropdowns.

---

## 5. Components

### Buttons
1.  **Primary:** Gradient background (`Bangladesh` -> `Caribbean`), Text `Rich Black`, Bold. Hover: Scale 1.02 + Glow.
2.  **Secondary:** Transparent background, Border `White/10`, Text `White`. Hover: `White/10` background.
3.  **Ghost:** No border, Text `Stone`. Hover: Text `White`.

### Inputs
*   **Default:** Bg `Pine/30`, Border `White/10`, Text `White`. Radius `xl`.
*   **Focus:** Border `Caribbean Green/50`, Ring `Caribbean Green/20`.
*   **Error:** Border `Red-500`.

### Layouts
*   **Split Screen:** 50/50 split for Auth pages. Left side for Branding (Darker), Right side for Interaction (Lighter/Glass).
*   **Dashboard:** Sidebar navigation (Left), Header (Top), Content (Main).

---

## 6. Implementation Checklist
- [x] Font `Poppins` configured in `layout.tsx`.
- [x] CSS Variables defined in `globals.css`.
- [x] Tailwind config (via `@theme`) extending colors.
- [x] Auth Pages using Split Layout.
