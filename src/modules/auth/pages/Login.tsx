import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import {
  loginSchema,
  type LoginFormValues,
} from "../../../shared/validation/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const Login = () => {
  const { login, isLoading, error, dismissError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (error) dismissError();
  }, []);

  const onSubmit = (values: LoginFormValues) => {
    login(values.email, values.password);
  };

  return (
    <div>
      <h1>Login Page</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <div>
          <label>Email:</label>
          <input
            type="email"
            {...register("email")} // ✅ FIX
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            {...register("password")} // ✅ FIX
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
