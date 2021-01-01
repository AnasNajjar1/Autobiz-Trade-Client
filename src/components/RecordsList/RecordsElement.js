import React from "react";
import { t } from "../common/Translate";
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
  faCheck,
  faMapMarkerAlt,
  faBolt,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import Bookmark from "../common/Bookmark";

const RecordsElement = (props) => {
  const { record } = props;
  const { vehicle } = record;
  const { pointofsale } = vehicle;
  const { secondsBeforeEnd } = record;

  let featuredPicture;
  if (vehicle && vehicle.featuredPicture) {
    featuredPicture = vehicle.featuredPicture;
  } else {
    featuredPicture = defaultFrontPicture;
  }

  const { message } = record.userInfo;

  return (
    <Col xs="12" lg="6" xl="6" className="mb-4">
      <Link className="link-card" to={`/records/${record.uuid}`}>
        <Card className="h-100">
          <div className="status">
            <Row>
              {record.supplyType === "OFFER_TO_PRIVATE" && (
                <div className="col-auto">
                  <img
                    alt={t("offerToPrivate")}
                    className="mr-2"
                    src={iconCockadeRed}
                  />
                  <span className="text-danger">{t("offerToPrivate")}</span>
                </div>
              )}

              {record.supplyType === "STOCK" && (
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
                {message === "highest_bidder" && (
                  <span className="text-success">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="mr-2"
                      size="1x"
                    />
                    {t("highest_bidder")}
                  </span>
                )}

                {message === "purchase_in_process" && (
                  <span className="text-success">
                    <FontAwesomeIcon icon={faTags} className="mr-2" size="1x" />
                    {t("purchase_in_process")}
                  </span>
                )}

                {message === "overbid" && (
                  <span className="text-danger">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="mr-2"
                      size="1x"
                    />
                    {t("overbid")}
                  </span>
                )}

                {message === "submission_sent" && (
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
            {record.isSold && (
              <div className="sold-vehicle-banner">
                <span>{t("sold")}</span>
              </div>
            )}

            <img
              className="card-img-top"
              src={featuredPicture}
              alt={vehicle.brandLabel + " " + vehicle.modelLabel}
            />
            <RecordsElementGrade grade={vehicle.profileBodyCosts} />
          </div>

          <CardBody>
            <Row>
              <Col>
                {secondsBeforeEnd && (
                  <Countdown secondsBeforeEnd={secondsBeforeEnd} />
                )}
                {secondsBeforeEnd > 0 && (
                  <Bookmark
                    scope="sale"
                    refId={record.uuid}
                    bookmarked={record.isBookmarkedByUser}
                  />
                )}
              </Col>
            </Row>
            <CardTitle>
              <Row>
                <Col xs="7" sm="8" lg="7">
                  <p className="brand-model">
                    <span className="text-nowrap">{vehicle.brandLabel}</span>{" "}
                    <span className="text-nowrap">{vehicle.modelLabel}</span>
                  </p>
                  <p className="small">{vehicle.versionLabel}</p>
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

                      {/* {record.bestOfferType === "auction" && (
                        <>
                          <p className="price">
                            {record.bestAuction.toLocaleString()}€{" "}
                            <small> {t("ttc")}</small>
                          </p>
                          <p className="immediate-purchase">{t("auction")}</p>
                        </>
                      )} */}
                    </>
                  )) || (
                    <>
                      {record.acceptImmediatePurchase === true && (
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

                      {record.acceptAuction === true && (
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
            {vehicle.firstRegistrationDate &&
              vehicle.fuelLabel &&
              vehicle.mileage !== null && (
                <span className="tag tag-white">
                  {vehicle.firstRegistrationDate && (
                    <span className="text-nowrap after-slash-divider">
                      {moment(vehicle.firstRegistrationDate).format("YYYY")}
                    </span>
                  )}
                  {vehicle.fuelLabel && (
                    <span className="text-nowrap after-slash-divider">
                      {t(vehicle.fuelLabel)}
                    </span>
                  )}
                  {vehicle.mileage !== null && (
                    <span className="text-nowrap after-slash-divider">
                      {vehicle.mileage.toLocaleString()} {t("Km")}
                    </span>
                  )}
                </span>
              )}
          </div>

          <CardFooter>
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" size="1x" />
            {(pointofsale && (
              <>
                {pointofsale.city} {pointofsale.zipCode} {pointofsale.country}
              </>
            )) ||
              t("unknown_point_of_sale")}
          </CardFooter>
        </Card>
      </Link>
    </Col>
  );
};

export default RecordsElement;
