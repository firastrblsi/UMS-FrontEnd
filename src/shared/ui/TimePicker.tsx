import { forwardRef } from 'react';
import { Field, Input as ChakraInput, type InputProps as ChakraInputProps } from "@chakra-ui/react";
import { Clock } from 'lucide-react';

interface TimePickerProps extends ChakraInputProps {
  label?: string;
  error?: string;
  required?: boolean;
}

export const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(
  ({ label, error, required, ...rest }, ref) => {
    return (
      <Field.Root invalid={!!error} required={required} className="w-full relative">
        {label && (
          <Field.Label className="text-sm ms-2 text-slate-700 font-medium">
            {label}
          </Field.Label>
        )}
        
        <div className="relative w-full">
          {/* Custom Clock Icon overlay */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 z-10">
            <Clock size={18} />
          </div>
          
          <ChakraInput
            ref={ref}
            type="time"
            {...rest}
            height="43px"
            borderRadius="16px"
            borderColor="gray.500"
            paddingLeft="2.5rem"
            _focus={{ borderColor: "gray.900" }}
            className="w-full pr-4 bg-white text-[#1E293B] text-sm transition-colors"
            css={{
              "&::-webkit-calendar-picker-indicator": {
                background: "transparent",
                bottom: 0,
                color: "transparent",
                cursor: "pointer",
                height: "auto",
                left: 0,
                position: "absolute",
                right: 0,
                top: 0,
                width: "auto"
              }
            }}
          />
        </div>
        
        {error && (
          <div className="animate-slide-down mt-1 ms-2">
            <Field.ErrorText>{error}</Field.ErrorText>
          </div>
        )}
      </Field.Root>
    );
  }
);

TimePicker.displayName = 'TimePicker';
