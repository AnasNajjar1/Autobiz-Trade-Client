import React from "react";
import Translate from "../common/Translate";
import { Row, Col, Button } from "reactstrap";
const FormActions = ({ reset }) => {
  return (
    <>
      <Row>
        <Col>
          <Button outline color="secondary" block onClick={reset}>
            <Translate code="reset"></Translate>
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default FormActions;
