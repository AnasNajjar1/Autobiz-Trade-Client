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
  Tooltip as RsTooltip,
} from "reactstrap";
import Cookies from "js-cookie";
import Tooltip from "../common/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

const Auction = ({ refId, bookmarked }) => {
  const [isExpired, setIsExpired] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const [tooltipReservePrice, settooltipReservePrice] = useState(false);

  const toggleReservePrice = () => settooltipReservePrice(!tooltipReservePrice);

  const [auction, setAuction] = useState({});

  const [modalSubmission, setModalSubmission] = useState(false);
  const toggleModalSubmission = () => setModalSubmission(!modalSubmission);

  const [modalAuction, setModalAuction] = useState(false);
  const toggleModalAuction = () => setModalAuction(!modalAuction);

  const [modalImmediatePurchase, setModalImmediatePurchase] = useState(false);
  const toggleModalImmediatePurchase = () =>
    setModalImmediatePurchase(!modalImmediatePurchase);

  const second = 1000;
  const refreshTime = 5 * second;
  const lang = Cookies.get("appLanguage");

  const [minSubmission, setMinSubmission] = useState(200);
  const [userSubmissionAmout, setUserSubmissionAmout] = useState(false);
  const [submissionIsValid, setSubmissionIsValid] = useState(false);

  const [userAuctionAmout, setUserAuctionAmout] = useState(false);
  const [auctionIsValid, setAuctionIsValid] = useState(false);

  const handleChangeAuction = (e) => {
    setUserAuctionAmout(e.target.value);
    if (isNaN(parseInt(e.target.value))) {
      setAuctionIsValid(false);
    } else if (parseInt(e.target.value) < auction.minimalAuction) {
      setAuctionIsValid(false);
    } else {
      setAuctionIsValid(true);
    }
  };

  const handleKeyPress = (e, scope) => {
    const isNumber = /^[0-9]$/i.test(e.key);
    if (isNumber === false) {
      e.preventDefault();
    }

    if (e.key === "Enter") {
      if (scope === "auction" && auctionIsValid) {
        toggleModalAuction();
      }

      if (scope === "submission" && submissionIsValid) {
        handleSubmitSubmission(e);
      }
    }
  };

  const handleChangeSubmission = (e) => {
    setUserSubmissionAmout(e.target.value);
    if (isNaN(parseInt(e.target.value))) {
      setSubmissionIsValid(false);
    } else if (parseInt(e.target.value) < minSubmission) {
      setSubmissionIsValid(false);
    } else if (
      acceptImmediatePurchase &&
      parseInt(e.target.value) >= immediatePurchasePrice
    ) {
      setSubmissionIsValid(false);
    } else if (
      acceptAuction &&
      parseInt(e.target.value) >= auction.minimalAuction
    ) {
      setSubmissionIsValid(false);
    } else {
      setSubmissionIsValid(true);
    }
  };

  const handleSubmitImmediatePurchase = (e) => {
    e.preventDefault();
    e.target.reset();

    setModalImmediatePurchase(false);

    const postData = {
      amount: auction.immediatePurchasePrice,
      saleType: "immediatePurchase",
    };

    const putAuction = async () => {
      try {
        const result = await API.post(
          "b2bPlateform",
          `/vehicle/${refId}/sale`,
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

  const handleSubmitAuction = (e) => {
    e.preventDefault();
    setModalAuction(false);

    if (auctionIsValid) {
      const postData = {
        amount: userAuctionAmout,
        saleType: "auction",
      };

      setUserAuctionAmout(false);
      setAuctionIsValid(false);

      const putAuction = async () => {
        try {
          const result = await API.post(
            "b2bPlateform",
            `/vehicle/${refId}/sale`,
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
    }
  };

  const handleSubmitSubmission = (e) => {
    e.preventDefault();
    setModalSubmission(false);

    if (submissionIsValid) {
      const postData = {
        amount: userSubmissionAmout,
        saleType: "submission",
      };

      setUserSubmissionAmout(false);
      setSubmissionIsValid(false);

      const putAuction = async () => {
        try {
          const result = await API.post(
            "b2bPlateform",
            `/vehicle/${refId}/sale`,
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
    }
  };

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
      const result = await API.get("b2bPlateform", `/vehicle/${refId}/sale`, {
        response: true,
      });

      if (result.data.secondsLeft > 0) {
        setIsExpired(false);
      } else {
        setIsExpired(true);
      }

      if (result.data.bestUserSubmission > 0) {
        setMinSubmission(result.data.bestUserSubmission + 1);
      }

      setAuction(result.data);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const closingMessage = () => {
    let message = "";
    if (isExpired) {
      message += t("sales_closed_on");
    } else {
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

  const endDateTime = new Date(auction.endDateTime);
  const {
    secondsLeft = 0,
    acceptAuction,
    acceptSubmission,
    acceptImmediatePurchase,
    auctionStartPrice,
    countAuctions,
    userBestOfferer,
    bestAuction,
    bestUserAuction,
    bestOfferType,
    minimalAuction,
    bestUserSubmission,
    statusName,
    immediatePurchasePrice,
    auctionReservePriceReached,
  } = auction;

  if (_.isEmpty(auction)) {
    return (
      isLoading && (
        <div className="text-center my-5">
          <FontAwesomeIcon icon={faSpinner} size="3x" spin />
        </div>
      )
    );
  }

  const immediatePurchaseForm = (
    <Row className="row-thin align-items-end mt-3">
      <Col className="col-thin">
        <Button
          color="primary"
          block
          disabled={isExpired}
          onClick={toggleModalImmediatePurchase}
        >
          {t("immediate_purchase")}{" "}
          <span className="font-weight-bold">
            {immediatePurchasePrice && immediatePurchasePrice.toLocaleString()}{" "}
          </span>{" "}
          €<sup>{t("ttc")}</sup>
        </Button>
        <Modal
          isOpen={modalImmediatePurchase}
          toggle={toggleModalImmediatePurchase}
        >
          <ModalBody>
            <p className="text-center">
              {t("confirm_message_immediate_purchase")}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              className="rounded"
              onClick={toggleModalImmediatePurchase}
            >
              {t("cancel")}
            </Button>
            <Form method="post" onSubmit={handleSubmitImmediatePurchase}>
              <Button color="success" className="rounded">
                {t("confirm_buy")}
              </Button>{" "}
            </Form>
          </ModalFooter>
        </Modal>
      </Col>
      <Col className="col-thin col-auto">
        <Tooltip id="info_immediate_purchase" className="d-block mb-2">
          {t("info_immediate_purchase")}
        </Tooltip>
      </Col>
    </Row>
  );

  const submissionForm = (
    <Row className="row-thin align-items-end">
      <Col xs={12} className="col-thin">
        <Input
          type="number"
          name="user-submission"
          value={userSubmissionAmout}
          onChange={handleChangeSubmission}
          disabled={isExpired}
          onKeyPress={(e) => handleKeyPress(e, "submission")}
          invalid={!submissionIsValid && Boolean(userSubmissionAmout)}
          placeholder={`${t("make_a_free_submission")} (${t(
            "min"
          )}  ${minSubmission.toLocaleString()}€)`}
        />
      </Col>
      <Col className="col-thin">
        {bestUserSubmission > 0 && (
          <div className="text-danger small text-left">
            {t("you_have_already_submitted")} {bestUserSubmission} €{" "}
          </div>
        )}
        <Button
          color="secondary"
          block
          className="mt-2"
          disabled={isExpired || !submissionIsValid}
          onClick={toggleModalSubmission}
        >
          {t("submission")}
        </Button>

        <Modal isOpen={modalSubmission} toggle={toggleModalSubmission}>
          <ModalBody>
            <p className="text-center">{t("confirm_message_offer")}</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              className="rounded"
              onClick={toggleModalSubmission}
            >
              {t("cancel")}
            </Button>
            <Form method="post" onSubmit={handleSubmitSubmission}>
              <Button color="success" className="rounded">
                {t("confirm_buy")}
              </Button>{" "}
            </Form>
          </ModalFooter>
        </Modal>
      </Col>
      <Col className="col-thin col-auto">
        <Tooltip id="info_submission" className="d-block mb-2">
          {t("info_submission")}
        </Tooltip>
      </Col>
    </Row>
  );

  const auctionForm = (
    <Row className="row-thin align-items-end mb-3">
      <Col xs={12} className="col-thin">
        <Input
          type="number"
          name="user-offer"
          className="mb-2"
          value={userAuctionAmout}
          invalid={!auctionIsValid && Boolean(userAuctionAmout)}
          onChange={handleChangeAuction}
          onKeyPress={(e) => handleKeyPress(e, "auction")}
          placeholder={`${t("your_offer")} (${t("min")}  ${
            minimalAuction && minimalAuction.toLocaleString()
          }€)`}
        />
      </Col>
      <Col className="col-thin">
        <Button
          color="primary"
          block
          disabled={!auctionIsValid}
          onClick={toggleModalAuction}
        >
          {t("make_an_offer")}
        </Button>

        <Modal isOpen={modalAuction} toggle={toggleModalAuction}>
          <ModalBody>
            <p className="text-center">{t("confirm_message_offer")}</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              className="rounded"
              onClick={toggleModalAuction}
            >
              {t("cancel")}
            </Button>
            <Form method="post" onSubmit={handleSubmitAuction}>
              <Button color="success" className="rounded">
                {t("confirm_buy")}
              </Button>{" "}
            </Form>
          </ModalFooter>
        </Modal>
      </Col>
      <Col className="col-thin col-auto">
        <Tooltip id="info_make_an_offer" className="d-block mb-2">
          {t("info_make_an_offer")}
        </Tooltip>
      </Col>

      <Col xs="12">
        {countAuctions > 0 && (
          <p className="gray text-center mt-2 mb-0 small">
            {countAuctions} {(countAuctions === 1 && t("bid")) || t("bids")}
          </p>
        )}
      </Col>
    </Row>
  );

  let message;
  let messageClass;
  let bestOffer;
  let bestUserOffer;

  if (statusName === "sold") {
    // VENDU
    message = "this_vehicle_has_been_sold";
    messageClass = "text-danger";
    switch (bestOfferType) {
      case "immediatePurchase":
        bestOffer = immediatePurchasePrice;
        break;
      case "auction":
        bestOffer = bestAuction;
        break;
    }
  } else if (statusName === "online") {
    if (isExpired) {
      // VENTE TERMINÉE

      switch (bestOfferType) {
        case "immediatePurchase":
          bestOffer = immediatePurchasePrice;
          if (userBestOfferer) {
            bestUserOffer = bestOffer;
            message = "purchase_in_process";
            messageClass = "text-success";
          } else {
            message = "too_late_sale_is_closed";
            messageClass = "text-danger";
          }
          break;
        case "auction":
          bestOffer = bestAuction;
          bestUserOffer = bestUserAuction;
          message = "too_late_auctions_are_closed";
          messageClass = "text-danger";
          break;

        case "submission":
          if (userBestOfferer) {
            bestUserOffer = bestUserSubmission;
            message = "submission_acceptation_pending";
            messageClass = "text-success";
          } else {
            message = "too_late_sale_is_closed";
            messageClass = "text-danger";
          }
          break;

        default:
          message = "too_late_sale_is_closed";
          messageClass = "text-danger";
          break;
      }
    } else {
      // EN VENTE

      bestOffer = bestAuction;
      bestUserOffer = bestUserAuction;
      if (!bestOffer && !bestUserSubmission) {
        message = "no_offer";
        messageClass = "gray font-italic";
      }
    }
  }

  return (
    <div className="section radius mb-4 py-4">
      <div className="auction">
        <Row>
          <Col xs="12" lg="7">
            <Countdown secondsLeft={secondsLeft} />
          </Col>
          <Col xs="12" lg="5">
            {auctionReservePriceReached === true && (
              <p className="text-success blink text-lg-right text-nowrap small mt-2 mt-lg-0">
                <FontAwesomeIcon icon={faThumbsUp} className="mr-1" />
                {t("reservePriceReached")}
              </p>
            )}

            {auctionReservePriceReached === false && (
              <p className=" text-lg-right text-nowrap small mt-2 mt-lg-0">
                <span
                  className="reserve-price-info"
                  href="#"
                  id="tooltipReservePrice"
                >
                  {t("reservePrice")}
                </span>

                <RsTooltip
                  placement="top-end"
                  isOpen={tooltipReservePrice}
                  target="tooltipReservePrice"
                  toggle={toggleReservePrice}
                >
                  {t("reservePriceLegend")}
                </RsTooltip>
              </p>
            )}
          </Col>
          <Col xs="12">
            <p className="gray font-italic small">{closingMessage()}</p>
          </Col>
        </Row>
        {/* Auctions */}
        {acceptAuction === 1 && (
          <Row>
            <Col>
              <p className="mb-0">
                <span className="gray">
                  <Translate code="start_price" />
                </span>
                <strong>{auctionStartPrice.toLocaleString()}</strong> €{" "}
                <sup className="text-uppercase">{t("ttc")}</sup>
              </p>
            </Col>
          </Row>
        )}

        <div className="section-price">
          <Row className="">
            {bestUserOffer && (
              <Col>
                <p className="h6 gray mb-0">
                  <Translate code="your_offer" />
                </p>
                <div
                  className={userBestOfferer ? "text-success" : "text-danger"}
                >
                  <div className="offer-value">
                    {bestUserOffer.toLocaleString()} €<sup>{t("ttc")}</sup>
                  </div>
                </div>
              </Col>
            )}
            {bestOffer && (
              <Col>
                <p className="h6 gray mb-0 ">
                  <Translate code="best_offer" />
                </p>
                <div className="offer-value text-secondary">
                  <span className="font-weight-bold">
                    {bestOffer.toLocaleString()}
                  </span>{" "}
                  €<sup>{t("ttc")}</sup>
                </div>
              </Col>
            )}
          </Row>

          {message && (
            <p className={messageClass + " mt-2 mb-3"}>{t(message)}</p>
          )}
          {/*Forms */}
          {isExpired === false && (
            <>
              {/* Auction */}
              {acceptAuction === 1 && auctionForm}
              {/* Submission */}
              {acceptSubmission === 1 && countAuctions === 0 && submissionForm}
              {/* ImmediatePurchaseForm */}
              {acceptImmediatePurchase === 1 && immediatePurchaseForm}
            </>
          )}
          {/* End Forms */}
        </div>
      </div>
    </div>
  );
};

export default Auction;
