import React from "react";
import { FormGroup, Input } from "reactstrap";

const FilterBrands = ({ brands, value, updateField }) => {
  brands = brands.sort();

  const options = brands.map(constructor => (
    <option key={constructor} value={constructor}>
      {constructor}
    </option>
  ));
  return (
    <>
      <FormGroup>
        <Input
          type="select"
          name="brandLabel"
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

export default FilterBrands;
