import { forwardRef } from "react";
import { Field, NativeSelect } from "@chakra-ui/react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  labelSize?: "sm" | "xs";
  isFilter?: boolean;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  height?: string;
  borderRadius?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      labelSize = "sm",
      isFilter = false,
      placeholder,
      options,
      value,
      onChange,
      height = "43px",
      borderRadius = "16px",
    },
    ref,
  ) => {
    const hasValue = value !== undefined && value !== "";

    return (
      <Field.Root>
        {label && (
          <Field.Label>
            <span
              className={`text-${labelSize} ${isFilter ? "translate-y-1 ms-1" : "ms-2"} text-neutral-800`}
            >
              {label}
            </span>
          </Field.Label>
        )}

        <NativeSelect.Root
          width="100%"
          style={{ height }}
        >
          <NativeSelect.Field
            ref={ref}
            value={value}
            onChange={onChange}
            style={{
              height,
              borderRadius,
              border: "1px solid var(--chakra-colors-gray-500, #718096)",
              paddingInlineEnd: "2rem",
              paddingInlineStart: "0.625rem",
              fontSize: "14px",
              backgroundColor: "#FFFFFF",
              cursor: "pointer",
              outline: "none",
              width: "100%",
              color: hasValue ? "#1E293B" : "#94A3B8",
              appearance: "none",
              WebkitAppearance: "none",
              fontFamily: "'Poppins', system-ui, sans-serif",
            }}
            _focus={{
              borderColor: "gray.900",
              boxShadow: "none",
            }}
          >
            {placeholder !== undefined && (
              <option value="" style={{ color: "#1E293B" }}>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} style={{ color: "#1E293B" }}>
                {opt.label}
              </option>
            ))}
          </NativeSelect.Field>

          <NativeSelect.Indicator
            style={{
              position: "absolute",
              right: "0.5rem",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#718096",
            }}
          />
        </NativeSelect.Root>
      </Field.Root>
    );
  },
);

Select.displayName = "Select";

export default Select;
