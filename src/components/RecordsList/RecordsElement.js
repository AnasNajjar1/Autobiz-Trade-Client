import React, { Component } from "react";
import Translate, { t } from "../common/Translate";
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
    const { vehicle = {} } = record;

    return (
      <Col xs="12" sm="6" md="12" lg="6" xl="4" className="mb-4">
        <Link className="link-card" to={`/records/${record.uuid}`}>
          <Card className="h-100">
            <div className="status">
              {record.type === "private" && (
                <div>
                  <FontAwesomeIcon icon={faUser} className="mr-2" size="1x" />
                  <Translate code="private_offer"></Translate>
                </div>
              )}

              {record.type === "stock" && (
                <div>
                  <FontAwesomeIcon icon={faGavel} className="mr-2" size="1x" />
                  <Translate code="in_stock"></Translate>
                </div>
              )}
            </div>
            {record.front_picture && (
              <img
                className="card-img-top"
                src={record.front_picture}
                alt={record.brandLabel + " " + record.modelLabel}
              />
            )}
            {record.profileCosts && (
              <RecordsElementGrade grade={record.profileCosts} />
            )}
            <CardBody>
              <CardTitle>
                {record.brandLabel} {record.modelLabel}
              </CardTitle>

              <p>{record.versionlabel}</p>
              <div className="text-center">
                <span className="tag tag-white">
                  <span className="text-nowrap">{record.yearMec}</span>/
                  <span className="text-nowrap">{t(record.fuelLabel)}</span>/
                  <span className="text-nowrap">
                    {record.mileage && record.mileage.toLocaleString()} Km
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
