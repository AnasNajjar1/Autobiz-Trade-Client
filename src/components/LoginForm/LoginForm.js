import React, { Component } from "react";
import { Form, FormGroup, Input, Button, Alert, Spinner } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Translate, { t } from "../common/Translate";
import {
  faEnvelope,
  faKey,
  faShieldAlt,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import { Auth, API } from "aws-amplify";
import { link_new_password } from "../../config";

class LoginForm extends Component {
  state = {
    username: "",
    password: "",
    error: false,
    loading: false
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    this.setState({ error: false });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { username, password } = this.state;

    if (username === "" || password === "") {
      this.setState({ error: true });
    } else {
      this.setState({ loading: true });
      signInAutobiz(username, password)
        .then(() => this.props.history.push("/records"))
        .catch(e => this.setState({ error: true }))
        .finally(() => this.setState({ loading: true }));
    }
  };
  render() {
    const { error } = this.state;
    return (
      <>
        <Form className="my-auto" onSubmit={this.handleSubmit}>
          <FormGroup>
            <FontAwesomeIcon icon={faEnvelope} className="icon-info" />
            <Input
              name="username"
              type="text"
              placeholder={t("login")}
              className={error ? "is-invalid" : ""}
              value={this.state.username}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup>
            <FontAwesomeIcon icon={faKey} className="icon-info" />
            <Input
              name="password"
              type="password"
              placeholder={t("password")}
              className={error ? "is-invalid" : ""}
              value={this.state.password}
              onChange={this.handleChange}
            />
          </FormGroup>

          {error && (
            <Alert color="danger" className="text-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
              <Translate code="user_unauthorized" />
            </Alert>
          )}

          <FormGroup>
            <Button color="primary" block>
              {this.state.loading && <Spinner size="sm" />}
              <Translate code="connect" />
            </Button>
          </FormGroup>
        </Form>
        <p className="text-center">
          <a href={link_new_password}>
            <Translate code="forgot_password" />
          </a>
        </p>

        {/* <Button outline color="secondary" block>
          <FontAwesomeIcon icon={faShieldAlt} className="icon-info mr-2" />
          <Translate code="become_seller_buyer" />
        </Button> */}
      </>
    );
  }
}

export default LoginForm;

async function signInAutobiz(username, password) {
  const authAutobiz = await API.post("b2bPlateform", "/auth", {
    body: { username, password }
  });

  // To derive necessary data from the provider
  const {
    token, // the token you get from the provider
    domain,
    expiresIn,
    user,
    identity_id
  } = authAutobiz;
  return Auth.federatedSignIn(
    domain,
    {
      token,
      identity_id, // Optional
      expires_at: expiresIn * 1000 + new Date().getTime() // the expiration timestamp
    },
    user
  )
    .then(cred => {
      // If success, you will get the AWS credentials
      return Auth.currentAuthenticatedUser();
    })
    .then(user => {
      // If success, the user object you passed in Auth.federatedSignIn
      return user;
    })
    .catch(e => {
      console.log("error", e.message);
    });
}
