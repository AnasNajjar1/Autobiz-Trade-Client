import React from "react";
import { FormGroup, Input } from "reactstrap";

const FilterLists = ({ lists, value, updateField }) => {
  console.log("LIST", lists);

  lists = lists.sort();

  const options = lists.map((list) => (
    <option key={list} value={list.id}>
      {list.name}
    </option>
  ));
  return (
    <>
      <FormGroup>
        <Input
          type="select"
          name="saleList"
          value={value}
          className="mb-2 rounded"
          onChange={(e) => updateField(e)}
        >
          <option value={""}>---</option>
          {options}
        </Input>
      </FormGroup>
    </>
  );
};

export default FilterLists;
