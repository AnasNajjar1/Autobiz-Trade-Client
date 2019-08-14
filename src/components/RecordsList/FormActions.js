import React from "react";
import { Row, Col, Button } from "reactstrap";
const FormActions = ({ reset, submit }) => {
  return (
    <>
      <Row>
        <Col>
          <Button color="light" block onClick={reset}>
            Reset
          </Button>
        </Col>
        <Col>
          <Button color="primary" block onClick={submit}>
            Appliquer
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default FormActions;
