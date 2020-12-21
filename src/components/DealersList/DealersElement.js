import React from "react";
import { t } from "../common/Translate";
import { Link } from "react-router-dom";
import { Row, Col, Card, CardBody, CardTitle, CardFooter } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faCarSide } from "@fortawesome/free-solid-svg-icons";
import Bookmark from "../common/Bookmark";
import { staticImagesUrl } from "../../config";

import BrandsCarousel from "../common/BrandsCarousel";
const DealersElement = (props) => {
  const { dealer } = props;

  return (
    <Col xs="12" lg="6" xl="6" className="mb-4">
      <div className="link-card">
        <Card className="h-100">
          <div className="status">
            <Row>
              <div className="col-auto text-success">
                <Link to={`/dealers/${dealer.uuid}`}>
                  <u>
                    <FontAwesomeIcon icon={faCarSide} className="mr-2" />
                    {t("online_offers:")} {dealer.countVehicles}
                  </u>
                </Link>
              </div>
            </Row>
          </div>
          <div className="card-head">
            <Link to={`/dealers/${dealer.uuid}`}>
              <img
                className="card-img-top"
                src={
                  dealer.picture
                    ? dealer.picture
                    : `${staticImagesUrl}/pointOfSales/default-front-dealer-picture.png`
                }
                alt={dealer.name}
              />
            </Link>
          </div>

          <CardBody>
            <Row>
              <Col>
                <Bookmark
                  scope="pointOfSale"
                  refId={dealer.uuid}
                  bookmarked={dealer.isBookmarkedByUser}
                />
              </Col>
            </Row>
            <CardTitle>
              <p className="brand-model">
                <Link to={`/dealers/${dealer.uuid}`}>
                  <span className="text-nowrap">{dealer.name}</span>
                </Link>
              </p>
              <BrandsCarousel brands={dealer.brandsOnline} />
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
      </div>
    </Col>
  );
};

export default DealersElement;
