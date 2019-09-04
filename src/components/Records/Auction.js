import React from "react";
import { Row, Col, Form, Button, Input } from "reactstrap";
import moment from "moment";
import Countdown from "./Countdown.js";

const Auction = ({ values }) => {
  if (!values.auctionInfos) {
    return null;
  }
  const secondsLeft = moment().add(values.secondsLeft, "seconds");
  const auctionEnd = new Date(values.auctionInfos.auctionEnd);

  return (
    <>
      <p className="gray font-italic">
        <Countdown endDate={secondsLeft} />
        Fin de l’enchère le {/* {moment().calendar(auctionEnd)} */}
        {auctionEnd.toLocaleDateString([], {
          hour: "2-digit",
          minute: "2-digit"
        })}
      </p>
      {/*       {!values.bestOffer && (
        <div className="section-price text-center">
          <Row>
            <Col>
              <div className="gray font-italic my-2">aucune offre</div>
            </Col>
          </Row>
        </div>
      )} */}

      {/*       {values.bestOffer && (
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
      )} */}

      <Form method="post" className="form-offer mt-4">
        <Row>
          <Col xs="12" lg="7" className="mb-3">
            {/*             <Input
              type="number"
              min={values.minimumNextOffer}
              name="user-offer"
              className="rounded"
              placeholder={`Votre offre (min ${values.minimumNextOffer.toLocaleString()} €)`}
            /> */}
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
