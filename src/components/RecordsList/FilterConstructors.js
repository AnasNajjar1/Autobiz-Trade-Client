import React from "react";
import { FormGroup, Input } from "reactstrap";

const FilterConstructors = ({ constructors, value, updateField }) => {
  const options = constructors.map(constructor => (
    <option key={constructor.id} value={constructor.id}>
      {constructor.name}
    </option>
  ));
  return (
    <>
      <FormGroup>
        <Input
          type="select"
          name="constructor"
          value={value}
          className="mb-2 rounded"
          onChange={e => updateField(e)}
        >
          <option value={""}>---</option>
          {options}
        </Input>
      </FormGroup>
    </>
  );
};

export default FilterConstructors;
