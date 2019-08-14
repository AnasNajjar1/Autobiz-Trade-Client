import React from "react";
import { FormGroup, Input } from "reactstrap";

const FilterModels = ({ models, value, updateField }) => {
  let options = "";

  if (models) {
    options = models.map(model => (
      <option key={model.id} value={model.id}>
        {model.name}
      </option>
    ));
  }

  return (
    <>
      <FormGroup>
        <Input
          type="select"
          name="model"
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
