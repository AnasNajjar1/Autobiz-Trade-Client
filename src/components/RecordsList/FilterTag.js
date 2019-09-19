import React from "react";
import { t } from "../common/Translate";
import close from "../../assets/img/ico-close-small.png";
const FilterTag = ({ label, value, target, removeFilter }) => {
  if (value) {
    return (
      <span className="tag tag-gray mr-1">
        <b>{t(label)}: </b> {t(value)}
        <img
          src={close}
          className="tag-close"
          onClick={() => removeFilter(target)}
          alt="x"
        />
      </span>
    );
  }
  return null;
};

export default FilterTag;
