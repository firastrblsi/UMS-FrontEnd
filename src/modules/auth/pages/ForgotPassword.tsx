import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/shared/validation/authSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { authApi } from "../api/authApi";
import { Button } from "@/shared/ui/Button";
import { Alert } from "@chakra-ui/react";
import Input from "@/shared/ui/Input";
import AuthFeedback from "../components/AuthFeedback";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.forgotPassword(values.email);
      setSubmittedEmail(values.email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };
  if (success) {
    return (
      <AuthFeedback
        type="success"
        header={t("auth.reset_link_sent_to")}
        description={
          <span>
            {t("auth.reset_link_sent_to")}{" "}
            <span className="font-medium text-gray-900">{submittedEmail}</span>
          </span>
        }
        note={t("auth.reset_link_expiry_note")}
        buttonText={t("auth.back_to_login")}
        onButtonClick={() => navigate("/auth/login")}
      />
    );
  }

  return (
    <div className="w-[90%] sm:w-[70%] lg:w-[63%] flex flex-col gap-12 items-center">
      <div className="text-center">
        <h1 className="text-3xl">{t("auth.forgot_password")}</h1>
        <p className="text-gray-600 mt-4">
          {t("auth.forget_password_subheader")}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col w-full"
      >
        <Input
          label={t("labels.email")}
          type="email"
          autoComplete="email"
          autoFocus
          required
          placeholder={t("labels.email")}
          {...register("email")}
          error={errors.email?.message}
        />

        <div className="flex flex-col gap-4 w-full">
          <Button type="submit" loading={isLoading}>
            {t("auth.send_reset_link")}
          </Button>

          <Button
            type="button"
            buttonType="secondary"
            onClick={() => navigate("/auth/login")}
          >
            {t("auth.back_to_login")}
          </Button>
        </div>

        <div className="h-8">
          {error && (
            <Alert.Root
              status="error"
              bg="transparent"
              border="none"
              boxShadow="none"
              borderRadius="md"
            >
              <Alert.Indicator />
              <Alert.Description>{error}</Alert.Description>
            </Alert.Root>
          )}
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
