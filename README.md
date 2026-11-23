# ColorCraft — Architectural Interior & Exterior Colour Engine

ColorCraft is a production-ready mobile application built with React Native and Expo. It delivers curated, modern colour palettes for rooms, walls, furniture, and building exteriors using classical colour theory and deterministic recommendation rules—completely without AI, paid APIs, or external dependencies.

---

## 🏛 Architectural Highlights

- **Pure Determinism**: Identical space, style, and lighting preferences will consistently yield the exact same ranked recommendations.
- **Classical Colour Theory**: Implements the 60–30–10 interior distribution rule, complementary, analogous, monochromatic, and triadic harmonies, and WCAG luminance/contrast verification.
- **Curated Dataset**: Over 30 architectural palettes with complete 8-slot specifications (Main Wall, Secondary Wall, Accent Wall, Ceiling, Trim, Furniture, Floor, Decorative Accent).
- **Future AI / Cloud Integration Boundary**: Features an isolated service layer (`IWallColourPreviewEngine`) ready for future cloud-based inpainting or on-device segmentation without touching the recommendation engine.
- **Local Persistence**: Offline-first bookmarks and saved palettes using `@react-native-async-storage/async-storage`.
- **Side-by-Side Comparison**: Compare up to 3 palettes across all 8 architectural slots and colour temperatures.
- **Zero AI Claims**: Clear distinction between palette swatches and photograph previews with honest user-facing disclosures.

---

## 📁 Project Structure

```
color-craft/
├── app/                              # Expo Router file-based screens
│   ├── _layout.tsx                   # Root navigation stack & state hydration
│   ├── index.tsx                     # Home Dashboard & Theory Highlights
│   ├── choose-space.tsx              # Step 1: 11 Space & Room Types
│   ├── upload-photo.tsx              # Step 2: Camera / Gallery Reference Photo
│   ├── design-preferences.tsx        # Step 3: 10 Styles, Tones, Lighting & Mood
│   ├── recommendations.tsx           # Deterministically Ranked Palette List
│   ├── palette/[id].tsx              # 8-Slot Architectural Palette & 60-30-10 Bar
│   ├── saved.tsx                     # Saved Favourites with Persistence
│   └── compare.tsx                   # Multi-Palette Side-by-Side Comparison
├── src/
│   ├── engine/
│   │   ├── types.ts                  # Domain models, enums & interfaces
│   │   ├── colorTheory.ts            # WCAG contrast, luminance, HSL, hex validation
│   │   ├── paletteData.ts            # 32 Curated architectural palettes
│   │   └── recommendationEngine.ts   # Deterministic scoring & ranking engine
│   ├── store/
│   │   └── useAppStore.ts            # Zustand client state & AsyncStorage sync
│   ├── services/
│   │   └── wallPreviewEngine.ts      # Cloud / ML boundary interface
│   ├── theme/
│   │   └── theme.ts                  # Light-mode design system & typography tokens
│   ├── components/
│   │   └── common/
│   │       ├── ColorSwatch.tsx       # Swatch with copy-to-clipboard & contrast text
│   │       ├── DistributionBar.tsx   # 60–30–10 visual ratio component
│   │       ├── PaletteCard.tsx       # Interactive palette card with ribbon
│   │       ├── FilterChip.tsx        # Accessible toggle chip
│   │       └── Button.tsx            # Reusable button with variants & loading state
│   └── __tests__/
│       ├── recommendationEngine.test.ts # Math, data integrity & determinism tests
│       └── store.test.ts             # State persistence & comparison queue tests
├── app.json                          # Expo configuration
├── package.json                      # Mutually compatible dependencies
└── tsconfig.json                     # Strict TypeScript configuration
```

---

## 🧮 How the Recommendation Engine Works

Recommendations are calculated through a weighted deterministic scoring function:

$$\text{Total Score} = S_{\text{room}} + S_{\text{style}} + S_{\text{tone}} + S_{\text{lighting}} + S_{\text{size}} + S_{\text{mood}} + S_{\text{budget}}$$

1. **Room Compatibility ($S_{\text{room}} = 40$)**: Exact match awards 40 points; whole-house schemes award 30 points. Incompatible rooms are filtered out or demoted.
2. **Style Alignment ($S_{\text{style}} = 30$)**: Matches architectural style (e.g., Japandi, Indian Contemporary, Scandinavian, Industrial).
3. **Tone & Temperature ($S_{\text{tone}} = 20$)**: Matches user preferences (warm, cool, neutral, earthy, pastel, bold, light, dark).
4. **Lighting & LRV ($S_{\text{lighting}} = 10$)**: Low-light spaces score higher with high Light Reflectance Value (LRV > 70) wall planes; bright rooms benefit from glare absorption.
5. **Spatial Scaling ($S_{\text{size}} = 10$)**: Small rooms benefit from low wall-to-ceiling contrast; large rooms benefit from anchoring accent walls.
6. **Ambience & Budget ($S_{\text{mood}} = 10, S_{\text{budget}} = 5$)**: Optimizes for calmness, energy, or material finishes.

A secondary alphabetical sort by palette ID guarantees that identical inputs **never alter recommendation order**.

---

## 🚀 Running the Project

### Prerequisites
- Node.js (v18+)
- pnpm

### 1. Run Unit Tests & Typecheck
```bash
cd color-craft
pnpm test
pnpm typecheck
```

### 2. Start Expo Development Server
```bash
pnpm start
```
From the interactive terminal menu:
- Press `i` to launch in the **iOS Simulator**
- Press `a` to launch in the **Android Emulator**
- Press `w` to open in the **Web Browser**
