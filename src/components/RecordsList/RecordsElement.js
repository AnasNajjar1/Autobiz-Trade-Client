import React, { Component } from "react";
import Translate, { t } from "../common/Translate";
import { Link } from "react-router-dom";
import { Row, Col, Card, CardBody, CardTitle, CardFooter } from "reactstrap";
import RecordsElementGrade from "./RecordsElementGrade.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Countdown from "../common/Countdown";

import defaultFrontPicture from "../../assets/img/default-front-vehicle-picture.png";

import {
  faGavel,
  faUser,
  faCheck,
  faMapMarkerAlt
} from "@fortawesome/free-solid-svg-icons";

class RecordsElement extends Component {
  state = {};

  render() {
    const { record } = this.props;
    const { auction } = record;

    console.log(record.front_picture);

    return (
      <Col xs="12" lg="6" xl="6" className="mb-4">
        <Link className="link-card" to={`/records/${record.uuid}`}>
          <Card className="h-100">
            <div className="status">
              <Row>
                {record.type === "private" && (
                  <Col>
                    <FontAwesomeIcon icon={faUser} className="mr-2" size="1x" />
                    <Translate code="private_offer"></Translate>
                  </Col>
                )}

                {record.type === "stock" && (
                  <Col>
                    <FontAwesomeIcon
                      icon={faGavel}
                      className="mr-2"
                      size="1x"
                    />
                    <Translate code="in_stock"></Translate>
                  </Col>
                )}
                {auction &&
                  auction.bestUserOffer &&
                  auction.bestUserOffer === auction.bestOffer && (
                    <Col className="text-right text-success">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="mr-2"
                        size="1x"
                      />
                      Meilleur offrant
                    </Col>
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
                      Surenchérir
                    </Col>
                  )}
              </Row>
            </div>
            {record.front_picture && (
              <img
                className="card-img-top"
                src={record.front_picture}
                alt={record.brandLabel + " " + record.modelLabel}
              />
            )}
            {!record.front_picture && (
              <img
                className="card-img-top"
                src={defaultFrontPicture}
                alt={""}
              />
            )}

            {record.profileCosts && (
              <RecordsElementGrade grade={record.profileCosts} />
            )}
            <CardBody>
              {auction && <Countdown secondsLeft={auction.secondsLeft} />}

              <CardTitle>
                {record.brandLabel} {record.modelLabel}
                {auction && (
                  <p className="h1 float-right text-primary">
                    {auction.bestOffer && auction.bestOffer}
                    {!auction.bestOffer && auction.minimalPrice} {t("€ TTC")}
                  </p>
                )}
              </CardTitle>

              <p>{record.versionLabel}</p>
              <div className="text-center">
                <span className="tag tag-white">
                  {record.yearMec && (
                    <span className="text-nowrap after-slash-divider">
                      {record.yearMec}
                    </span>
                  )}
                  {record.fuelLabel && (
                    <span className="text-nowrap after-slash-divider">
                      {t(record.fuelLabel)}
                    </span>
                  )}
                  <span className="text-nowrap after-slash-divider">
                    {record.mileage.toLocaleString()} {t("Km")}
                  </span>
                </span>
              </div>
            </CardBody>
            <CardFooter>
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="mr-1"
                size="1x"
              />
              {record.city === null && record.zipCode === null
                ? t("unknown_point_of_sale")
                : record.city + " " + record.zipCode}
            </CardFooter>
          </Card>
        </Link>
      </Col>
    );
  }
}

export default RecordsElement;
