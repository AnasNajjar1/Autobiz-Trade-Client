import React from "react";
import { FormGroup, Input } from "reactstrap";

const Sort = ({ list, value, sort }) => {
  let options = "";

  if (list) {
    options = list.map((item, key) => (
      <option key={key} value={item.value}>
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
