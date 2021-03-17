import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import RegisterForm from "../components/Register/RegisterForm";
import { t } from "../components/common/Translate";
import Cookies from "js-cookie";
import { RegisterValidation } from "../components/Register/RegisterValidation";

const RegisterView = ({ match }) => {
  const [language, setLanguage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validationBloc, setValidationBloc] = useState(false);
  const [registerFailed, setRegisterFailed] = useState(false);

  useEffect(() => {
    handleChangeLang(match.params.language);
  }, [match.params.language]);

  const handleChangeLang = (language) => {
    setLanguage(language);
    Cookies.set("appLanguage", language, { expires: 365 });

    window.dispatchEvent(
      new CustomEvent("changeLanguage", { detail: { language } })
    );
  };

  return (
    <div className="page page-register">
      <div
        className={`register-container ${
          validationBloc ? "d-none" : "d-block"
        }`}
      >
        <Row>
          <Col md={5} className="bloc-left">
            <div>
              <h1>{t("titleForm")}</h1>
              <h2>{t("paragraph1From")}</h2>
              <p>{t("paragraph2From")}</p>
            </div>
          </Col>
          <Col md={7} className="bloc-right">
            <RegisterForm
              language={language}
              loading={loading}
              setLoading={setLoading}
              setValidationBloc={setValidationBloc}
              setRegisterFailed={setRegisterFailed}
            />
          </Col>
        </Row>
      </div>
      <RegisterValidation
        loading={loading}
        validationBloc={validationBloc}
        registerFailed={registerFailed}
      />
    </div>
  );
};

export default RegisterView;
