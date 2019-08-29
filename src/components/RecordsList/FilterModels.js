import React from "react";
import { FormGroup, Input } from "reactstrap";

const FilterModels = ({ models, value, updateField }) => {
  let options = "";

  models = models.sort();
  if (models) {
    options = models.map(model => (
      <option key={model} value={model}>
        {model}
      </option>
    ));
  }

  return (
    <>
      <FormGroup>
        <Input
          type="select"
          name="modelLabel"
          value={value}
          className="mb-2 rounded"
          onChange={e => updateField(e)}
        >
          <option>---</option>
          {options}
        </Input>
      </FormGroup>
    </>
  );
};

export default FilterModels;
