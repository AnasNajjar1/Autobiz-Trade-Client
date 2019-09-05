import React from "react";
import { FormGroup, Input } from "reactstrap";

const Sort = ({ list, value, sort }) => {
  let options = "";

  if (list) {
    options = list.map(item => (
      <option key={item.id} value={item.id}>
        {item.name}
      </option>
    ));
  }

  return (
    <>
      <FormGroup>
        <Input
          type="select"
          name="sort"
          value={value}
          bsSize="sm"
          className="rounded mb-3"
          onChange={e => sort(e.target.value)}
        >
          {options}
        </Input>
      </FormGroup>
    </>
  );
};

export default Sort;
