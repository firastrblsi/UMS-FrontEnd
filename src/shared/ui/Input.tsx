import {
  Field,
  Input as ChakraInput,
  type InputProps as ChakraInputProps,
} from "@chakra-ui/react";
import { forwardRef, useState } from "react";
import {
  PasswordInput,
  PasswordStrengthMeter,
} from "@/components/ui/password-input";
import { type Options, passwordStrength } from "check-password-strength";
import { useMemo } from "react";

interface InputProps extends ChakraInputProps {
  type?: string;
  placeholder?: string;
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  revealable?: boolean;
  showStrengthMeter?: boolean;
}

const strengthOptions: Options<string> = [
  { id: 0, value: "too-weak", minDiversity: 0, minLength: 0 },
  { id: 1, value: "weak", minDiversity: 1, minLength: 1 }, // has length but nothing else
  { id: 2, value: "medium", minDiversity: 2, minLength: 6 }, // some diversity, not long enough
  { id: 3, value: "strong", minDiversity: 3, minLength: 8 }, // meets schema: 8+ chars + uppercase + number
  { id: 4, value: "very-strong", minDiversity: 4, minLength: 10 }, // exceeds schema
];

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type,
      placeholder,
      label,
      hint,
      error,
      required,
      revealable,
      showStrengthMeter,
      onChange,
      ...rest
    },
    ref,
  ) => {
    const [passwordValue, setPasswordValue] = useState("");

    const strength = useMemo(() => {
      if (!passwordValue) return 0;
      return passwordStrength(passwordValue, strengthOptions).id;
    }, [passwordValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (showStrengthMeter) setPasswordValue(e.currentTarget.value);
      onChange?.(e);
    };
    return (
      <Field.Root invalid={!!error} required={required}>
        {label && (
          <Field.Label>
            <span className="text-sm text-neutral-800 ms-2">{label}</span>{" "}
            {required && <Field.RequiredIndicator />}{" "}
          </Field.Label>
        )}
        {revealable ? (
          <PasswordInput
            ref={ref}
            placeholder={placeholder}
            {...rest}
            _placeholder={{ fontSize: "sm" }}
            height="43px"
            borderRadius="16px"
            borderColor="gray.500"
            onChange={handleChange}
            _focus={{ borderColor: "gray.900" }}
            _hover={{ bg: "transparent" }}
          />
        ) : (
          <ChakraInput
            ref={ref}
            type={type}
            placeholder={placeholder}
            {...rest}
            onChange={handleChange}
            _placeholder={{ fontSize: "sm" }}
            height="43px"
            borderRadius="16px"
            borderColor="gray.500"
          />
        )}
        {showStrengthMeter && passwordValue.length > 0 && (
          <PasswordStrengthMeter value={strength} w="full" mt={1} />
        )}
        <div className="h-8 ms-2 -translate-y-2">
          {error && (
            <div key={error} className="animate-slide-down">
              <Field.ErrorText>{error}</Field.ErrorText>
            </div>
          )}
        </div>
        {hint && !error && (
          <Field.HelperText className="text-xs text-neutral-400">
            {hint}
          </Field.HelperText>
        )}
      </Field.Root>
    );
  },
);

export default Input;
