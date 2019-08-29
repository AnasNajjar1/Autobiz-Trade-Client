import React, { Component } from "react";
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
    const { vehicle, pointOfSale } = record.content;
    return (
      <Col xs="12" sm="6" md="12" lg="6" xl="4" className="mb-4">
        <Link className="link-card" to={`/records/${record.id}`}>
          <Card className="h-100">
            {/*             <div className="status">
              {record.offers_type === "private" && (
                <div>
                  <FontAwesomeIcon icon={faUser} className="mr-2" size="1x" />
                  offre à particulier
                </div>
              )}

              {record.offers_type === "stock" && (
                <div>
                  <FontAwesomeIcon icon={faGavel} className="mr-2" size="1x" />
                  en stock
                </div>
              )}
            </div> */}

            {/*             <img
              className="card-img-top"
              src={vehicle.carPictures.front_picture}
              alt={vehicle.brandLabel + " " + vehicle.modelLabel}
            /> */}
            {/*
            <RecordsElementGrade grade={vehicle.profile_costs} />
*/}

            <CardBody>
              <CardTitle>
                {/*  {record.price}  */}
                {vehicle.brandLabel} {vehicle.modelLabel}
              </CardTitle>

              <p>{vehicle.versionlabel}</p>
              {/*               <div className="text-center">
                <span className="tag tag-white">
                  <span className="text-nowrap">{vehicle.year_mec}</span>/
                  <span className="text-nowrap">{vehicle.bodyLabel}</span>/
                  <span className="text-nowrap">
                    {vehicle.mileage.toLocaleString()} Km
                  </span>
                </span>
              </div> */}
            </CardBody>
            {/*  
            <CardFooter>
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="mr-1"
                size="1x"
              />
              {pointOfSale.city} {pointOfSale.zipCode}
            </CardFooter>
            */}
          </Card>
        </Link>
      </Col>
    );
  }
}

export default RecordsElement;
