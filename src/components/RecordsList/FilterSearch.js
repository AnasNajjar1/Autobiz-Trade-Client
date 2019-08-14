import React from "react";
import { Input } from "reactstrap";
const FilterSearch = ({ value, onChange }) => {
  return (
    <Input
      type="text"
      name="search"
      className="rounded ico-search"
      placeholder="Recherche"
      value={value}
      onChange={e => onChange(e)}
    />
  );
};

export default FilterSearch;
