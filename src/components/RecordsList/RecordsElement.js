import React, { Component } from "react";
import Translate, { t } from "../common/Translate";
import { Link } from "react-router-dom";
import { Row, Col, Card, CardBody, CardTitle, CardFooter } from "reactstrap";
import RecordsElementGrade from "./RecordsElementGrade.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Countdown from "../common/Countdown";
import moment from "moment";
import defaultFrontPicture from "../../assets/img/default-front-vehicle-picture.png";
import {
  faShoppingCart,
  faUser,
  faCheck,
  faMapMarkerAlt,
  faBolt,
  faTags
} from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import Bookmark from "../Records/Bookmark";
const listPicture = [
  "three_quarters_front_picture",
  "front_picture",
  "left_side_picture",
  "right_side_picture"
];

const RecordsElement = (props) => {

    let picture = "";
    for (const pictTitle of listPicture) {
      picture = _.get(props, `record.${pictTitle}`, null);
      if (!picture || picture === "" || picture ==="null") continue;
      break
    }

    const { record } = props;
    const { auction, bookmarked } = record;

    return (
      <Col xs="12" lg="6" xl="6" className="mb-4">
        <Link className="link-card" to={`/records/${record.uuid}`}>
          <Card className="h-100">
            <div className="status">
              <Row>
                {record.offerType === "offerToPrivate" && (
                  <div className="col-auto">
                    <FontAwesomeIcon icon={faUser} className="mr-2" size="1x" />
                    <Translate code="offerToPrivate"></Translate>
                  </div>
                )}

                {record.offerType === "stock" && (
                  <div className="col-auto">
                    <FontAwesomeIcon
                      icon={faShoppingCart}
                      className="mr-2"
                      size="1x"
                    />
                    <Translate code="in_stock"></Translate>
                  </div>
                )}
                {auction &&
                  auction.bestUserOffer &&
                  auction.bestUserOffer === auction.bestOffer && (
                    <div className="col-auto ml-auto text-right text-success">
                      {auction.salesType === "auction" && (
                        <>
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="mr-2"
                            size="1x"
                          />
                          {t("highest_bidder")}
                        </>
                      )}
                      {auction && auction.salesType === "immediatePurchase" && (
                        <>
                          <FontAwesomeIcon
                            icon={faTags}
                            className="mr-2"
                            size="1x"
                          />
                          {t("purchase_in_process")}
                        </>
                      )}
                    </div>
                  )}

                {auction &&
                  auction.bestUserOffer &&
                  auction.bestUserOffer !== auction.bestOffer && (
                    <Col className="text-right text-danger">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="mr-2"
                        size="1x"
                      />
                      {t("overbid")}
                    </Col>
                  )}
              </Row>
            </div>
            <div className="card-head">
              {auction && auction.secondsLeft < 0 && auction.bestOffer !== null &&  <div className="sold-vehicle-banner"><span>{t('sold')}</span></div>}
              <img
                className="card-img-top"
                src={picture}
                alt={record.brandLabel + " " + record.modelLabel}
              />
              <RecordsElementGrade grade={record.profileCosts} />
            </div>

            <CardBody>
              <Row>
                <Col>
                  {auction && <Countdown secondsLeft={auction.secondsLeft} />}
                  {auction && auction.secondsLeft > 0 && (
                    <span className="star-icon">
                      <Bookmark refId={record.uuid} bookmarked={bookmarked} />
                    </span>
                  )}
                </Col>
              </Row>
              <CardTitle>
                <Row>
                  <Col xs="7" sm="8" lg="7">
                    <p className="brand-model">
                      <span className="text-nowrap">{record.brandLabel}</span>{" "}
                      <span className="text-nowrap">{record.modelLabel}</span>
                    </p>
                    <p className="small">{record.versionLabel}</p>
                  </Col>
                  <Col xs="5" sm="4" lg="5">
                    {auction && (
                      <p className="price">
                        {(auction.bestOffer &&
                          auction.bestOffer.toLocaleString()) ||
                          auction.minimalPrice.toLocaleString()}{" "}
                        € <small> {t("ttc")}</small>
                      </p>
                    )}

                    {(auction && auction.salesType === "immediatePurchase" && (
                      <p className="immediate-purchase">
                        <FontAwesomeIcon icon={faBolt} size="1x" />{" "}
                        {t("immediate_purchase")}
                      </p>
                    )) || (
                      <p className="text-right small">
                        <Translate code="auction" />
                      </p>
                    )}
                  </Col>
                </Row>
              </CardTitle>
              <div className="text-center wrapper">
                {record.firstRegistrationDate &&
                  record.fuelLabel &&
                  record.mileage !== null && (
                    <span className="tag tag-white">
                      {record.firstRegistrationDate && (
                        <span className="text-nowrap after-slash-divider">
                          {moment(record.firstRegistrationDate).format("YYYY")}
                        </span>
                      )}
                      {record.fuelLabel && (
                        <span className="text-nowrap after-slash-divider">
                          {t(record.fuelLabel)}
                        </span>
                      )}
                      {record.mileage !== null && (
                        <span className="text-nowrap after-slash-divider">
                          {record.mileage.toLocaleString()} {t("Km")}
                        </span>
                      )}
                    </span>
                  )}
              </div>
            </CardBody>
            <CardFooter>
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="mr-1"
                size="1x"
              />
              {record.city === null &&
              record.zipCode === null &&
              record.country === null
                ? t("unknown_point_of_sale")
                : record.city + " " + record.zipCode + " " + t(record.country)}
            </CardFooter>
          </Card>
        </Link>
      </Col>
    );
}

export default RecordsElement;
