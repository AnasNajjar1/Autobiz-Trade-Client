import React from "react";
import Translate, { t } from "../common/Translate";
import { Link } from "react-router-dom";
import { Row, Col, Card, CardBody, CardTitle, CardFooter } from "reactstrap";
import RecordsElementGrade from "./RecordsElementGrade.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Countdown from "../common/Countdown";
import moment from "moment";
import defaultFrontPicture from "../../assets/img/default-front-vehicle-picture.png";
import iconCockadeRed from "../../assets/img/cockade-red.svg";
import {
  faShoppingCart,
  faUser,
  faCheck,
  faMapMarkerAlt,
  faBolt,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import Bookmark from "../common/Bookmark";
const listPicture = [
  "three_quarters_front_picture",
  "front_picture",
  "left_side_picture",
  "right_side_picture",
];

const RecordsElement = (props) => {
  let picture = "";
  for (const pictTitle of listPicture) {
    picture = _.get(props, `record.${pictTitle}`, null);
    if (!picture || picture === "" || picture === "null") {
      picture = defaultFrontPicture;
    }
    break;
  }

  const { record } = props;
  const { secondsLeft } = record;
  console.log();
  return (
    <Col xs="12" lg="6" xl="6" className="mb-4">
      <Link className="link-card" to={`/records/${record.uuid}`}>
        <Card className="h-100">
          <div className="status">
            <Row>
              {record.offerType === "offerToPrivate" && (
                <div className="col-auto">
                  <img
                    alt={t("offerToPrivate")}
                    className="mr-2"
                    src={iconCockadeRed}
                  />
                  {t("offerToPrivate")}
                </div>
              )}

              {record.offerType === "stock" && (
                <div className="col-auto">
                  <FontAwesomeIcon
                    icon={faShoppingCart}
                    className="mr-2 text-success"
                    size="1x"
                  />
                  {t("in_stock")}
                </div>
              )}
              <div className="col-auto ml-auto text-right ">
                {record.userMessage === "highest_bidder" && (
                  <span className="text-success">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="mr-2"
                      size="1x"
                    />
                    {t("highest_bidder")}
                  </span>
                )}

                {record.userMessage === "purchase_in_process" && (
                  <span className="text-success">
                    <FontAwesomeIcon icon={faTags} className="mr-2" size="1x" />
                    {t("purchase_in_process")}
                  </span>
                )}

                {record.userMessage === "overbid" && (
                  <span className="text-danger">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="mr-2"
                      size="1x"
                    />
                    {t("overbid")}
                  </span>
                )}

                {record.userMessage === "submission_sent" && (
                  <span className="text-success">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="mr-2"
                      size="1x"
                    />
                    {t("submission_sent")}
                  </span>
                )}
              </div>
            </Row>
          </div>
          <div className="card-head">
            {record.statusName === "sold" && (
              <div className="sold-vehicle-banner">
                <span>{t("sold")}</span>
              </div>
            )}

            <img
              className="card-img-top"
              src={picture}
              alt={record.brandLabel + " " + record.modelLabel}
            />
            <RecordsElementGrade grade={record.profileBodyCosts} />
          </div>

          <CardBody>
            <Row>
              <Col>
                {secondsLeft && <Countdown secondsLeft={secondsLeft} />}
                {secondsLeft > 0 && (
                  <Bookmark
                    scope="vehicle"
                    refId={record.uuid}
                    bookmarked={record.bookmarked}
                  />
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
                  {(record.statusName === "sold" && (
                    <>
                      {record.bestOfferType === "immediatePurchase" && (
                        <>
                          <p className="price">
                            {record.immediatePurchasePrice.toLocaleString()}€{" "}
                            <small> {t("ttc")}</small>
                          </p>
                          <p className="immediate-purchase">
                            <FontAwesomeIcon icon={faBolt} size="1x" />{" "}
                            {t("immediate_purchase")}
                          </p>
                        </>
                      )}

                      {record.bestOfferType === "auction" && (
                        <>
                          <p className="price">
                            {record.bestAuction.toLocaleString()}€{" "}
                            <small> {t("ttc")}</small>
                          </p>
                          <p className="immediate-purchase">{t("auction")}</p>
                        </>
                      )}
                    </>
                  )) || (
                    <>
                      {record.acceptImmediatePurchase === 1 && (
                        <>
                          <p className="price">
                            {record.immediatePurchasePrice.toLocaleString()} €{" "}
                            <small> {t("ttc")}</small>
                          </p>
                          <p className="text-right small mb-0">
                            <FontAwesomeIcon icon={faBolt} size="1x" />{" "}
                            {t("immediate_purchase")}
                          </p>
                        </>
                      )}

                      {record.acceptAuction === 1 && (
                        <>
                          <p className="price">
                            {record.bestAuction
                              ? record.bestAuction.toLocaleString()
                              : record.auctionStartPrice.toLocaleString()}{" "}
                            € <small> {t("ttc")}</small>
                          </p>
                          <p className="text-right small mb-0">
                            {t("auction")}
                          </p>
                          {record.countAuctions > 0 && (
                            <p className="text-right small mb-1">
                              {record.countAuctions}{" "}
                              {(record.countAuctions === 1 && t("bid")) ||
                                t("bids")}
                            </p>
                          )}
                        </>
                      )}
                    </>
                  )}
                </Col>
              </Row>
            </CardTitle>
          </CardBody>
          <div className="text-center mb-3">
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

          <CardFooter>
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" size="1x" />
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
};

export default RecordsElement;
