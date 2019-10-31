import React from "react";
import { t } from "../common/Translate";
import { Input } from "reactstrap";

const FilterSearch = ({ value, onChange, onKeyDown }) => {
  return (
    <Input
      type="text"
      name="search"
      className="rounded ico-search"
      placeholder={t("search")}
      value={value}
      onChange={e => onChange(e)}
      onKeyDown={e => onKeyDown(e)}
    />
  );
};

export default FilterSearch;
