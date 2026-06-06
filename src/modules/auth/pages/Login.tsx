import LoginForm from "../components/LoginForm";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="w-[90%] sm:w-[70%] lg:w-[63%] flex flex-col gap-12 items-center">
        <div className="text-center ">
          <h1 className="text-3xl">{t("auth.welcome_back")}</h1>
          <h3 className="text-muted mt-4">{t("auth.sign_in_header")}</h3>
        </div>
        <LoginForm />
      </div>
    </>
  );
};

export default Login;
