import React, { useState, useEffect } from "react";
import Translate, { t } from "../common/Translate";
import Countdown from "../common/Countdown";
import { API } from "aws-amplify";
import _ from "lodash";
import { Row, Col, Form, Button, Input } from "reactstrap";

const Auction = ({ refId }) => {
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
        if (result.data.secondsLeft > 0) {
          setIsExpired(false);
        } else {
          setIsExpired(true);
        }
        setAuction(result.data);
      } catch (error) {}
    };
    if (refresh) {
      fetchAuction();
    }
  }, [refresh]);

  const {
    minimalPrice = 0,
    secondsLeft = 0,
    bestOffer = 0,
    stepPrice = 0,
    userWin = false,
    bestUserOffer = 0
  } = auction;
  const endDateTime = new Date(auction.endDateTime);
  let minOffer = 0;

  if (bestOffer > 0) {
    minOffer = bestOffer + stepPrice;
  } else {
    minOffer = minimalPrice;
  }

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
    <div className="section radius mb-4 py-4">
      <div className="auction">
        <Row>
          <Col>
            <Countdown secondsLeft={secondsLeft} />
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
          <Form
            method="post"
            className="form-offer mt-4"
            onSubmit={handleSubmit}
          >
            <Row>
              <Col xs="12" lg="7" className="mb-3">
                <Input
                  type="number"
                  min={minOffer}
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
    </div>
  );
};

export default Auction;
