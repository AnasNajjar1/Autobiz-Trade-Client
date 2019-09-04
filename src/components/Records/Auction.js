import React, { useState, useEffect } from "react";
import axios from "axios";
import _ from "lodash";
import { Row, Col, Form, Button, Input } from "reactstrap";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";

const Auction = ({ refId }) => {
  const [secondsLeft, setSecondsLeft] = useState();
  const [countdown, setCountdown] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [auction, setAuction] = useState([]);
  const [userAuctionAmout, setUserAuctionAmout] = useState([]);
  const [refresh, setRefresh] = useState(true);

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
        const result = await axios.get(
          `${process.env.REACT_APP_API}/auction?id=${refId}`
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
    //setSecondsLeft(5);
    setSecondsLeft(auction.secondsLeft);
  }, [auction]);

  useEffect(() => {
    const intervalCountdown = setInterval(() => {
      if (secondsLeft <= 0) setIsExpired(true);
      else setSecondsLeft(secondsLeft - 1);
    }, 1000);
    return () => clearInterval(intervalCountdown);
  }, [secondsLeft]);

  useEffect(() => {
    const dur = moment.duration(secondsLeft, "seconds");
    let text = "";
    if (dur.days() > 0) countdown = `${dur.days()}j `;

    text += `${dur.hours()}h ${dur.minutes()}m ${dur.seconds()}s`;

    setCountdown(text);
  }, [secondsLeft]);

  if (!auction.auctionInfos) {
    return null;
  }

  const auctionEnd = new Date(auction.auctionInfos.auctionEnd);

  const { maxAuction, userAuctions, userWin } = auction.auctionInfos;

  const startPrice = 1;
  const auctionStep = 100;
  let minOffer = maxAuction > 0 ? maxAuction + auctionStep : startPrice;

  const sortedUserActions = _.orderBy(userAuctions, "timestamp", "desc");

  const lastUserAuctionAmount =
    sortedUserActions[0] && sortedUserActions[0].amount;

  const handleSubmit = e => {
    e.preventDefault();

    axios.put(`${process.env.REACT_APP_API}/auction`, {
      id: refId,
      amount: userAuctionAmout
    });
  };

  const handleChange = e => {
    setUserAuctionAmout(e.target.value);
  };

  return (
    <div className="auction">
      <Row>
        <Col xs="12" lg="7" xl="6">
          {!isExpired && (
            <div className="countdown">
              <span className="pr-1">Temps restant :</span>
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
            {isExpired ? "Enchère terminée le " : "Fin de l’enchère le "}

            {auctionEnd.toLocaleDateString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}
          </p>
        </Col>
      </Row>
      <p>
        <span className="gray">Mise à prix :</span>{" "}
        <strong>{startPrice.toLocaleString()}</strong> € <sup>TTC</sup>
      </p>
      <div className="section-price">
        <Row>
          {lastUserAuctionAmount > 0 && (
            <Col
              xs="12"
              sm="6"
              md="12"
              lg="6"
              className={userWin ? "text-success" : "gray"}
            >
              <p className="h5">Votre offre</p>
              <div className="offer-value">
                <span className="font-weight-bold">
                  {lastUserAuctionAmount.toLocaleString()}
                </span>{" "}
                €<sup>TTC</sup>
              </div>
            </Col>
          )}

          <Col>
            {maxAuction === 0 && (
              <div className="gray font-italic my-2">aucune offre</div>
            )}
            {maxAuction > 0 && (
              <>
                <p className="h5 gray ">Meilleure offre</p>
                <div className="offer-value">
                  <span className="dark font-weight-bold">
                    {maxAuction.toLocaleString()}
                  </span>{" "}
                  €<sup>TTC</sup>
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
                type="number"
                min={minOffer}
                name="user-offer"
                className="rounded"
                onChange={handleChange}
                disabled={isExpired}
                placeholder={`Votre offre (min  ${minOffer.toLocaleString()}€)`}
              />
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
      )}
    </div>
  );
};

export default Auction;
