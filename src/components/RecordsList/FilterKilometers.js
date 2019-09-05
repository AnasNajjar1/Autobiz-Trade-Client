import React, { useState, useEffect } from "react";
import Translate, { t } from "../common/Translate";
import { Row, Col, FormGroup, Input, Label } from "reactstrap";

const FilterKilometers = ({ kmMin, kmMax, updateField }) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    if (parseInt(kmMin, 10) > parseInt(kmMax, 10)) {
      setError(true);
    } else {
      setError(false);
    }
  }, [kmMin, kmMax]);

  return (
    <>
      <FormGroup>
        <Row>
          <Col>
            <Input
              type="number"
              placeholder={t("min")}
              name="kmMin"
              id="kmMin"
              className={error ? "is-invalid" : ""}
              value={kmMin}
              onChange={e => updateField(e)}
            />
            <Label for="kmMin" className="mini-label">
              <Translate code="min" />
            </Label>
            <div className="invalid-feedback">
              <Translate code="km_min_is_bigger_than_max" />
            </div>
          </Col>
          <Col>
            <Input
              type="number"
              placeholder={t("max")}
              name="kmMax"
              id="kmMax"
              value={kmMax}
              onChange={e => updateField(e)}
            />
            <Label for="kmMax" className="mini-label">
              <Translate code="max" />
            </Label>
          </Col>
        </Row>
      </FormGroup>
    </>
  );
};

export default FilterKilometers;
