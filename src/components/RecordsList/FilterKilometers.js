import React, { useState, useEffect } from "react";
import Translate, { t } from "../common/Translate";
import { Row, Col, FormGroup, Input, Label } from "reactstrap";

const FilterKilometers = ({ mileageMin, mileageMax, updateField }) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    if (parseInt(mileageMin, 10) > parseInt(mileageMax, 10)) {
      setError(true);
    } else {
      setError(false);
    }
  }, [mileageMin, mileageMax]);

  return (
    <>
      <FormGroup>
        <Row>
          <Col>
            <Input
              type="number"
              placeholder={t("min")}
              name="mileageMin"
              id="mileageMin"
              className={error ? "is-invalid" : ""}
              value={mileageMin}
              onChange={e => updateField(e)}
            />
            <Label for="mileageMin" className="mini-label">
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
              name="mileageMax"
              id="mileageMax"
              value={mileageMax}
              onChange={e => updateField(e)}
            />
            <Label for="mileageMax" className="mini-label">
              <Translate code="max" />
            </Label>
          </Col>
        </Row>
      </FormGroup>
    </>
  );
};

export default FilterKilometers;
