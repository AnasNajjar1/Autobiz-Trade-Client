import React, { useState, useEffect } from "react";
import Translate, { t } from "../common/Translate";
import { Row, Col, FormGroup, Input, Label } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { API } from "aws-amplify";

const FilterGeoloc = ({
  country,
  zipCode,
  radius,
  lat,
  lng,
  updateField,
  updatePosition,
}) => {
  const [errorZipCode, setErrorZipCode] = useState(false);
  const [enableRadius, setEnableRadius] = useState(false);

  const countries = [
    { code: "fr", name: "france", zipCodeRegex: /^\d{5}$/ },
    { code: "es", name: "spain", zipCodeRegex: /^\d{5}$/ },
    { code: "de", name: "germany", zipCodeRegex: /^\d{5}$/ },
    { code: "pt", name: "portugal", zipCodeRegex: /^\d{4}-\d{3}$/ },
    { code: "it", name: "italy", zipCodeRegex: /^\d{5}$/ },
  ];

  const handleChangeCountry = (e) => {
    updateField(e);
  };

  const handleChangeZipcode = (e) => {
    updateField(e);
  };

  const getPosition = async () => {
    try {
      const response = await API.post("b2bPlateform", `/geoloc/`, {
        body: {
          country: countries.find((e) => e.code === country).name,
          zipCode,
        },
        response: true,
      });
      updatePosition(response.data);

      setErrorZipCode(false);
      return;
    } catch (e) {
      setErrorZipCode(true);
    }
  };

  useEffect(() => {
    if (zipCode === "") {
      setErrorZipCode(false);
      setEnableRadius(false);
    } else if (
      countries.find((e) => e.code === country).zipCodeRegex.exec(zipCode) !==
      null
    ) {
      setErrorZipCode(false);
      setEnableRadius(true);
      getPosition();
    } else {
      setEnableRadius(false);
      setErrorZipCode(true);
    }
  }, [zipCode]);

  const handleChangeRadius = (e) => {
    updateField(e);
  };

  return (
    <>
      <FormGroup>
        <Row>
          <Col>
            <Input
              type="select"
              name="country"
              id="country"
              value={country}
              onChange={(e) => handleChangeCountry(e)}
              className="mb-2"
            >
              <option value={"all"}>{t("all")}</option>
              {Object.values(countries).map((c, i) => (
                <option value={c.code} key={i}>
                  {t(c.name)}
                </option>
              ))}
            </Input>
            <Label className="mini-label">{t("country")}</Label>
          </Col>
        </Row>
        <div className={country === "all" ? "d-none" : ""}>
          <Row>
            <Col>
              <Input
                type="text"
                name="zipCode"
                id="zipCode"
                disabled={country === "all"}
                className={errorZipCode ? "is-invalid" : ""}
                value={zipCode}
                onChange={(e) => handleChangeZipcode(e)}
              />
              <Label for="zipCode" className="mini-label">
                <Translate code="zipCode"></Translate>
              </Label>
              <div className="invalid-feedback">
                <Translate code="invalid_zipcode" />
              </div>
            </Col>

            <Col className={enableRadius ? "" : "d-none"}>
              <Input
                type="select"
                name="radius"
                id="radius"
                value={radius}
                onChange={(e) => handleChangeRadius(e)}
              >
                <option value={50}>50km</option>
                <option value={100}>100km</option>
                <option value={200}>200km</option>
                <option value={300}>300km</option>
                <option value={500}>500km</option>
              </Input>
              <Label className="mini-label">Rayon</Label>
            </Col>
          </Row>
          <Row className="d-none">
            <Col>
              <Input type="text" name="lat" id="lat" value={lat} readOnly />
            </Col>
            <Col>
              <Input type="text" name="lng" id="lng" value={lng} readOnly />
            </Col>
          </Row>
          <Row className="d-none">
            <Col>
              <button className="btn btn-sm btn-outline-primary btn-block mt-3">
                <FontAwesomeIcon icon={faCrosshairs} />{" "}
                <Translate code="locate_me"></Translate>
              </button>
            </Col>
          </Row>
        </div>
      </FormGroup>
    </>
  );
};

export default FilterGeoloc;
