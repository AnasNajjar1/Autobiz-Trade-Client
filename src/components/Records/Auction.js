import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Form, Button, Input } from "reactstrap";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";

const Auction = ({ values }) => {
  const [secondsLeft, setSecondsLeft] = useState();
  const [countdown, setCountdown] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    //setSecondsLeft(4);
    setSecondsLeft(values.secondsLeft);
  }, [values]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (secondsLeft <= 0) setIsExpired(true);
      else setSecondsLeft(secondsLeft - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  useEffect(() => {
    const dur = moment.duration(secondsLeft, "seconds");
    let text = "";
    if (dur.days() > 0) countdown = `${dur.days()}j `;

    text += `${dur.hours()}h ${dur.minutes()}m ${dur.seconds()}s`;

    setCountdown(text);
  }, [secondsLeft]);

  if (!values.auctionInfos) {
    return null;
  }

  const auctionEnd = new Date(values.auctionInfos.auctionEnd);

  return (
    <div className="auction">
      <Row>
        <Col xs="12" lg="7" xl="6">
          <div className="countdown">
            <span className="pr-1">Temps restant :</span>
            <FontAwesomeIcon
              icon={faClock}
              className={isExpired ? "text-danger" : "text-success"}
            />
            <span className="pl-1">{countdown}</span>
          </div>
        </Col>
        <Col xs="12" lg="5" xl="6">
          <p className="gray font-italic text-right small">
            Fin de l’enchère le{" "}
            {auctionEnd.toLocaleDateString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}
          </p>
        </Col>
      </Row>

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
            <Button
              block
              color="danger"
              className="rounded"
              disabled={isExpired}
            >
              Faire une offre
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Auction;
