import { forwardRef } from "react";
import {
  Button as ChakraButton,
  type ButtonProps as ChakraButtonProps,
} from "@chakra-ui/react";

export type ButtonVariant =
  | "solid"
  | "teal"
  | "outline"
  | "outline-teal"
  | "ghost"
  | "danger";

interface ButtonProps extends Omit<
  ChakraButtonProps,
  "variant" | "colorPalette"
> {
  variant?: ButtonVariant;
  loading?: boolean;
  buttonType?: "primary" | "secondary";
  height?: number;
  radius?: number;
}

const VARIANT_MAP: Record<
  ButtonVariant,
  {
    chakraVariant: ChakraButtonProps["variant"];
    css?: React.CSSProperties;
  }
> = {
  solid: {
    chakraVariant: "solid",
    css: {
      background: "#004371",
      color: "#ffffff",
    },
  },
  teal: {
    chakraVariant: "solid",
    css: {
      background: "#21BFC2",
      color: "#ffffff",
    },
  },
  outline: {
    chakraVariant: "outline",
    css: {
      borderColor: "#004371",
      color: "#004371",
      background: "transparent",
    },
  },
  "outline-teal": {
    chakraVariant: "outline",
    css: {
      borderColor: "#21BFC2",
      color: "#1A979A",
      background: "transparent",
    },
  },
  ghost: {
    chakraVariant: "ghost",
    css: {
      color: "#64748B",
      background: "transparent",
    },
  },
  danger: {
    chakraVariant: "outline",
    css: {
      background: "#FFF1F2",
      color: "#BE123C",
      borderColor: "#FECDD3",
    },
  },
};

const SECONDARY_CSS: React.CSSProperties = {
  background: "transparent",
  borderColor: "#004371",
  borderWidth: "2px",
  color: "#004371",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "solid",
      loading,
      children,
      style,
      buttonType,
      height = 42,
      radius = 15,
      ...rest
    },
    ref,
  ) => {
    const { chakraVariant, css: variantCss } = VARIANT_MAP[variant];

    const resolvedCss =
      buttonType === "secondary"
        ? { ...variantCss, ...SECONDARY_CSS }
        : variantCss;

    return (
      <ChakraButton
        ref={ref}
        variant={chakraVariant}
        loading={loading}
        style={{ ...resolvedCss, ...style }}
        {...rest}
        borderRadius={radius + "px"}
        height={height + "px"}
      >
        {children}
      </ChakraButton>
    );
  },
);

Button.displayName = "Button";
