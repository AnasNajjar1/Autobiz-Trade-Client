import React, { useState, useEffect } from "react";
import LoginSection from "../components/Login/LoginSection";
import PresentationSection from "../components/Login/PresentationSection";
import CarsSection from "../components/Login/CarsSection";
import CarDealerSection from "../components/Login/CarDealerSection";
import StatsSection from "../components/Login/StatsSection";
import Footer from "../components/Login/Footer";
import Cookies from "js-cookie";
import { ZendeskAPI } from "react-zendesk";

const LoginView = (props) => {
  const [appLanguage, setAppLanguage] = useState(Cookies.get("appLanguage"));

  useEffect(() => {
    appLanguage !== "es"
    ? ZendeskAPI("webWidget", "hide")
    : ZendeskAPI("webWidget", "show");
  });

  return (
    <div className="page page-index">
      <LoginSection
        {...props}
        appLanguage={appLanguage}
        setAppLanguage={setAppLanguage}
      />
      <PresentationSection />
      <CarsSection appLanguage={appLanguage} />
      <CarDealerSection appLanguage={appLanguage} />
      <StatsSection />
      <Footer didomi={props.didomi} appLanguage={appLanguage}/>
    </div>
  );
};

export default LoginView;
