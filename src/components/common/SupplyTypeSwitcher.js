import React from "react";

import { t } from "./Translate";
const SupplyTypeSwitcher = (props) => {
  return (
    <div className="switcher switcher-offer-type">
      <ul>
        <li className={props.current === "STOCK" ? "active" : ""}>
          <button
            name="supplyType"
            id="supplyType"
            value="STOCK"
            onClick={(e) => props.updateField(e)}
          >
            {t("stock")}
          </button>
        </li>
        <li className={props.current === "OFFER_TO_PRIVATE" ? "active" : ""}>
          <button
            name="supplyType"
            id="supplyType"
            value="OFFER_TO_PRIVATE"
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

export default SupplyTypeSwitcher;
