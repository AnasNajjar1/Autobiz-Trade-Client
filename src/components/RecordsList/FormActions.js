import React from "react";
import Translate from "../common/Translate";
import { Row, Col, Button } from "reactstrap";
const FormActions = ({ reset, submit }) => {
  return (
    <>
      <Row>
        <Col>
          <Button color="light" block onClick={reset}>
            <Translate code="reset"></Translate>
          </Button>
        </Col>
        <Col>
          <Button color="primary" block onClick={submit}>
            <Translate code="apply"></Translate>
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default FormActions;
