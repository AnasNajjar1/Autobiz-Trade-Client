import React from "react";
import { Container, Row, Col } from "reactstrap";
import logo from "../assets/img/autobiz-trade.svg";
import LoginForm from "../components/LoginForm/LoginForm";

const LoginView = props => {
  return (
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
  );
};

export default LoginView;
