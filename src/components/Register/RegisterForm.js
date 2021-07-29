import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { Form, FormGroup, Button, Spinner, Row, Col, Label } from "reactstrap";
import { t } from "../common/Translate";
import _ from "lodash";
import Recaptcha from "../common/Recaptcha";
import { useForm } from "react-hook-form";

import { API } from "aws-amplify";

const allCountryList = {
  fr: require("localized-countries/data/fr_FR.json"),
  en: require("localized-countries/data/en_GB.json"),
  it: require("localized-countries/data/it_IT.json"),
  de: require("localized-countries/data/de_DE.json"),
  nl: require("localized-countries/data/nl_NL.json"),
  es: require("localized-countries/data/es_ES.json"),
  pt: require("localized-countries/data/pt_PT.json"),
};

const RegisterForm = ({
  language,
  loading,
  setValidationBloc,
  setRegisterFailed,
  setLoading,
}) => {
  const { register, handleSubmit, errors, getValues } = useForm();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);

  const onSubmit = async (data) => {
    setFormSubmitted(true);
    if (captchaToken) {
      setLoading(true);
      setValidationBloc(true);
      try {
        await API.post("b2bPlateform", `/register/${language}`, {
          body: data,
          headers: { Authorization: captchaToken },
        });
        setRegisterFailed(false);
      } catch (err) {
        setRegisterFailed(true);
      }
      setLoading(false);
    }
  };

  const countryLanguage = allCountryList[language]
    ? allCountryList[language]
    : allCountryList["en"];

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h3>{t("companyForm")}</h3>
        <Row form>
          <Col md={5}>
            <FormGroup>
              <Label for="companyName">{t("companyNameForm")} *</Label>
              <input
                name="companyName"
                type="text"
                className={`form-control${
                  errors.companyName ? " is-invalid" : ""
                }`}
                ref={register({ required: t("missingMandatoryFieldForm") })}
              />
              {errors.companyName && <span>{errors.companyName.message}</span>}
            </FormGroup>
          </Col>
          <Col md={2} />
          <Col md={5}>
            <FormGroup>
              <Label for="vat">{t("vatForm")} *</Label>
              <input
                name="vat"
                type="text"
                className={`form-control${errors.vat ? " is-invalid" : ""}`}
                ref={register({ required: t("missingMandatoryFieldForm") })}
              />
              {errors.vat && (
                <span className="text-danger">{errors.vat.message}</span>
              )}
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col md={5}>
            <FormGroup>
              <Label for="companyNumber">{t("companyNumberForm")} *</Label>
              <input
                name="companyNumber"
                type="text"
                className={`form-control${
                  errors.companyNumber ? " is-invalid" : ""
                }`}
                ref={register({ required: t("missingMandatoryFieldForm") })}
              />
              {errors.companyNumber && (
                <span>{errors.companyNumber.message}</span>
              )}
            </FormGroup>
          </Col>
          <Col md={2} />
          <Col md={5}>
            <FormGroup>
              <Label for="companyAddress">{t("companyAdressForm")} *</Label>
              <input
                name="companyAddress"
                type="text"
                className={`form-control${
                  errors.companyAddress ? " is-invalid" : ""
                }`}
                ref={register({ required: t("missingMandatoryFieldForm") })}
              />
              {errors.companyAddress && (
                <span>{errors.companyAddress.message}</span>
              )}
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col md={5}>
            <FormGroup>
              <Label for="companyAddressAddition">
                {t("companyAdressAdditionForm")}
              </Label>
              <input
                name="companyAddressAddition"
                type="text"
                className="form-control"
                ref={register}
              />
            </FormGroup>
          </Col>
          <Col md={2} />
          <Col md={5}>
            <FormGroup>
              <Label for="companyZip">{t("companyZipForm")} *</Label>
              <input
                name="companyZip"
                type="text"
                className={`form-control${
                  errors.companyZip ? " is-invalid" : ""
                }`}
                ref={register({ required: t("missingMandatoryFieldForm") })}
              />
              {errors.companyZip && <span>{errors.companyZip.message}</span>}
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col md={5}>
            <FormGroup>
              <Label for="companyCity">{t("companyCityForm")} *</Label>
              <input
                name="companyCity"
                type="text"
                className={`form-control${
                  errors.companyCity ? " is-invalid" : ""
                }`}
                ref={register({ required: t("missingMandatoryFieldForm") })}
              />
              {errors.companyCity && <span>{errors.companyCity.message}</span>}
            </FormGroup>
          </Col>
          <Col md={2} />
          <Col md={5}>
            <FormGroup>
              <Label for="companyCountry">{t("companyCountryForm")} *</Label>
              <FormGroup>
                <select
                  name="companyCountry"
                  className={`form-control${
                    errors.companyCountry ? " is-invalid" : ""
                  }`}
                  ref={register({ required: t("missingMandatoryFieldForm") })}
                >
                  <option value="" disabled selected>
                    &ndash;
                  </option>
                  {_.map(countryLanguage, (label, code) => (
                    <option key={code} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
              </FormGroup>
              {errors.companyCountry && (
                <span>{errors.companyCountry.message}</span>
              )}
            </FormGroup>
          </Col>
        </Row>

        <h3>{t("contactForm")}</h3>
        <Row form>
          <Col>
            <FormGroup>
              <Row>
                <Col md={2} className="mt-2">
                  <Label>{t("civilityForm")} *</Label>
                </Col>
                <Col md={2} className="mt-2">
                  <input
                    type="radio"
                    name="civility"
                    value={t("missForm")}
                    ref={register({ required: t("missingMandatoryFieldForm") })}
                  />
                  <Label check>{t("missForm")}</Label>
                </Col>
                <Col md={2} className="mt-2">
                  <input
                    type="radio"
                    name="civility"
                    value={t("misterForm")}
                    ref={register({ required: t("missingMandatoryFieldForm") })}
                  />
                  <Label check>{t("misterForm")}</Label>
                </Col>
              </Row>
              {errors.civility && (
                <p>
                  <span>{errors.civility.message}</span>
                </p>
              )}
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col md={5}>
            <FormGroup>
              <Label for="firstName">{t("firstNameForm")} *</Label>
              <input
                name="firstName"
                type="text"
                className={`form-control${
                  errors.firstName ? " is-invalid" : ""
                }`}
                ref={register({ required: t("missingMandatoryFieldForm") })}
              />
              {errors.firstName && <span>{errors.firstName.message}</span>}
            </FormGroup>
          </Col>
          <Col md={2} />
          <Col md={5}>
            <FormGroup>
              <Label for="lastName">{t("lastNameForm")} *</Label>
              <input
                name="lastName"
                type="text"
                className={`form-control${
                  errors.lastName ? " is-invalid" : ""
                }`}
                ref={register({ required: t("missingMandatoryFieldForm") })}
              />
              {errors.lastName && <span>{errors.lastName.message}</span>}
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col md={5}>
            <FormGroup>
              <Label for="role">{t("roleForm")} *</Label>
              <select
                type="select"
                name="role"
                className={`form-control${errors.role ? " is-invalid" : ""}`}
                ref={register({ required: t("missingMandatoryFieldForm") })}
              >
                <option value="" disabled selected>
                  &ndash;
                </option>
                <option value={t("managingForm")}>{t("managingForm")}</option>
                <option value={t("buyerForm")}>{t("buyerForm")}</option>
                <option value={t("sellerForm")}>{t("sellerForm")}</option>
                <option value={t("accountingForm")}>
                  {t("accountingForm")}
                </option>
                <option value={t("salesManagerForm")}>
                  {t("salesManagerForm")}
                </option>
                <option value={t("otherFunctionForm")}>
                  {t("otherFunctionForm")}
                </option>
              </select>
              {errors.role && <span>{errors.role.message}</span>}
            </FormGroup>
          </Col>
          <Col md={2} />
          <Col md={5}>
            <FormGroup>
              <Label for="phoneNumber">{t("phoneNumberForm")} *</Label>
              <input
                name="phoneNumber"
                type="text"
                className={`form-control${
                  errors.phoneNumber ? " is-invalid" : ""
                }`}
                ref={register({
                  required: t("missingMandatoryFieldForm"),
                  pattern: {
                    value: /^\+?\d{9,20}$/i,
                    message: t("wrongFormatForm"),
                  },
                })}
              />
              {errors.phoneNumber && <span>{errors.phoneNumber.message}</span>}
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col md={5}>
            <FormGroup>
              <Label for="mail">{t("mailForm")} *</Label>
              <input
                type="text"
                name="email"
                className={`form-control${errors.email ? " is-invalid" : ""}`}
                ref={register({
                  required: t("missingMandatoryFieldForm"),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t("wrongFormatForm"),
                  },
                })}
              />
              {errors.email && <span>{errors.email.message}</span>}
            </FormGroup>
          </Col>
          <Col md={2} />
          <Col md={5}>
            <FormGroup>
              <Label for="mailValidation">{t("mailValidationForm")} *</Label>
              <input
                type="text"
                name="emailValidation"
                className={`form-control${
                  errors.emailValidation ? " is-invalid" : ""
                }`}
                ref={register({
                  required: t("missingMandatoryFieldForm"),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t("wrongFormatForm"),
                  },
                  validate: {
                    emailEqual: (value) =>
                      value === getValues().email || t("notEqualEmailForm"),
                  },
                })}
              />
              {errors.emailValidation && (
                <span>{errors.emailValidation.message}</span>
              )}
            </FormGroup>
          </Col>
        </Row>

        <p className="mt-5 disclaimer-form">{t("disclaimerForm")}</p>
        <FormGroup>
          <Label check className="cgu">
            <input
              type="checkbox"
              name="checkBoxForm"
              ref={register({ required: t("missingMandatoryFieldForm") })}
            />
            * {t("checkBoxForm1")}{" "}
            <a
              className="text-white"
              href={t("checkBoxForm4")}
              rel="noopener noreferrer"
              target="_blank"
            >
              <u>{t("checkBoxForm2")}</u>
            </a>{" "}
            {t("checkBoxForm3")}
          </Label>
          {errors.checkBoxForm && (
            <p>
              <span>{errors.checkBoxForm.message}</span>
            </p>
          )}
        </FormGroup>

        <Recaptcha setCaptchaToken={setCaptchaToken} />
        {formSubmitted && !captchaToken && (
          <p className="text-center">
            <span>{t("checkRecaptchaForm")}</span>
          </p>
        )}

        <FormGroup className="text-center">
          <Button>
            {loading && <Spinner size="sm" />}
            {t("ctaValidationForm")}
          </Button>
        </FormGroup>
      </Form>
    </>
  );
};

export default withRouter(RegisterForm);
