import React from "react";
import { Row } from "reactstrap";

const ListTable = ({ items }) => {
  return (
    <div className="list-table">
      <Row>
        {items.map((item, index) => (
          <div className="cell" key={index}>
            <div className="item">
              <div className="label">{item.label}</div>
              {item.value.map((value, index) => (
                <div className="value" key={index}>
                  {value}
                </div>
              ))}
            </div>
          </div>
        ))}
      </Row>
    </div>
  );
};

export default ListTable;
