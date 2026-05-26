import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const umsConfig = defineConfig({
  /**
   * Tell Chakra to look for the "dark" class on <html>
   * (next-themes sets it there via attribute="class").
   * Without this Chakra's dark-mode semantic tokens won't activate.
   */
  globalCss: {
    "html, body": {
      colorScheme: "light dark",
    },
  },

  theme: {
    tokens: {
      fonts: {
        heading: { value: "'Poppins', system-ui, sans-serif" },
        body: { value: "'Poppins', system-ui, sans-serif" },
        mono: { value: "'JetBrains Mono', monospace" },
      },

      fontWeights: {
        light: { value: "300" },
        normal: { value: "400" },
        medium: { value: "500" },
        semibold: { value: "600" },
        bold: { value: "700" },
        extrabold: { value: "800" },
      },

      colors: {
        // ── Primary — deep navy #004371 ──────────────────────
        primary: {
          50: { value: "#E6EEF4" },
          100: { value: "#C0D5E7" },
          200: { value: "#96BBDA" },
          300: { value: "#6BA0CC" },
          400: { value: "#4888BF" },
          500: { value: "#1A70B1" },
          600: { value: "#005A99" },
          700: { value: "#004371" },
          800: { value: "#003258" },
          900: { value: "#001E35" },
          950: { value: "#000F1C" },
        },

        // ── Secondary — teal #21BFC2 ─────────────────────────
        secondary: {
          50: { value: "#E8FAFA" },
          100: { value: "#C2F2F2" },
          200: { value: "#8DE6E7" },
          300: { value: "#57D9DB" },
          400: { value: "#2FCCCE" },
          500: { value: "#21BFC2" },
          600: { value: "#1A979A" },
          700: { value: "#136E70" },
          800: { value: "#0D4748" },
          900: { value: "#062526" },
        },

        // ── Neutrals ─────────────────────────────────────────
        neutral: {
          0: { value: "#FFFFFF" },
          50: { value: "#F8FAFC" },
          100: { value: "#F1F5F9" },
          200: { value: "#E2E8F0" },
          300: { value: "#CBD5E1" },
          400: { value: "#94A3B8" },
          500: { value: "#64748B" },
          600: { value: "#475569" },
          700: { value: "#334155" },
          800: { value: "#1E293B" },
          900: { value: "#0F172A" },
          1000: { value: "#000000" },
        },
      },

      radii: {
        sm: { value: "4px" },
        md: { value: "8px" },
        lg: { value: "12px" },
        xl: { value: "16px" },
        "2xl": { value: "20px" },
      },

      shadows: {
        sm: { value: "0 1px 2px rgba(0,0,0,.06), 0 1px 3px rgba(0,0,0,.08)" },
        md: { value: "0 4px 6px rgba(0,0,0,.07), 0 2px 4px rgba(0,0,0,.06)" },
        lg: { value: "0 10px 15px rgba(0,0,0,.08), 0 4px 6px rgba(0,0,0,.05)" },
        xl: {
          value: "0 20px 25px rgba(0,0,0,.10), 0 10px 10px rgba(0,0,0,.05)",
        },
        card: {
          value: "0 1px 3px rgba(0,67,113,.08), 0 1px 2px rgba(0,67,113,.04)",
        },
        login: { value: "0 25px 60px rgba(0,15,28,.40)" },
        teal: { value: "0 4px 14px rgba(33,191,194,.35)" },
      },
    },

    // ── Semantic tokens: light + dark values ─────────────────
    semanticTokens: {
      colors: {
        // Background surfaces
        bg: {
          DEFAULT: { value: { base: "#FFFFFF", _dark: "#0F172A" } },
          subtle: { value: { base: "#F8FAFC", _dark: "#1E293B" } },
          muted: { value: { base: "#F1F5F9", _dark: "#334155" } },
          canvas: { value: { base: "#FFFFFF", _dark: "#0F172A" } },
          sidebar: { value: { base: "#001E35", _dark: "#000F1C" } },
          card: { value: { base: "#FFFFFF", _dark: "#1E293B" } },
        },

        // Text
        fg: {
          DEFAULT: { value: { base: "#1E293B", _dark: "#F1F5F9" } },
          muted: { value: { base: "#64748B", _dark: "#94A3B8" } },
          subtle: { value: { base: "#94A3B8", _dark: "#64748B" } },
          inverted: { value: { base: "#FFFFFF", _dark: "#0F172A" } },
        },

        // Borders
        border: {
          DEFAULT: { value: { base: "#E2E8F0", _dark: "#334155" } },
          muted: { value: { base: "#F1F5F9", _dark: "#1E293B" } },
          strong: { value: { base: "#CBD5E1", _dark: "#475569" } },
        },

        // Brand shortcuts
        brand: {
          solid: { value: { base: "#004371", _dark: "#4888BF" } },
          hover: { value: { base: "#003258", _dark: "#6BA0CC" } },
          subtle: { value: { base: "#E6EEF4", _dark: "#001E35" } },
          muted: { value: { base: "#C0D5E7", _dark: "#003258" } },
          text: { value: { base: "#004371", _dark: "#96BBDA" } },
        },

        teal: {
          solid: { value: { base: "#21BFC2", _dark: "#2FCCCE" } },
          hover: { value: { base: "#1A979A", _dark: "#21BFC2" } },
          subtle: { value: { base: "#E8FAFA", _dark: "#062526" } },
          muted: { value: { base: "#C2F2F2", _dark: "#0D4748" } },
          text: { value: { base: "#136E70", _dark: "#57D9DB" } },
        },
      },
    },

    recipes: {
      button: {
        base: {
          fontFamily: "body",
          fontWeight: "600",
          borderRadius: "md",
          letterSpacing: "0.01em",
          transition: "all 0.18s ease",
          _focusVisible: {
            outline: "2px solid",
            outlineColor: "primary.400",
            outlineOffset: "2px",
          },
        },
        variants: {
          variant: {
            solid: {
              bg: "brand.solid",
              color: "white",
              _hover: { bg: "brand.hover", shadow: "md" },
              _active: { bg: "primary.900" },
            },
            teal: {
              bg: "teal.solid",
              color: "white",
              _hover: { bg: "teal.hover", shadow: "teal" },
              _active: { bg: "secondary.700" },
            },
            outline: {
              bg: "transparent",
              color: "brand.text",
              borderColor: "brand.solid",
              borderWidth: "1.5px",
              _hover: { bg: "brand.subtle" },
            },
            "outline-teal": {
              bg: "transparent",
              color: "teal.text",
              borderColor: "teal.solid",
              borderWidth: "1.5px",
              _hover: { bg: "teal.subtle" },
            },
            ghost: {
              color: "fg.muted",
              _hover: { bg: "bg.muted", color: "fg.DEFAULT" },
            },
            danger: {
              bg: { base: "#FFF1F2", _dark: "#2D0A10" },
              color: { base: "#BE123C", _dark: "#FDA4AF" },
              borderColor: { base: "#FECDD3", _dark: "#9F1239" },
              borderWidth: "1px",
              _hover: { bg: { base: "#FFE4E8", _dark: "#3D0D16" } },
            },
          },
        },
      },

      card: {
        base: {
          bg: "bg.card",
          borderRadius: "xl",
          border: "1px solid",
          borderColor: "border.DEFAULT",
          shadow: "card",
          overflow: "hidden",
        },
      },

      badge: {
        base: {
          fontFamily: "body",
          fontWeight: "500",
          borderRadius: "full",
          fontSize: "11px",
          px: "8px",
          py: "2px",
          letterSpacing: "0.01em",
        },
        variants: {
          variant: {
            primary: { bg: "brand.subtle", color: "brand.text" },
            secondary: { bg: "teal.subtle", color: "teal.text" },
            success: {
              bg: { base: "#F0FDF4", _dark: "#052e16" },
              color: { base: "#15803D", _dark: "#86efac" },
            },
            warning: {
              bg: { base: "#FFFBEB", _dark: "#1c1400" },
              color: { base: "#B45309", _dark: "#fcd34d" },
            },
            danger: {
              bg: { base: "#FFF1F2", _dark: "#2D0A10" },
              color: { base: "#BE123C", _dark: "#FDA4AF" },
            },
            neutral: { bg: "bg.muted", color: "fg.muted" },
          },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, umsConfig);
