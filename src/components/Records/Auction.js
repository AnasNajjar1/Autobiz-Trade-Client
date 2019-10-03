import React, { useState, useEffect, useRef } from "react";
import Translate, { t } from "../common/Translate";
import { API } from "aws-amplify";
import _ from "lodash";
import { Row, Col, Form, Button, Input } from "reactstrap";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";

const Auction = ({ refId }) => {
  const [secondsLeft, setSecondsLeft] = useState();
  const [countdown, setCountdown] = useState("");
  const [isExpired, setIsExpired] = useState(true);
  const [auction, setAuction] = useState([]);
  const [userAuctionAmout, setUserAuctionAmout] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const refreshTime = 5 * 1000;

  useEffect(() => {
    const intervalRefresh = setInterval(() => {
      setRefresh(true);
    }, refreshTime);
    return () => clearInterval(intervalRefresh);
  }, [refId]);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const result = await API.get(
          "b2bPlateform",
          `/vehicle/${refId}/auction`,
          {
            response: true
          }
        );

        setAuction(result.data);
        setRefresh(false);
      } catch (error) {}
    };
    if (refresh) {
      fetchAuction();
    }
  }, [refresh]);

  useEffect(() => {
    setSecondsLeft(auction.secondsLeft);
  }, [auction]);

  useEffect(() => {
    const intervalCountdown = setInterval(() => {
      if (secondsLeft <= 0) {
        setIsExpired(true);
      } else {
        setSecondsLeft(secondsLeft - 1);
        setIsExpired(false);
      }
    }, 1000);
    return () => clearInterval(intervalCountdown);
  }, [secondsLeft]);

  const padLeft = (nr, n, str) => {
    return Array(n - String(nr).length + 1).join(str || "0") + nr;
  };

  useEffect(() => {
    const dur = moment.duration(secondsLeft, "seconds");
    let text = "";

    if (dur.days() === 1) text = `${dur.days()} ${t("day_and")} `;
    if (dur.days() > 1) text = `${dur.days()} ${t("days_and")} `;

    text += `${padLeft(dur.hours(), 2)}:${padLeft(dur.minutes(), 2)}:${padLeft(
      dur.seconds(),
      2
    )}`;

    setCountdown(text);
  }, [secondsLeft]);

  const {
    minimalPrice = 0,
    bestOffer = 0,
    stepPrice = 0,
    userWin = false,
    bestUserOffer = 0
  } = auction;
  const endDateTime = new Date(auction.endDateTime);
  const minOffer = bestOffer + stepPrice;

  const handleSubmit = e => {
    e.preventDefault();
    e.target.reset();
    const putAuction = async () => {
      try {
        const result = await API.post(
          "b2bPlateform",
          `/vehicle/${refId}/auction`,
          {
            body: {
              amount: userAuctionAmout
            },
            response: true
          }
        );

        setAuction(result.data);
      } catch (error) {
        alert(error);
      }
    };
    putAuction();
  };

  const handleChange = e => {
    setUserAuctionAmout(e.target.value);
  };

  if (_.isEmpty(auction)) {
    return null;
  }

  return (
    <div className="auction">
      <Row>
        <Col xs="12" lg="7" xl="6">
          {!isExpired && (
            <div className="countdown">
              <span className="pr-1">
                <Translate code="time_left" /> :
              </span>
              <FontAwesomeIcon
                icon={faClock}
                className={isExpired ? "text-danger" : "text-success"}
              />
              <span className="pl-1">{countdown}</span>
            </div>
          )}
        </Col>
        <Col xs="12" lg="5" xl="6">
          <p className="gray font-italic text-right small">
            {isExpired
              ? `${t("auction_closed_on")} `
              : `${t("end_of_the_auction")}`}{" "}
            {endDateTime.toLocaleDateString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}
          </p>
        </Col>
      </Row>
      <p>
        <span className="gray">
          <Translate code="start_price" /> :
        </span>{" "}
        <strong>{minimalPrice.toLocaleString()}</strong> € <sup>TTC</sup>
      </p>
      <div className="section-price">
        <Row>
          {bestUserOffer > 0 && (
            <Col
              xs="12"
              sm="6"
              md="12"
              lg="6"
              className={userWin ? "text-success" : "gray"}
            >
              <p className="h5">
                <Translate code="your_offer" />
              </p>
              <div className="offer-value">
                <span className="font-weight-bold">
                  {bestUserOffer.toLocaleString()}
                </span>{" "}
                €
                <sup>
                  <Translate code="ttc" />
                </sup>
              </div>
            </Col>
          )}

          <Col>
            {bestOffer === 0 && (
              <div className="gray font-italic my-2">
                <Translate code="no_offer" />
              </div>
            )}
            {bestOffer > 0 && (
              <>
                <p className="h5 gray ">
                  <Translate code="best_offer" />
                </p>
                <div className="offer-value">
                  <span className="dark font-weight-bold">
                    {bestOffer.toLocaleString()}
                  </span>{" "}
                  €
                  <sup>
                    <Translate code="ttc" />
                  </sup>
                </div>
              </>
            )}
          </Col>
        </Row>
      </div>
      {!isExpired && (
        <Form method="post" className="form-offer mt-4" onSubmit={handleSubmit}>
          <Row>
            <Col xs="12" lg="7" className="mb-3">
              <Input
                /*                type="number"
                min={minOffer} */
                name="user-offer"
                className="rounded"
                onChange={handleChange}
                disabled={isExpired}
                required={true}
                placeholder={`${t("your_offer")} (${t(
                  "min"
                )}  ${minOffer.toLocaleString()}€)`}
              />
            </Col>
            <Col xs="12" lg="5">
              <Button
                block
                color="danger"
                className="rounded"
                disabled={isExpired}
              >
                <Translate code="make_an_offer" />
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </div>
  );
};

export default Auction;
