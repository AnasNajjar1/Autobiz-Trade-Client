import React from "react";
import { Row } from "reactstrap";

const ListTable = ({ items }) => {
  const renderValue = (key, value) => {
    switch (key) {
      case "wheelsFrontDimensions":
      case "wheelsBackDimensions":
        return `${value.width}/${value.height} R${value.diameter}`;
      default:
        return String(value);
    }
  };

  return (
    <div className="list-table">
      <Row>
        {Object.keys(items).map(key => (
          <React.Fragment key={key}>
            <div className="cell">
              <div className="item">
                <div className="label">{key}</div>
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
