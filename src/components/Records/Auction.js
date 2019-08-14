import React from "react";
import { Row, Col, Form, Button, Input } from "reactstrap";
const Auction = ({ values }) => {
  var startDateTime = new Date(values.startDateTime);
  return (
    <>
      <p className="gray font-italic">
        début de l’enchère le{" "}
        <strong>{startDateTime.toLocaleDateString()}</strong> à{" "}
        <strong>
          {startDateTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })}
        </strong>
      </p>
      {!values.bestOffer && (
        <div className="section-price text-center">
          <Row>
            <Col>
              <div className="gray font-italic my-2">aucune offre</div>
            </Col>
          </Row>
        </div>
      )}

      {values.bestOffer && (
        <div className="section-price text-center">
          <Row>
            {values.userOffer && (
              <Col>
                <p className="h5 gray">Votre offre</p>
                <div className="offer-value">
                  <span className="dark font-weight-bold">8 600</span> €
                  <sup>TTC</sup>
                </div>
              </Col>
            )}
            <Col>
              <p className="h5 gray">Meilleure offre</p>
              <div className="offer-value">
                <span className="dark font-weight-bold">
                  {values.bestOffer.toLocaleString()}
                </span>{" "}
                €<sup>TTC</sup>
              </div>
            </Col>
          </Row>
        </div>
      )}

      <Form method="post" className="form-offer mt-4">
        <Row>
          <Col xs="12" lg="7" className="mb-3">
            <Input
              type="number"
              min={values.minimumNextOffer}
              name="user-offer"
              className="rounded"
              placeholder={`Votre offre (min ${values.minimumNextOffer.toLocaleString()} €)`}
            />
          </Col>
          <Col xs="12" lg="5">
            <Button block color="danger" className="rounded">
              Faire une offre
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Auction;
