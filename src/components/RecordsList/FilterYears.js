import React, { useState, useEffect } from "react";
import { Row, Col, FormGroup, Input, Label } from "reactstrap";
const FilterYears = ({ yearMecMin, yearMecMax, updateField }) => {
  const [error, setError] = useState(false);

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
              placeholder="Min"
              name="yearMecMin"
              id="yearMecMin"
              className={error ? "is-invalid" : ""}
              value={yearMecMin}
              onChange={e => updateField(e)}
            />
            <Label for="yearMecMin" className="mini-label">
              Min
            </Label>
            <div className="invalid-feedback">
              L'<b>année min</b> est supérieur à l'<b>année max</b>
            </div>
          </Col>
          <Col>
            <Input
              type="number"
              placeholder="Max"
              name="yearMecMax"
              id="yearMecMax"
              value={yearMecMax}
              onChange={e => updateField(e)}
            />
            <Label for="yearMecMax" className="mini-label">
              Max
            </Label>
          </Col>
        </Row>
      </FormGroup>
    </>
  );
};

export default FilterYears;
