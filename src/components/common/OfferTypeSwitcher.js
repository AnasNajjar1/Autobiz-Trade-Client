import React from "react";

import { t } from "./Translate";
const OfferTypeSwitcher = (props) => {
  return (
    <div className="switcher switcher-offer-type">
      <ul>
        <li className={props.current === "stock" ? "active" : ""}>
          <button
            name="offerType"
            id="offerType"
            value="stock"
            onClick={(e) => props.updateField(e)}
          >
            {t("stock")}
          </button>
        </li>
        <li className={props.current === "offerToPrivate" ? "active" : ""}>
          <button
            name="offerType"
            id="offerType"
            value="offerToPrivate"
            onClick={(e) => props.updateField(e)}
          >
            {t("offerToPrivate")}
          </button>
          {props.countOfferToPrivate ? (
            <span className="bubble">{props.countOfferToPrivate}</span>
          ) : (
            ""
          )}
        </li>
      </ul>
    </div>
  );
};

export default OfferTypeSwitcher;
