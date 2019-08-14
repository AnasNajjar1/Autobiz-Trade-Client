import React from "react";
import close from "../../assets/img/ico-close-small.png";
const FilterTag = ({ label, value, target, removeFilter }) => {
  if (value) {
    return (
      <span className="tag tag-gray mr-1">
        <b>{label}: </b> {value}
        <img
          src={close}
          className="tag-close"
          /* onclick="resetField('select_vo_marque');" */
          onClick={() => removeFilter(target)}
          alt="x"
        />
      </span>
    );
  }
  return null;
};

export default FilterTag;
