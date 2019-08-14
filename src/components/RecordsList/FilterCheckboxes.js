import React from "react";
import { Row, Col, FormGroup, CustomInput } from "reactstrap";
import shortid from "shortid";
const FilterCheckboxes = ({ data, target, values, updateField, all }) => {
  return (
    <>
      <FormGroup>
        <Row>
          <Col>
            {all && (
              <CustomInput
                id={`cb_${shortid.generate()}`}
                type="checkbox"
                value="all"
                checked={values.includes("all")}
                onChange={e => updateField(e, target)}
                label="Tous"
              />
            )}
            {data.map((item, key) => (
              <CustomInput
                key={shortid.generate()}
                id={`cb_${shortid.generate()}`}
                type="checkbox"
                value={item.id}
                checked={values.includes(item.id) || values.includes("all")}
                onChange={e => updateField(e, target)}
                label={item.name}
              />
            ))}
          </Col>
        </Row>
      </FormGroup>
    </>
  );
};

export default FilterCheckboxes;
