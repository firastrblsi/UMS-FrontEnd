import React from "react";
import { X } from "lucide-react";
import { Check } from "lucide-react";
import { Button } from "@/shared/ui/Button";

interface AuthFeedbackProps {
  type: "success" | "error";
  header: string;
  description: React.ReactNode;
  note?: string;
  buttonText?: string;
  secondaryButtonText?: string;
  onButtonClick?: () => void;
  onSecondaryButtonClick?: () => void;
}
const AuthFeedback = ({
  type,
  header,
  description,
  note,
  buttonText,
  secondaryButtonText,
  onButtonClick,
  onSecondaryButtonClick,
}: AuthFeedbackProps) => {
  return (
    <div className="w-[90%] sm:w-[70%] lg:w-[63%] flex flex-col gap-8 items-center text-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className={`rounded-full p-3 ${
            type === "success" ? "bg-green-100" : "bg-red-200"
          }`}
        >
          {type === "success" ? (
            <Check className="text-green-600 w-10 h-10" />
          ) : (
            <X className="text-red-600 w-10 h-10" />
          )}
        </div>
        <h1 className="text-3xl">{header}</h1>
        <p className="text-gray-600 mt-2">{description}</p>
        {note && <p className="text-sm text-gray-500">{note}</p>}
      </div>
      <div className="w-full flex flex-col gap-4">
        <Button type="button" buttonType="primary" onClick={onButtonClick}>
          {buttonText}
        </Button>
        {type === "error" && (
          <Button
            type="button"
            buttonType="secondary"
            onClick={onSecondaryButtonClick}
          >
            {secondaryButtonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AuthFeedback;
