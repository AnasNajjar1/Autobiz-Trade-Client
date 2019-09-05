import React from "react";
import { t } from "../common/Translate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const UlList = ({ items }) => {
  return (
    <ul className="list-ul">
      {items.map((value, index) => (
        <li key={index}>
          <FontAwesomeIcon icon={faCircle} />
          {t(value)}
        </li>
      ))}
    </ul>
  );
};

export default UlList;
