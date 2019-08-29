import React from "react";
import { Row, Col } from "reactstrap";
import Flag from "react-world-flags";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const CheckList = ({ items }) => {
  return (
    <div className="list-check">
      <Row>
        {items.map((value, index) => (
          <Col xs="6" key={index}>
            <div className="item">
              <FontAwesomeIcon icon={faCheckCircle} /> {value}
            </div>
          </Col>
        ))}

        {items.country && (
          <Col xs="6">
            <div className="item">
              <Flag code={items.country.code} height="14" className="mr-2" />
              Origine {items.country.label}
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default CheckList;
