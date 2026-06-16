import { Outlet } from "react-router-dom";
import Sesame from "../../assets/sesame.jpg";
import SesameValues from "../../assets/sesame-values.jpg";
import Logo from "../../assets/logo-sesame.png";

const AuthLayout = () => {
  return (
    <div className="flex h-screen gradient-bg overflow-hidden">
      <div className="w-full lg:w-[45%] flex justify-center items-center">
        <img src={Logo} alt="Logo" className="w-55 absolute top-7 " />

        <Outlet />
      </div>
      <div className="h-full hidden lg:flex w-[55%] flex-col items-center justify-center">
        <img
          src={Sesame}
          alt="Sesame"
          className="rounded-tl-[40px] h-[75%] w-full object-cover"
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

export default AuthLayout;
