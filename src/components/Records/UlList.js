import React from "react";
import { t } from "../common/Translate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const UlList = ({ items, title }) => {
  return (
    <>
      {items !== null && (
        <div className="list-ul-block">
          <div className="section-title">{title}</div>
          <ul className="list-ul">
            {items.map((value, key) => (
              <li key={key}>
                <FontAwesomeIcon icon={faCircle} />
                {t(value)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default UlList;
