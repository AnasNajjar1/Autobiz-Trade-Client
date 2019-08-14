import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const UlList = ({ items }) => {
  return (
    <ul className="list-ul">
      {items.map((value, index) => (
        <li key={index}>
          <FontAwesomeIcon icon={faCircle} />
          {value}
        </li>
      ))}
    </ul>
  );
};

export default UlList;
