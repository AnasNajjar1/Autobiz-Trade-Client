import React from "react";
import { t } from "../common/Translate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const UlList = ({ items }) => {
  return (<>
      {items !== null && Object.entries(items).map(([key, item])=>(
      <div key={key}>
          <div className="section-title">
            {t(key)}
          </div>
          <ul className="list-ul">
            {Object.entries(item).map(([index, value]) => (
              <li key={index}>
                <FontAwesomeIcon icon={faCircle} />
                {t(value)}
              </li>
            ))}
          </ul>
          </div>
      ))}
    </>
  );
};

export default UlList;
