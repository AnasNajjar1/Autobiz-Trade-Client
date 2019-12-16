import React, { useState } from "react";
import { Row } from "reactstrap";
import { t, durationTranslate } from "../common/Translate";
import _ from "lodash";
import moment from "moment";
import Cookies from "js-cookie";

//remove uncomplete data or unwanted data
function showableValue(key, value, lang) {
  if (value === undefined || value === null || value === "") return false;
  if (typeof value === "object" && _.isEmpty(value)) return false;
  if (key === "fiscal" && lang !== "fr") return false;
  if (key === "origin") return false;
  if (key === "power" && renderValue("power", value, lang) === "") return false;
  if (key === "b2cMarketValue" && value < 200) return false;
  if (key === "MarketLink") return false
  return true;
}

const renderValue = (key, value, lang) => {
  switch (key) {
    //wheels format
    case "wheelsFrontDimensions":
    case "wheelsBackDimensions":
      return `${value.width}/${value.height} R${value.diameter}`;

    //€ values
    case "b2cMarketValue":
      return `${parseInt(value).toLocaleString()} €`;

    //km values
    case "mileage":
    case "lastServicingKm":
    case "standardMileage":
      return `${parseInt(value).toLocaleString()} ${t("km")}`;

    //date DD-MM-YYYY values
    case "gcDate":
      return moment(value).format("DD-MM-YYYY");

    //date MM-YYYY values
    case "nextTechnicalCheckDate":
    case "firstRegistrationDate":
    case "lastServicingDate":
    case "lastTechnicalCheckDate":
      return moment(value).format("MM-YYYY");

    //liter display
    case "liter":
      let literStr = "";
      if (lang === "de") {
        literStr = `${parseFloat(value) * 1000} ${t("unit_ccm")}`;
      } else {
        literStr = `${Math.ceil(value).toFixed(1)} ${t("unit_liter")}`;
      }
      return literStr;

    //fiscal display
    case "fiscal":
      return `${value} CV`;

    //power display
    case "power":
      let powerOutput = "";

      if (showableValue("kw", value.kw)) {
        powerOutput += `${value.kw} ${t("unit_kw")}`;
      }

      if (showableValue("ch", value.ch) && showableValue("kw", value.kw)) {
        powerOutput += " / ";
      }

      if (showableValue("ch", value.ch)) {
        powerOutput += `${value.ch} ${t("unit_ch")}`;
      }

      return powerOutput;

    //link dispay
    case "purchaseInvoice":
    case "servicingManualPicture":
      return (
        <>
          {t("yes")}{" "}
          <a href={value} target="_blank" rel="noopener noreferrer">
            {t(_.camelCase([`download`, key]))}
          </a>
        </>
      );
    
      //duration display
    case "ownershipDuration" : 
    return durationTranslate(value, ["y", "mo"], true)
    default:
      return t(String(value));
  }
};

const ListTable = ({ items }) => {
  let lang = Cookies.get("appLanguage");
  return (
    <div className="list-table">
      <Row>
        {Object.keys(items).map(
          key =>
            showableValue(key, items[key], lang) && (
              <React.Fragment key={key}>
                <div className="cell">
                  <div className="item">
                    <div className="label">{t(key)}</div>
                    <div className="value" key={key}>
                      {renderValue(key, items[key], lang)}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )
        )}
      </Row>
    </div>
  );
};

export default ListTable;
