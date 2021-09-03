import React, { useState } from "react";
import { t } from "../common/Translate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { Button } from "reactstrap";

const UlListEquipment = ({ items, title }) => {
  const [hidden, setHidden] = useState(false);
  const middleIndex = Math.ceil(items.length / 2);
  return (
    <>
      {items !== null && (
        <div className="list-ul-block">
          <div className="section-title">{title}</div>
          <div>
            <ul className="list-ul">
              {items.sort().map((value, index) => {
                if (
                  hidden ||
                  index < 2 ||
                  (index >= middleIndex && index <= middleIndex + 1)
                ) {
                  return (
                    <li key={index}>
                      <FontAwesomeIcon icon={faCircle} />
                      {t(value)}
                    </li>
                  );
                }
              })}
            </ul>
          </div>
          {items.length > 4 && (
            <Button
              style={{ marginBottom: "1rem" }}
              size="sm"
              color="primary"
              onClick={() => {
                setHidden(!hidden);
              }}
            >
              {!hidden ? `${t("read_more")}` : `${t("read_less")}`}
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default UlListEquipment;
