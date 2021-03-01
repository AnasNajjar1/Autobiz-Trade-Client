import React from "react";
import { Container, Row, Col } from "reactstrap";
import logo from "../assets/img/autobiz-trade.svg";
import RegisterForm from "../components/Register/RegisterForm";
import { t } from "../components/common/Translate";
import LanguagePicker from "../components/common/LanguagePicker";

const RegisterView = (props) => {
  return (
    <div className="page page-register">
      <Container>
        <Row>
          <Col>
            <div className="text-md-left text-center">
              <img alt="Autobiz Market" className="logo" src={logo} />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="register-container">
              <h1>{t("titleForm")}</h1>
              <p>{t("paragraph1From")}</p>
              <p>{t("paragraph2From")}</p>
              <RegisterForm {...props} />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterView;
