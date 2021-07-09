import React, { useState, useEffect } from "react";
import Translate, { t } from "../common/Translate";
import { Row, Col, FormGroup, Input, Label } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrosshairs } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import { Api } from "../../providers/Api";

const FilterGeoloc = ({
  country,
  zipCode,
  radius,
  lat,
  lng,
  updateField,
  updatePosition,
  stockageNbr,
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
    const { name, value, checked } = e.target;
    if (checked) {
      if (value === "all") {
        country = ["fr", "es", "de", "pt", "it"];
      } else {
        if (!country.includes(value)) country.push(value);
      }
    } else {
      if (value === "all") {
        country = [];
      } else {
        country = _.filter(country, (c) => c !== value);
      }
    }
    updateField({ ...e, target: { name, value: country } });
  };

  const handleChangeZipcode = (e) => {
    updateField(e);
  };

  const getPosition = async () => {
    try {
      const data = {
        country: countries.find((e) => e.code === country[0]).name,
        zipCode,
      };
      const response = await Api.request("POST", `/geoloc/`, {}, data);

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
      countries
        .find((e) => e.code === country[0])
        .zipCodeRegex.exec(zipCode) !== null
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
            <div className="form-check storage-bloc mb-2">
              <input
                type="checkbox"
                name="country"
                className="form-check-input"
                value="all"
                checked={country.length === 5}
                onClick={(e) => handleChangeCountry(e)}
              />{" "}
              {t("all")}
              <br />
              {Object.values(countries).map((c, i) => {
                let number = _.find(
                  stockageNbr,
                  (nbr, country) => c.code === country
                );
                return (
                  <>
                    <input
                      key={i}
                      type="checkbox"
                      name="country"
                      className="form-check-input"
                      value={c.code}
                      checked={country.includes(c.code) || country.length === 5}
                      onClick={(e) => handleChangeCountry(e)}
                    />
                    {t(c.name)} {number && `(${number})`}
                    <br />
                  </>
                );
              })}
            </div>
          </Col>
        </Row>
        <div className={country.length !== 1 ? "d-none" : ""}>
          <Row className="mt-2">
            <Col>
              <Input
                type="text"
                name="zipCode"
                id="zipCode"
                disabled={country.length === 5}
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
