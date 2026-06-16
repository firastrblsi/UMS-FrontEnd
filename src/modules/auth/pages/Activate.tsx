import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/shared/validation/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "../api/authApi";
import { Button } from "@/shared/ui/Button";
import { Alert } from "@chakra-ui/react";
import Input from "@/shared/ui/Input";
import AuthFeedback from "../components/AuthFeedback";

const Activate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid activation link");
    }
  }, [token]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) {
      setError("Invalid activation token");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await authApi.activateAccount(token, values.password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to activate account");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthFeedback
        type="error"
        header={t("auth.invalid_activation_link")}
        description={t("auth.invalid_activation_link_description")}
        buttonText={t("auth.back_to_login")}
        onButtonClick={() => navigate("/auth/login")}
      />
    );
  }

  if (success) {
    return (
      <AuthFeedback
        type="success"
        header={t("auth.account_activated")}
        description={t("auth.account_activated_description")}
        buttonText={t("auth.back_to_login")}
        onButtonClick={() => navigate("/auth/login")}
      />
    );
  }

  return (
    <div className="w-[90%] sm:w-[70%] lg:w-[63%] flex flex-col gap-12 items-center">
      <div className="text-center">
        <h1 className="text-3xl">{t("auth.activate_account")}</h1>
        <p className="text-gray-600 mt-4">
          {t("auth.activate_account_subheader")}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col w-full"
      >
        <Input
          label={t("labels.new_password", "New Password")}
          type="password"
          revealable
          required
          placeholder={t("labels.new_password", "New Password")}
          {...register("password")}
          error={errors.password?.message}
          showStrengthMeter
        />

        <Input
          label={t("labels.confirm_password", "Confirm Password")}
          type="password"
          revealable
          required
          placeholder={t("labels.confirm_password", "Confirm Password")}
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        {error && (
          <Alert.Root status="error" className="mb-4">
            <Alert.Indicator />
            <Alert.Description>{error}</Alert.Description>
          </Alert.Root>
        )}

        <Button type="submit" loading={isLoading} className="w-full">
          {t("auth.activate_button")}
        </Button>
      </form>
    </div>
  );
};

export default Activate;
