import React, { useState, useEffect } from "react";
import Translate, { t } from "../common/Translate";
import Countdown from "../common/Countdown";
import { API } from "aws-amplify";
import _ from "lodash";
import {
  Row,
  Col,
  Form,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Cookies from "js-cookie";
import Tooltip from "../common/Tooltip";

const Auction = ({ refId, bookmarked }) => {
  const [isExpired, setIsExpired] = useState(true);

  const [auction, setAuction] = useState({});
  const [userAuctionAmout, setUserAuctionAmout] = useState(false);

  const [modal, setModal] = useState(false);
  const [offerIsValid, setOfferIsValid] = useState(false);

  const toggleModal = () => setModal(!modal);

  const second = 1000;
  const refreshTime = 5 * second;
  const lang = Cookies.get("appLanguage");

  useEffect(() => {
    fetchAuction();
    const intervalRefresh = setInterval(() => {
      if (!isExpired) {
        fetchAuction();
      }
    }, refreshTime);
    return () => clearInterval(intervalRefresh);
  }, [refId, isExpired]);

  const fetchAuction = async () => {
    try {
      const result = await API.get(
        "b2bPlateform",
        `/vehicle/${refId}/auction`,
        {
          response: true,
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

  const {
    minimalPrice = 0,
    secondsLeft = 0,
    bestOffer = 0,
    stepPrice = 0,
    userWin = false,
    bestUserOffer = 0,
    statusName,
  } = auction;

  const endDateTime = new Date(auction.endDateTime);
  let minOffer = 0;

  if (bestOffer > 0) {
    minOffer = bestOffer + stepPrice;
  } else {
    minOffer = minimalPrice;
  }

  const handleSubmitAuction = (e) => {
    e.preventDefault();
    setModal(false);
    const postData = {
      amount: userAuctionAmout,
    };

    setUserAuctionAmout(false);
    setOfferIsValid(false);

    const putAuction = async () => {
      try {
        const result = await API.post(
          "b2bPlateform",
          `/vehicle/${refId}/auction`,
          {
            body: postData,
            response: true,
          }
        );

        setAuction(result.data);
      } catch (e) {
        alert(e);
      }
    };
    putAuction();
  };

  const handleSubmitImmediatePurchase = (e) => {
    e.preventDefault();
    e.target.reset();
    setModal(false);

    const putAuction = async () => {
      try {
        const result = await API.post(
          "b2bPlateform",
          `/vehicle/${refId}/auction`,
          {
            body: {},
            response: true,
          }
        );

        setAuction(result.data);
      } catch (e) {
        alert(e);
      }
    };
    putAuction();
  };

  const handleChangeOffer = (e) => {
    setUserAuctionAmout(e.target.value);
    if (isNaN(parseInt(e.target.value))) {
      setOfferIsValid(false);
    } else if (parseInt(e.target.value) < minOffer) {
      setOfferIsValid(false);
    } else {
      setOfferIsValid(true);
    }
  };

  const closingMessage = () => {
    let message = "";
    if (isExpired) {
      if (auction.salesType === "auction") message += t("auction_closed_on");
      if (auction.salesType === "immediatePurchase")
        message += t("sales_closed_on");
    } else {
      if (auction.salesType === "auction") message += t("end_of_the_auction");
      if (auction.salesType === "immediatePurchase")
        message += t("end_of_the_sale");
    }
    message +=
      " " +
      endDateTime.toLocaleDateString([lang], {
        hour: "2-digit",
        minute: "2-digit",
      });
    return message;
  };

  if (_.isEmpty(auction)) {
    return null;
  }

  if (auction.salesType === "immediatePurchase") {
    let purchasable = true;
    if (bestOffer) {
      purchasable = false;
    }

    if (isExpired) {
      purchasable = false;
    }

    if (statusName !== "online") {
      purchasable = false;
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
                {closingMessage()}
              </p>
            </Col>
          </Row>

          <div className="section-price">
            <Row>
              <Col>
                <p className="h5 gray">{t("immediate_purchase")}</p>
                <div className="offer-value">
                  <span className="dark font-weight-bold">
                    {minimalPrice.toLocaleString()}
                  </span>{" "}
                  €<sup>{t("ttc")}</sup>
                </div>
              </Col>
            </Row>
          </div>

          {statusName === "sold" && (
            <p className="text-center text-danger mt-3 mb-0">
              {t("this_vehicle_has_been_sold")}
            </p>
          )}
          {isExpired && (
            <p className="text-center text-danger mt-3 mb-0">
              {t("too_late_sale_is_closed\n\n")}
            </p>
          )}
          {userWin && (
            <p className="text-center text-success mt-3 mb-0">
              {t("purchase_in_process")}
            </p>
          )}
          {!userWin && bestOffer && (
            <p className="text-center text-success mt-3 mb-0">
              {t("this_vehicle_has_been_sold")}
            </p>
          )}

          {purchasable && (
            <div className="text-center mt-3">
              <Button
                color="danger"
                className="rounded px-5"
                disabled={isExpired}
                onClick={toggleModal}
              >
                {t("buy")}
              </Button>

              <Modal isOpen={modal} toggle={toggleModal}>
                <ModalBody>
                  <p className="text-center">
                    {t("confirm_message_immediate_purchase")}
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="secondary"
                    className="rounded"
                    onClick={toggleModal}
                  >
                    {t("cancel")}
                  </Button>
                  <Form method="post" onSubmit={handleSubmitImmediatePurchase}>
                    <Button color="danger" className="rounded">
                      {t("confirm_buy")}
                    </Button>{" "}
                  </Form>
                </ModalFooter>
              </Modal>

              <Tooltip>{t("info_immediate_purchase")}</Tooltip>
            </div>
          )}
        </div>
      </div>
    );
  } else if (auction.salesType === "auction") {
    return (
      <div className="section radius mb-4 py-4">
        <div className="auction">
          <Row>
            <Col>
              <Countdown secondsLeft={secondsLeft} />
            </Col>

            <Col xs="12" lg="5" xl="6">
              <p className="gray font-italic text-right small">
                {closingMessage()}
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="mb-0">
                <span className="gray">
                  <Translate code="start_price" />
                </span>
                <strong>{minimalPrice.toLocaleString()}</strong> €{" "}
                <sup className="text-uppercase">{t("ttc")}</sup>
              </p>
            </Col>
          </Row>

          <Row>
            <Col>
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
                        €<sup>{t("ttc")}</sup>
                      </div>
                    </Col>
                  )}
                  <Col>
                    {(bestOffer > 0 && (
                      <>
                        <p className="h5 gray ">
                          <Translate code="best_offer" />
                        </p>
                        <div className="offer-value">
                          <span className="dark font-weight-bold">
                            {bestOffer.toLocaleString()}
                          </span>{" "}
                          €<sup>{t("ttc")}</sup>
                        </div>
                      </>
                    )) || (
                      <div className="gray font-italic my-2">
                        <Translate code="no_offer" />
                      </div>
                    )}
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          {!isExpired && statusName === "online" && (
            <Form
              method="post"
              className="form-offer mt-4 needs-validation"
              noValidate
            >
              <Row>
                <Col xs="12" lg="7" className="mb-3">
                  <Input
                    invalid={!offerIsValid}
                    type="number"
                    min={minOffer}
                    name="user-offer"
                    className="rounded"
                    value={userAuctionAmout}
                    onChange={handleChangeOffer}
                    onKeyPress={(ev) => {
                      if (ev.key === "Enter") {
                        ev.preventDefault();
                        if (isExpired || !offerIsValid) {
                          // do nothing
                        } else {
                          toggleModal();
                        }
                      }
                    }}
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
                    disabled={isExpired || !offerIsValid}
                    onClick={toggleModal}
                  >
                    <Translate code="make_an_offer" />
                  </Button>

                  <Modal isOpen={modal} toggle={toggleModal}>
                    <ModalBody>
                      <p className="text-center">
                        {t("confirm_message_offer")}
                      </p>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="secondary"
                        className="rounded"
                        onClick={toggleModal}
                      >
                        {t("cancel")}
                      </Button>
                      <Form method="post" onSubmit={handleSubmitAuction}>
                        <Button color="danger" className="rounded">
                          {t("confirm_buy")}
                        </Button>{" "}
                      </Form>
                    </ModalFooter>
                  </Modal>

                  {auction.nbOffers > 0 && (
                    <p className="text-danger text-center mt-2 mb-0 small">
                      {auction.nbOffers}{" "}
                      {(auction.nbOffers === 1 && t("bid")) || t("bids")}
                    </p>
                  )}
                </Col>
              </Row>
            </Form>
          )}
          {statusName === "sold" && (
            <p className="text-center text-danger mt-3 mb-0">
              {t("this_vehicle_has_been_sold")}
            </p>
          )}
          {isExpired && (
            <p className="text-center text-danger mt-3 mb-0">
              {t("too_late_auctions_are_closed")}
            </p>
          )}
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default Auction;
