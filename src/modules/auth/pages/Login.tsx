import LoginForm from "../components/LoginForm";
import Sesame from "../../../assets/sesame.jpg";
import SesameValues from "../../../assets/sesame-values.jpg";
import Logo from "../../../assets/logo-sesame.png";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  return (
    <div className="flex h-screen gradient-bg overflow-hidden">
      {/* Left Side */}
      <div className="w-full lg:w-[45%] flex justify-center items-center">
        <img src={Logo} alt="Logo" className="w-55 absolute top-7 " />
        <div className="w-[90%] sm:w-[70%] lg:w-[63%] flex flex-col gap-12 items-center">
          <div className="text-center ">
            <h1 className="text-3xl">{t("auth.welcome_back")}</h1>
            <h3 className="text-muted mt-4">{t("auth.sign_in_header")}</h3>
          </div>
          <LoginForm />
        </div>
      </div>

      {/* Right Side */}
      <div className="h-full hidden lg:flex w-[55%] flex-col items-center justify-center">
        <img
          src={Sesame}
          alt="Sesame"
          className="rounded-tl-[40px] h-[75%]"
          w-full
          object-cover
        />
        <img
          src={SesameValues}
          alt="Sesame Values"
          className="rounded-bl-[40px] h-[25%] w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
