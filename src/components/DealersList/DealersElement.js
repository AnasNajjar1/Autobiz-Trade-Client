import React, { Component } from "react";
import { t } from "../common/Translate";
import { Link } from "react-router-dom";
import { Row, Col, Card, CardBody, CardTitle, CardFooter } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import Bookmark from "../common/Bookmark";
import defaultFrontPicture from "../../assets/img/default-front-dealer-picture.png";

import _ from "lodash";
import BrandsCarousel from "../common/BrandsCarousel";
const DealersElement = props => {
  let picture = "";

  const { dealer } = props;
  const { bookmarked } = dealer;

  return (
    <Col xs="12" lg="6" xl="6" className="mb-4">
      <Link className="link-card" to={`/dealers/${dealer.uuid}`}>
        <Card className="h-100">
          <div className="status">
            <Row>
              <div className="col-auto text-primary">
                {t("online_offers:")} {dealer.count_vehicles}
              </div>
            </Row>
          </div>
          <div className="card-head">
            <img
              className="card-img-top"
              src={dealer.picture ? dealer.picture : defaultFrontPicture}
              alt={dealer.name}
            />
          </div>

          <CardBody>
            <Row>
              <Col>
                <Bookmark
                  scope="dealer"
                  refId={dealer.uuid}
                  bookmarked={bookmarked}
                />
              </Col>
            </Row>
            <CardTitle>
              <p className="brand-model">
                <span className="text-nowrap">{dealer.name}</span>
              </p>
              <BrandsCarousel brands={dealer.brands} />
            </CardTitle>
          </CardBody>
          <CardFooter>
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" size="1x" />
            {dealer.city === null &&
            dealer.zipCode === null &&
            dealer.country === null
              ? t("unknown_point_of_sale")
              : dealer.city + " " + dealer.zipCode + " " + t(dealer.country)}
          </CardFooter>
        </Card>
      </Link>
    </Col>
  );
};

export default DealersElement;
