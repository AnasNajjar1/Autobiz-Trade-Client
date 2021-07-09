import React, {useState} from "react";
import LoginSection from "../components/Login/LoginSection";
import PresentationSection from "../components/Login/PresentationSection";
import CarsSection from "../components/Login/CarsSection";
import CarDealerSection from "../components/Login/CarDealerSection";
import StatsSection from "../components/Login/StatsSection";
import Footer from "../components/Login/Footer";
import { ZendeskDisplayer } from "../components/common/ZendeskDisplayer";
import { getCurrentLanguage } from "../language-context"
import { Auth } from "../providers/Auth";
import { Redirect } from "react-router-dom";

const LoginView = (props) => {
  const currentLanguage = getCurrentLanguage()
  const [isLogged, setIsLogged] = useState(null);

  Auth.isLogged()
    .then(() => setIsLogged(true))
    .catch(() => setIsLogged(false));

  if (isLogged) return <Redirect exact to="/records" />;

  return (
    <>
      <ZendeskDisplayer language={currentLanguage} />
      <div className="page page-index">
        <LoginSection {...props} />
        <PresentationSection />
        <CarsSection />
        <CarDealerSection appLanguage={currentLanguage} />
        <StatsSection />
        <Footer didomi={props.didomi} />
      </div>
    </>
  );
};

export default LoginView;
