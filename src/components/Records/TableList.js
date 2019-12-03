import React, {useState} from "react";
import { Row } from "reactstrap";
import { t } from "../common/Translate";
import _ from "lodash";
import moment from "moment";
import Cookies from "js-cookie";
let gcDate
function showableValue(key, value, lang) {
  if (value === null || value === "") return false;
  if (typeof value === "object" && _.isEmpty(value)) return false;
  if (key === "fiscal" && lang !== "fr") return false;
  if (key === "power" && renderValue("power", value, lang) === "") return false;
  if (key === "b2cMarketValue" && value < 200) return false
  if (key === "MarketLink") return false
  return true;
}

const calculateOwnerShipDuration = (res) => {
  let years = _.get(res._data, 'years', null)
  let months = _.get(res._data, 'months', null)
  let days =  _.get(res._data, 'days', null)

  let nYears = null
  let nMonths = null

  let durations = {
    days : days,
    months : nMonths ? nMonths : months,
    years : nYears ? nYears : years
  }

  let duration = Object.entries(durations).map(([key, value]) => {
    if(key === "days" && value !== null && value > 20) nMonths = months+1

    if(key === 'months' && value !== null && value !== 0) {
      if(nMonths !== null && (nMonths === 11 || nMonths == 12)) nYears = years+1
      else if (nMonths !== null && nMonths < 11) return `${nMonths} ${t(key)} `
      else if (nMonths === null) return `${value} ${t(key)} `
    }

    if(key === 'years' && value !== null && value !== 0) {
      if(nYears !== null && nYears === 1) return `${nYears} ${t('year')} `
      else if (value !== null && value === 1) return `${value} ${t('year')} `
      else if (nYears !== null && nYears > 1) return `${nYears} ${t(key)} `
      else if (nYears === null) return `${value} ${t(key)} `
    }
  })
  gcDate = null
  return duration
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
    case "ownershipDuration":
      let val
      if(!gcDate){
        gcDate = value
        val = moment(value).format("DD-MM-YYYY");
      }
      if(key == 'ownershipDuration') {
        let res = moment.duration(moment().diff(moment(gcDate)))
        val = calculateOwnerShipDuration(res)
        val = val.reverse()
      }
      return val 
    case "lastServicingDate":
    case "nextTechnicalCheckDate":
    case "lastServicingKm":
      if(key === "lastServicingKm") return parseInt(value).toLocaleString()+' km'
      return moment(value).format("MM-YYYY");
    case "liter":
      let literStr = "";
      if (lang === "de") {
        literStr = `${parseFloat(value) * 1000} ${t("unit_ccm")}`;
      } else {
        literStr = `${Math.ceil(value).toFixed(1)} ${t("unit_liter")}`;
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
