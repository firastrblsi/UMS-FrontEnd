import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import {
  loginSchema,
  type LoginFormValues,
} from "@/shared/validation/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { Alert } from "@chakra-ui/react";
import Input from "@/shared/ui/Input";
import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/Button";

const LoginForm = () => {
  const { login, isLoading, error, dismissError } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  useEffect(() => {
    dismissError();
  }, []);
  const onSubmit = (values: LoginFormValues) => {
    login(values.email, values.password);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col  w-full"
    >
      <Input
        label="Email address"
        type="email"
        autoComplete="email"
        placeholder="Email address"
        autoFocus
        required
        {...register("email")}
        error={errors.email?.message}
      />
      <Input
        label="Password"
        revealable
        autoComplete="current-password"
        placeholder="Password"
        required
        {...register("password")}
        error={errors.password?.message}
      />

      <div>
        <div className="flex justify-end mt-2 me-2">
          <Link
            to="/auth/forgot-password"
            className="text-sm text-primary hover:text-primary-dark transition-colors"
          >
            Forgot your password?
          </Link>
        </div>
        <Button
          type="submit"
          className="mt-5 w-full"
          loading={isLoading}
          size="lg"
        >
          Sign In
        </Button>
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
      </div>
    </form>
  );
};

export default LoginForm;
