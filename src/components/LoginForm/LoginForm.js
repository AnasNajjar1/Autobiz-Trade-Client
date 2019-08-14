import React, { Component } from "react";
import { Form, FormGroup, Input, Button, Alert } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faKey,
  faShieldAlt,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";

class LoginForm extends Component {
  state = {
    username: "",
    password: "",
    error: false
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
      return this.props.history.push("/records");
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
              placeholder="Nom d'utilisateur"
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
              placeholder="Mot de passe"
              className={error ? "is-invalid" : ""}
              value={this.state.password}
              onChange={this.handleChange}
            />
          </FormGroup>

          {error && (
            <Alert color="danger" className="text-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
              Nom d'utilisateur ou mot de passe erroné !
            </Alert>
          )}

          <FormGroup>
            <Button color="primary" block>
              Se connecter
            </Button>
          </FormGroup>
        </Form>
        <p className="text-center">
          <a href="#">Mot de passe oublié</a>
        </p>

        <Button outline color="secondary" block>
          <FontAwesomeIcon icon={faShieldAlt} className="icon-info mr-2" />
          Devenir vendeur/acheteur
        </Button>
      </>
    );
  }
}

export default LoginForm;
