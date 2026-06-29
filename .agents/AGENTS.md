# Component Standardization Rules

Every time you create a new page, grid, or component, you MUST:
1. Standardize the design to match existing components (e.g., `Courses.tsx`, `Curriculums.tsx`).
2. Use the same layout structure, including the `flex flex-col gap-10 md:gap-15` wrapper and header logic.
3. Use the common UI components (`Button`, `Select`, `Input` from `src/shared/ui/`) rather than raw HTML tags or unstyled elements.
4. Keep the styling, spacing, and icon usage consistent with the rest of the application.

# Translation and Localization Rules

Every time you develop a new feature, page, or component, you MUST:
1. Always add the new string translation keys (e.g., page titles, labels, buttons) to all localization files (`en.json` and `fr.json`).
2. Never hardcode English or French strings in the components; always use the `t()` function from `react-i18next`.
