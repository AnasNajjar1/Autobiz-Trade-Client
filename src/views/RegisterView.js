import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import RegisterForm from "../components/Register/RegisterForm";
import { t } from "../components/common/Translate";
import { RegisterValidation } from "../components/Register/RegisterValidation";
import { ZendeskDisplayer } from "../components/common/ZendeskDisplayer";
import { getCurrentLanguage } from "../language-context";

const RegisterView = () => {
  const language = getCurrentLanguage();
  const [loading, setLoading] = useState(false);
  const [validationBloc, setValidationBloc] = useState(false);
  const [registerFailed, setRegisterFailed] = useState(false);

  return (
    <>
      <ZendeskDisplayer language={language} />
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
    </>
  );
};

export default RegisterView;
