import React, { useState, useEffect } from "react";
import Translate, { t } from "../common/Translate";
import Countdown from "../common/Countdown";
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
import Tooltip from "../common/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { getCurrentLanguage } from "../../language-context";
import { Api } from "../../providers/Api";
import * as workerTimers from "worker-timers";

const Auction = ({ refId, entryStockDate }) => {
  const [isExpired, setIsExpired] = useState();
  const [isScheduled, setIsScheduled] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [secondsBeforeEnd, setSecondsBeforeEnd] = useState(0);
  const [secondsBeforeStart, setSecondsBeforeStart] = useState(0);

  const [tooltipReservePrice, settooltipReservePrice] = useState(false);
  const [tooltipNoReservePrice, settooltipNoReservePrice] = useState(false);

  const toggleReservePrice = () => settooltipReservePrice(!tooltipReservePrice);
  const toggleNoReservePrice = () =>
    settooltipNoReservePrice(!tooltipNoReservePrice);

  const [sale, setSale] = useState({});

  const [modalSubmission, setModalSubmission] = useState(false);
  const toggleModalSubmission = () => setModalSubmission(!modalSubmission);

  const [modalAuction, setModalAuction] = useState(false);
  const toggleModalAuction = () => setModalAuction(!modalAuction);

  const [modalImmediatePurchase, setModalImmediatePurchase] = useState(false);

  const toggleModalImmediatePurchase = () =>
    setModalImmediatePurchase(!modalImmediatePurchase);
  const second = 1000;
  const refreshTime = 5 * second;
  const lang = getCurrentLanguage();

  const [userSubmissionAmout, setUserSubmissionAmout] = useState(false);
  const [submissionIsValid, setSubmissionIsValid] = useState(false);

  const [userAuctionAmout, setUserAuctionAmout] = useState(false);
  const [auctionIsValid, setAuctionIsValid] = useState(false);

  const handleChangeAuction = (e) => {
    setUserAuctionAmout(e.target.value);
    if (isNaN(parseInt(e.target.value))) {
      setAuctionIsValid(false);
    } else if (parseInt(e.target.value) < sale.minimalAuction) {
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
        setModalSubmission(true);
      }
    }
  };

  const handleChangeSubmission = (e) => {
    setUserSubmissionAmout(e.target.value);

    if (isNaN(parseInt(e.target.value))) {
      setSubmissionIsValid(false);
    } else if (parseInt(e.target.value) < userInfo.minimalUserSubmission) {
      setSubmissionIsValid(false);
    } else if (
      isImmediatePurchaseOpen &&
      parseInt(e.target.value) >= immediatePurchasePrice
    ) {
      setSubmissionIsValid(false);
    } else if (
      isAuctionOpen &&
      parseInt(e.target.value) >= sale.minimalAuction
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
      amount: sale.immediatePurchasePrice,
      offerType: "immediatePurchase",
    };

    const putAuction = async () => {
      try {
        const result = await Api.request(
          "POST",
          `/sale/${refId}/offer`,
          {},
          postData
        );
        setSale(result.data);
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
        offerType: "auction",
      };

      setUserAuctionAmout(false);
      setAuctionIsValid(false);

      const putAuction = async () => {
        try {
          const result = await Api.request(
            "POST",
            `/sale/${refId}/offer`,
            {},
            postData
          );
          setSale(result.data);
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
        offerType: "submission",
      };

      setUserSubmissionAmout(false);
      setSubmissionIsValid(false);

      const putAuction = async () => {
        try {
          const result = await Api.request(
            "POST",
            `/sale/${refId}/offer`,
            {},
            postData
          );
          setSale(result.data);
        } catch (e) {
          alert(e);
        }
      };
      putAuction();
    }
  };

  const fetchSale = async () => {
    try {
      const result = await Api.request("GET", `/sale/${refId}/info`);
      setSecondsBeforeStart(result.data.secondsBeforeStart);
      setSecondsBeforeEnd(result.data.secondsBeforeEnd);

      if (result.data.secondsBeforeEnd > 0) {
        setIsExpired(false);
      } else {
        setIsExpired(true);
      }

      if (result.data.secondsBeforeStart > 0) {
        setIsScheduled(true);
      } else {
        setIsScheduled(false);
      }

      setSale(result.data);
    } catch (error) {
      setIsLoading(false);
    }
  };

  /*eslint-disable */
  useEffect(() => {
    fetchSale();
    const intervalRefresh = workerTimers.setInterval(() => {
      if (!isExpired) {
        fetchSale();
      }
    }, refreshTime);
    return () => workerTimers.clearInterval(intervalRefresh);
  }, [isExpired, refreshTime]);
  /*eslint-enable */

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

  const endDateTime = new Date(sale.endDateTime);

  const {
    isAuctionOpen,
    isSubmissionOpen,
    isImmediatePurchaseOpen,
    auctionStartPrice,
    countAuctions,
    minimalAuction,
    immediatePurchasePrice,
    auctionReservePrice,
    auctionReservePriceIsReached,
    bestOffer,
    userInfo,
    isOwner,
  } = sale;

  if (_.isEmpty(sale)) {
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
          disabled={isExpired || isScheduled || isOwner}
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
              {t("confirm_message_immediate_purchase")}{" "}
              <strong class="d-inline-block">
                {immediatePurchasePrice.toLocaleString()}€
              </strong>{" "}
              {t("confirm_message_immediate_purchase2")}
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
          disabled={isExpired || isOwner}
          onKeyPress={(e) => handleKeyPress(e, "submission")}
          invalid={!submissionIsValid && Boolean(userSubmissionAmout)}
          placeholder={`${t("make_a_free_submission")} (${t(
            "min"
          )}  ${userInfo.minimalUserSubmission.toLocaleString()}€) `}
        />
      </Col>
      <Col className="col-thin">
        {userInfo.bestUserSubmission > 0 && (
          <div className="text-success small text-left mt-2">
            <b>
              {t("you_have_already_submitted")}{" "}
              {userInfo.bestUserSubmission.toLocaleString()} € (
              {moment(userInfo.bestUserSubmissionCreatedAt).format(
                "DD/MM/YYYY HH:mm"
              )}
              )
            </b>
          </div>
        )}
        <Button
          color="secondary"
          block
          className="mt-2"
          disabled={isExpired || !submissionIsValid || isScheduled}
          onClick={toggleModalSubmission}
        >
          {t("makeSubmission")}
        </Button>

        <Modal isOpen={modalSubmission} toggle={toggleModalSubmission}>
          <ModalBody>
            <p className="text-center">
              {t("submission_validation")}{" "}
              <strong class="d-inline-block">
                {parseInt(userSubmissionAmout).toLocaleString()}€
              </strong>{" "}
              {t("submission_validation_message2")}
            </p>
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
          disabled={isOwner}
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
          disabled={!auctionIsValid || isScheduled || isOwner}
          onClick={toggleModalAuction}
        >
          {t("make_an_offer")}
        </Button>

        <Modal isOpen={modalAuction} toggle={toggleModalAuction}>
          <ModalBody>
            <p className="text-center">
              {t("confirm_message_offer")}{" "}
              <strong class="d-inline-block">
                {parseInt(userAuctionAmout).toLocaleString()}€
              </strong>{" "}
              {t("confirm_message_offer2")}
            </p>
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

  let messageClass = "gray font-italic";
  if (userInfo.success === true) {
    messageClass = "text-success";
  }

  if (userInfo.success === false) {
    messageClass = "text-danger";
  }
  const { message } = userInfo;
  console.log("render", { secondsBeforeEnd, isExpired, message, userInfo });
  if (userInfo)
    return (
      <div className="section radius mb-4 py-4">
        <div className="auction">
          <Row>
            <Col xs="12" lg="7">
              <Countdown
                secondsBeforeStart={secondsBeforeStart}
                secondsBeforeEnd={secondsBeforeEnd}
                precision="seconds"
                refresh
              />
            </Col>
            <Col xs="12" lg="5">
              {auctionReservePrice ? (
                auctionReservePriceIsReached ? (
                  <p className="text-success blink text-lg-right text-nowrap small mt-2 mt-lg-0">
                    <FontAwesomeIcon icon={faThumbsUp} className="mr-1" />
                    {t("reservePriceReached")}
                  </p>
                ) : (
                  isAuctionOpen && (
                    <p className="text-lg-right text-nowrap small mt-2 mt-lg-0">
                      <span
                        className="price-info reserve"
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
                  )
                )
              ) : (
                isAuctionOpen && (
                  <p className="text-lg-right text-nowrap small mt-2 mt-lg-0">
                    <span
                      className="price-info no-reserve"
                      href="#"
                      id="tooltipNoReservePrice"
                    >
                      {t("noReservePrice")}
                    </span>
                    <RsTooltip
                      placement="top-end"
                      isOpen={tooltipNoReservePrice}
                      target="tooltipNoReservePrice"
                      toggle={toggleNoReservePrice}
                    >
                      {t("noReservePriceLegend")}
                    </RsTooltip>
                  </p>
                )
              )}
            </Col>
            <Col xs="12">
              <p className="gray font-italic small">{closingMessage()}</p>
            </Col>
            <Col xs="12">
              {entryStockDate && (
                <span className="small">
                  {t("entryStockDate")} : <b>{entryStockDate}</b>
                </span>
              )}
            </Col>
          </Row>
          {/* Auctions */}
          {isAuctionOpen && (
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
            <Row>
              {userInfo.bestUserOffer && (
                <Col>
                  <p className="h6 gray mb-0">
                    <Translate code="your_offer" />
                  </p>
                  <div
                    className={
                      userInfo.userBestOfferer ? "text-success" : "text-danger"
                    }
                  >
                    <div className="offer-value">
                      {userInfo.bestUserOffer.toLocaleString()} €
                      <sup>{t("ttc")}</sup>
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
            {userInfo.message &&
              userInfo.message !== "highest_bidder" &&
              userInfo.message !== "overbid" && (
                <p className={messageClass + " mt-2 mb-3"}>
                  {t(userInfo.message)}
                </p>
              )}
            {/*Forms */}
            {isExpired === false && (
              <>
                {/* Auction */}
                {isAuctionOpen && auctionForm}
                {/* Submission */}
                {isSubmissionOpen && submissionForm}
                {/* ImmediatePurchaseForm */}
                {isImmediatePurchaseOpen && immediatePurchaseForm}
              </>
            )}
            {/* End Forms */}
          </div>
          {isExpired === true && (
            <div>
              {" "}
              {userInfo.bestUserSubmission > 0 && (
                <div className="text-success small text-left mt-2">
                  <b>
                    {t("you_have_already_submitted")}{" "}
                    {userInfo.bestUserSubmission.toLocaleString()} € (
                    {moment(userInfo.bestUserSubmissionCreatedAt).format(
                      "DD/MM/YYYY HH:mm"
                    )}
                    )
                  </b>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
};

export default Auction;
