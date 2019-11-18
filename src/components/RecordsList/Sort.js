import React from "react";
import { FormGroup, Input } from "reactstrap";
import { t } from "../common/Translate";

const Sort = ({ list, value, sort }) => {
  let options = "";
console.log(list)
  if (list) {
    options = list.map((item, key) => (
      <option key={key} value={item}>
        {t(item)}
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
