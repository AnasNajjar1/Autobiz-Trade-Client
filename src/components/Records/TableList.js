import React from "react";
import { Row } from "reactstrap";
import { t } from "../common/Translate";
import { type } from "os";

const ListTable = ({ items }) => {
  const renderValue = (key, value) => {
    switch (key) {
      case "wheelsFrontDimensions":
      case "wheelsBackDimensions":
        return `${value.width}/${value.height} R${value.diameter}`;
      case "mileage":
      case "b2cMarketValue":
      case "standardMileage":
        return parseInt(value).toLocaleString();
      default:
        return t(String(value));
    }
  };

  return (
    <div className="list-table">
      <Row>
        {Object.keys(items).map(key => (
          <React.Fragment key={key}>
            <div className="cell">
              <div className="item">
                <div className="label">{t(key)}</div>
                <div className="value" key={key}>
                  {renderValue(key, items[key])}
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </Row>
    </div>
  );
};

export default ListTable;
