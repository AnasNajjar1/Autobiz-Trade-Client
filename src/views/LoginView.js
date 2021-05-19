import React from "react";
import { Container, Row, Col } from "reactstrap";
import logo from "../assets/img/autobiz-trade.svg";
import LoginForm from "../components/LoginForm/LoginForm";
import { t } from "../components/common/Translate";

const LoginView = (props) => {
  return (
    <>
      <div className="page page-login">
        <Container>
          <Row>
            <Col>
              <div className="login-container">
                <img alt="Autobiz Market" className="logo" src={logo} />
                <LoginForm {...props} />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="consent-choices">
        <a href="javascript:Didomi.preferences.show()">
          {t("Consent choices")}
        </a>
      </div>
    </>
  );
};

export default LoginView;
