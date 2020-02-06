import React, { useState, useEffect } from "react";
import Translate, { t } from "../common/Translate";
import { Row, Col, FormGroup, Input, Label } from "reactstrap";
const FilterYears = ({ yearMecMin, yearMecMax, updateField, updateSearch }) => {
  const [error, setError] = useState(false);

  const handleKeyDown = e => {
    if (e.key === "Enter") {
      updateSearch();
    }
  };

  useEffect(() => {
    if (parseInt(yearMecMin, 10) > parseInt(yearMecMax, 10)) {
      setError(true);
    } else {
      setError(false);
    }
  }, [yearMecMin, yearMecMax]);

  return (
    <>
      <FormGroup>
        <Row>
          <Col>
            <Input
              type="number"
              placeholder={t("min")}
              name="yearMecMin"
              id="yearMecMin"
              className={error ? "is-invalid" : ""}
              value={yearMecMin}
              onBlur={() => updateSearch()}
              onKeyDown={e => handleKeyDown(e)}
              onChange={e => updateField(e)}
            />
            <Label for="yearMecMin" className="mini-label">
              <Translate code="min"></Translate>
            </Label>
            <div className="invalid-feedback">
              <Translate code="year_mec_min_is_bigger_than_max" />
            </div>
          </Col>
          <Col>
            <Input
              type="number"
              placeholder={t("max")}
              name="yearMecMax"
              id="yearMecMax"
              value={yearMecMax}
              onBlur={() => updateSearch()}
              onKeyDown={e => handleKeyDown(e)}
              onChange={e => updateField(e)}
            />
            <Label for="yearMecMax" className="mini-label">
              <Translate code="max"></Translate>
            </Label>
          </Col>
        </Row>
      </FormGroup>
    </>
  );
};

export default FilterYears;
