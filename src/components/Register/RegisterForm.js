import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import {
  Form,
  FormGroup,
  Button,
  Alert,
  Spinner,
  Row,
  Col,
  Label,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Translate, { t } from "../common/Translate";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { countries } from "../../assets/defaults/country";
import _ from "lodash";
import Recaptcha from "../common/Recaptcha";
import { useForm } from "react-hook-form";

const RegisterForm = () => {
  const { register, handleSubmit, errors } = useForm();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = (data) => {
    setLoading(true);
    setError(false);
    console.log(data);
  };

  return (
    <>
      <Form className="my-auto" onSubmit={handleSubmit(onSubmit)}>
        <p className="h4 mt-4 mb-4">{t("companyForm")}</p>
        <Row form>
          <Col md={4}>
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
              {errors.companyName && (
                <span className="text-danger">
                  {errors.companyName.message}
                </span>
              )}
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="companyAddress">{t("companyAdressForm")} *</Label>
              <input
                name="companyAddress"
                type="text"
                className="form-control"
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="companyAddressAddition">
                {t("companyAdressAdditionForm")} *
              </Label>
              <input
                name="companyAddressAddition"
                type="text"
                className="form-control"
              />
            </FormGroup>
          </Col>
        </Row>

        <Row form>
          <Col md={4}>
            <FormGroup>
              <Label for="companyCity">{t("companyCityForm")} *</Label>
              <input name="companyCity" type="text" className="form-control" />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="companyZip">{t("companyZipForm")} *</Label>
              <input name="companyZip" type="text" className="form-control" />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="companyCountry">{t("companyCountryForm")} *</Label>
              <select name="companyCountry" className="form-control">
                <option value="" disabled selected>
                  &ndash;
                </option>
                {_.map(countries, (country) => (
                  <option value={country.id}>{country.name}</option>
                ))}
              </select>
            </FormGroup>
          </Col>
        </Row>

        <Row form>
          <Col md={4}>
            <FormGroup>
              <Label for="vat">{t("vatForm")} *</Label>
              <input name="vat" type="text" className="form-control" />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="companyNumber">{t("companyNumberForm")} *</Label>
              <input
                name="companyNumber"
                type="text"
                className="form-control"
              />
            </FormGroup>
          </Col>
        </Row>

        <p class="h4 mt-4 mb-4">{t("contactForm")}</p>

        <Row form>
          <Col>
            <FormGroup>
              <Row>
                <Col md-4>
                  <Label>{t("civilityForm")} *</Label>
                </Col>
                <Col md-4>
                  <input type="radio" name="civility" value="miss" />
                  <Label check>{t("missForm")}</Label>
                </Col>
                <Col md-4>
                  <input type="radio" name="civility" value="mister" />
                  <Label check>{t("misterForm")}</Label>
                </Col>
              </Row>
            </FormGroup>
          </Col>
        </Row>

        <Row form>
          <Col md={4}>
            <FormGroup>
              <Label for="role">{t("roleForm")} *</Label>
              <select type="select" name="role" className="form-control">
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
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="firstName">{t("firstNameForm")} *</Label>
              <input name="firstName" type="text" className="form-control" />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="lastName">{t("lastNameForm")} *</Label>
              <input name="lastName" type="text" className="form-control" />
            </FormGroup>
          </Col>
        </Row>

        <Row form>
          <Col md={4}>
            <FormGroup>
              <Label for="phoneNumber">{t("phoneNumberForm")} *</Label>
              <input
                name="phoneNumber"
                type="tel"
                className="form-control"
                value="+"
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="mail">{t("mailForm")} *</Label>
              <input type="email" name="mail" className="form-control" />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="mailValidation">{t("mailValidationForm")} *</Label>
              <input
                type="email"
                name="mailValidation"
                className="form-control"
              />
            </FormGroup>
          </Col>
        </Row>

        <p>{t("disclaimerForm")}</p>

        <FormGroup>
          <Label check>
            <input type="checkbox" defaultChecked="" />* {t("checkBoxForm")}
          </Label>
        </FormGroup>

        {error && <></>}

        <Recaptcha />

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
