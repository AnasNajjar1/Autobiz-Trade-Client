import React, { Component } from "react";
import Translate from "../common/Translate";
import { Link } from "react-router-dom";
import { Col, Card, CardBody, CardTitle, CardFooter } from "reactstrap";
import RecordsElementGrade from "./RecordsElementGrade.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGavel,
  faUser,
  faMapMarkerAlt
} from "@fortawesome/free-solid-svg-icons";

class RecordsElement extends Component {
  state = {};

  render() {
    const { record } = this.props;
    const { vehicle, pointOfSale, salesInfo } = record.content;
    return (
      <Col xs="12" sm="6" md="12" lg="6" xl="4" className="mb-4">
        <Link className="link-card" to={`/records/${record.id}`}>
          <Card className="h-100">
            <div className="status">
              {salesInfo && salesInfo.type === "private" && (
                <div>
                  <FontAwesomeIcon icon={faUser} className="mr-2" size="1x" />
                  <Translate code="private_offer"></Translate>
                </div>
              )}

              {salesInfo && salesInfo.type === "stock" && (
                <div>
                  <FontAwesomeIcon icon={faGavel} className="mr-2" size="1x" />
                  <Translate code="in_stock"></Translate>
                </div>
              )}
            </div>
            {vehicle.carPictures && (
              <img
                className="card-img-top"
                src={vehicle.carPictures.front_picture}
                alt={vehicle.brandLabel + " " + vehicle.modelLabel}
              />
            )}
            <RecordsElementGrade grade={vehicle.profileCosts} />

            <CardBody>
              <CardTitle>
                {vehicle.brandLabel} {vehicle.modelLabel}
              </CardTitle>

              <p>{vehicle.versionlabel}</p>
              <div className="text-center">
                <span className="tag tag-white">
                  <span className="text-nowrap">
                    {vehicle.firstRegistrationDate.toString().substr(0, 4)}
                  </span>
                  /<span className="text-nowrap">{vehicle.fuelLabel}</span>/
                  <span className="text-nowrap">
                    {vehicle.mileage.toLocaleString()} Km
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
              {pointOfSale.city === null && pointOfSale.zipCode === null
                ? "unknown point of sale"
                : pointOfSale.city + " " + pointOfSale.zipCode}
            </CardFooter>
          </Card>
        </Link>
      </Col>
    );
  }
}

export default RecordsElement;
