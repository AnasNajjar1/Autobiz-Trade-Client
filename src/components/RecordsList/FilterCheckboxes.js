import React from "react";
import { Row, Col, FormGroup, CustomInput } from "reactstrap";
import shortid from "shortid";
import Translate, { t } from "../common/Translate";

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
                label={t("all")}
              />
            )}
            {data.map((item, key) => (
              <CustomInput
                key={shortid.generate()}
                id={`cb_${shortid.generate()}`}
                type="checkbox"
                value={item.toString()}
                checked={values.includes(item) || values.includes("all")}
                onChange={e => updateField(e, target)}
                label={item.toString()}
              />
            ))}
          </Col>
        </Row>
      </FormGroup>
    </>
  );
};

export default FilterCheckboxes;
