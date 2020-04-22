import React from "react";
import { t } from "../common/Translate";
import { Input } from "reactstrap";

const FilterSearch = ({ value, updateField, updateSearch }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      updateSearch();
    }
  };

  return (
    <Input
      type="text"
      name="search"
      className="rounded ico-search"
      placeholder={t("search")}
      bsSize="sm"
      value={value}
      onBlur={() => updateSearch()}
      onKeyDown={(e) => handleKeyDown(e)}
      onChange={(e) => updateField(e)}
    />
  );
};

export default FilterSearch;
