import React, { useState } from "react";
import { t } from "../common/Translate";
import { languages } from "../../config";
import { API } from "aws-amplify";
import {
  Row,
  Col,
  Input,
  Label,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import "../../assets/scss/login.scss";

const ForgottenPasswordModal = ({ toggle, handleToggle }) => {
  const [username, setUsername] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const countries = Object.keys(languages).map((lang) => (
    <option key={lang} value={lang}>
      {languages[lang]}
    </option>
  ));

  const [country, setCountry] = useState(countries[0] || null);

  const resetPassword = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await API.post("b2bPlateform", `/resetPassword`, {
        body: { username },
      });
      setSuccess(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error);
    }
  };

  const resetDisabled = !username || username.length < 4 || !country;

  return (
    <Modal
      className="modal-reset-password"
      isOpen={toggle}
      toggle={handleToggle}
    >
      <ModalHeader toggle={handleToggle} className="model-title">
        <b>{t("forgot_password")}</b>
      </ModalHeader>
      <ModalBody>
        <Row className="mb-4">
          <Col xs="12">
            <Label className="mb-2 text-primary text-left" for="username">
              {t("user")}
            </Label>
            <Input
              type="text"
              name="username"
              id="username"
              onChange={(e) => setUsername(e.target.value)}
              value={username || ""}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col xs="12">
            <Label className="mb-2 text-primary text-left" for="country">
              {t("country")}
            </Label>
            <Input
              className="icon-countries"
              type="select"
              name="country"
              id="country"
              onChange={(e) => {
                setCountry(e.target.value);
              }}
              value={country}
            >
              {countries}
            </Input>
          </Col>
        </Row>

        <button
          type="button"
          className={`btn btn-block ${resetDisabled ? "btn-1" : "btn-4"}`}
          onClick={resetPassword}
          disabled={resetDisabled}
        >
          {t("valider")}
        </button>

        <Row className="mb-4 reset-password">
          <Col xs="12" className="mt-4">
            {isLoading && <Spinner color="primary" />}
            {error && (
              <>
                <span className="error">{t("newPasswordNotSent")}</span>
              </>
            )}
            {success && (
              <>
                <span className="success">{t("newPasswordSent")}</span>
              </>
            )}
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default ForgottenPasswordModal;
