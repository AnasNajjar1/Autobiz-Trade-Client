import React, { useState, useEffect } from "react";
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
              placeholder="Min"
              name="kmMin"
              id="kmMin"
              className={error ? "is-invalid" : ""}
              value={kmMin}
              onChange={e => updateField(e)}
            />
            <Label for="kmMin" className="mini-label">
              Min
            </Label>
            <div className="invalid-feedback">
              Le <b>KM min</b> est supérieur au <b>KM max</b>
            </div>
          </Col>
          <Col>
            <Input
              type="number"
              placeholder="Max"
              name="kmMax"
              id="kmMax"
              value={kmMax}
              onChange={e => updateField(e)}
            />
            <Label for="kmMax" className="mini-label">
              Max
            </Label>
          </Col>
        </Row>
      </FormGroup>
    </>
  );
};

export default FilterKilometers;
