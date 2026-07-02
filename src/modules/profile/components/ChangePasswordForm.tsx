import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/shared/validation/authSchemas";
import { userApi } from "@/modules/auth/api/userApi";
import { toaster } from "@/components/ui/toaster";
import Input from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ChangePasswordForm({ onSuccess, onCancel }: Props) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    try {
      await userApi.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toaster.create({
        type: "success",
        title: t("profile.password_changed_success"),
        duration: 4000,
      });
      onSuccess();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Failed to change password. Please try again.";
      toaster.create({ type: "error", title: msg, duration: 5000 });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-md">
      <Input
        label={t("profile.current_password")}
        type="password"
        revealable
        error={errors.currentPassword?.message}
        {...register("currentPassword")}
      />

      <Input
        label={t("labels.new_password", "New Password")}
        type="password"
        revealable
        showStrengthMeter
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />

      <Input
        label={t("labels.confirm_password", "Confirm New Password")}
        type="password"
        revealable
        error={errors.confirmNewPassword?.message}
        {...register("confirmNewPassword")}
      />

      <div className="flex gap-3 mt-2">
        <Button
          type="button"
          buttonType="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {t("profile.cancel", "Cancel")}
        </Button>
        <Button type="submit" buttonType="primary" loading={isSubmitting}>
          {t("profile.change_password", "Change Password")}
        </Button>
      </div>
    </form>
  );
}
