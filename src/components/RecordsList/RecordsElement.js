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
import Favorie from "../Records/Favorie";

class RecordsElement extends Component {
  state = {
    listPicture : ['front_picture', 'left_side_picture', 'right_side_picture'],
    nextPicture : null,
    record : this.props.record
  };

  componentWillMount() {
    if(this.state.record.three_quarters_front_picture === "null" && this.state.nextPicture === null) {
      let i = 0
      if(this.state.nextPicture !== null) return
      let res = _.get(this.state.record, this.state.listPicture[i], null)
      if(res) return this.setState({ nextPicture: this.state.listPicture[i] })
      else i++
    }
  }

  render() {
    const { record } = this.props;
    const { auction } = record;

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
                      {auction.salesType === "immediatePurchase" && (
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
              {(record.three_quarters_front_picture !== "null" && (
                <img
                  className="card-img-top"
                  src={record.three_quarters_front_picture}
                  alt={record.brandLabel + " " + record.modelLabel}
                />
              )) || (
                <img
                  className="card-img-top"
                  src={record[this.state.nextPicture]}
                  alt={""}
                />
              )}
              <RecordsElementGrade grade={record.profileCosts} />
            </div>

            <CardBody>
              <Row>
                <Col>
                  {auction && <Countdown secondsLeft={auction.secondsLeft} />}
                  <span className="star-icon"><Favorie refId={record.uuid} /></span>
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

                    {auction.salesType === "immediatePurchase" && (
                      <p className="immediate-purchase">
                        <FontAwesomeIcon icon={faBolt} size="1x" />{" "}
                        {t("immediate_purchase")}
                      </p>
                    ) || <p className="text-right small"><Translate code="auction" /></p>}
                  </Col>
                </Row>
              </CardTitle>
              <div className="text-center wrapper">
                {record.firstRegistrationDate && record.fuelLabel && record.mileage !== null && (
                  <span className="tag tag-white">
                    {record.firstRegistrationDate && (
                      <span className="text-nowrap after-slash-divider">
                        {moment(record.firstRegistrationDate).format('YYYY')}
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
}

export default RecordsElement;
