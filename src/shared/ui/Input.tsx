import {
  Field,
  Input as ChakraInput,
  type InputProps as ChakraInputProps,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import { PasswordInput } from "@/components/ui/password-input";

interface InputProps extends ChakraInputProps {
  type?: string;
  placeholder?: string;
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  revealable?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { type, placeholder, label, hint, error, required, revealable, ...rest },
    ref,
  ) => {
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
            _focus={{ borderColor: "gray.900" }}
          />
        ) : (
          <ChakraInput
            ref={ref}
            type={type}
            placeholder={placeholder}
            {...rest}
            _placeholder={{ fontSize: "sm" }}
            height="43px"
            borderRadius="16px"
            borderColor="gray.500"
          />
        )}
        <div className="h-8 ms-2 -translate-y-2">
          {error && <Field.ErrorText>{error}</Field.ErrorText>}
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
