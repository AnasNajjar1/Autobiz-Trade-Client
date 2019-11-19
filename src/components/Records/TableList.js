import React from "react";
import { Row } from "reactstrap";
import { t } from "../common/Translate";
import _ from "lodash";
import moment from "moment";
import Cookies from "js-cookie";

function showableValue(key, value, lang) {
  if (value === null || value === "") return false;
  if (typeof value === "object" && _.isEmpty(value)) return false;
  if (key === "fiscal" && lang !== "fr") return false;
  if (key === "power" && renderValue("power", value, lang) === "") return false;
  return true;
}

const renderValue = (key, value, lang) => {
  switch (key) {
    case "wheelsFrontDimensions":
    case "wheelsBackDimensions":
      return `${value.width}/${value.height} R${value.diameter}`;

    case "mileage":
    case "b2cMarketValue":
    case "standardMileage":
      return parseInt(value).toLocaleString();
    case "gcDate":
      return moment(value).format("DD-MM-YYYY");
    case "lastServicingDate":
    case "nextTechnicalCheckDate":
      return moment(value).format("MM-YYYY");
    case "liter":
      let literStr = "";
      if (lang === "de") {
        literStr = `${parseFloat(value) * 1000} ${t("unit_ccm")}`;
      } else {
        literStr = `${Math.ceil(value)} ${t("unit_liter")}`;
      }
      return literStr;
    case "fiscal":
      return `${value} CV`;
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
    case "purchaseInvoice":
    case "servicingManualPicture":
      return (
        <>
          {t("yes")}{" "}
          <a href={value} target="_blank" rel="noopener noreferrer">
            {t("download_invoice")}
          </a>
        </>
      );
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
            showableValue(key, items[key], lang) &&
              key !== 'origin' && <React.Fragment key={key}>
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
          }
      </Row>
    </div>
  );
};

export default ListTable;
