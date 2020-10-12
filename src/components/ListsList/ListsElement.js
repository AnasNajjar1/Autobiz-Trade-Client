import React from "react";
import { t } from "../common/Translate";
import { Link } from "react-router-dom";
import { Row, Col, Card, CardBody, CardTitle, CardFooter } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCarSide } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import defaultFrontPicture from "../../assets/img/default-front-vehicle-picture.png";
import BrandsCarousel from "../common/BrandsCarousel";

const DealersElement = ({ list }) => {
  const lang = Cookies.get("appLanguage");

  let brands = [];

  list.Vehicles.forEach((i) => {
    const index = brands.findIndex((e) => e.label === i.brandLabel);

    if (index === -1) {
      brands.push({ label: i.brandLabel, nbVehicles: 1 });
    } else {
      brands[index].nbVehicles++;
    }
  });

  return (
    <Col xs="12" lg="6" className="mb-4">
      <div className="link-card">
        <Card className="h-100">
          <div className="status">
            <Row>
              <div className="col-auto text-success">
                <Link to={`/records?saleList=${list.id}`}>
                  <u>
                    <FontAwesomeIcon icon={faCarSide} className="mr-2" />
                    {t("online_offers:")} {list.Vehicles.length}
                  </u>
                </Link>
              </div>
            </Row>
          </div>
          <div className="card-head">
            <Link to={`/records?saleList=${list.id}`}>
              <img
                className="card-img-top"
                src={list.picture ? list.picture : defaultFrontPicture}
                alt={list.name}
              />
            </Link>
          </div>

          <CardBody>
            <CardTitle>
              <p className="brand-model">
                <Link to={`/records?saleList=${list.id}`}>
                  <span className="text-nowrap">{list.name}</span>
                </Link>
              </p>

              <BrandsCarousel brands={brands} />
            </CardTitle>
          </CardBody>
          <CardFooter>
            <Row>
              <Col>
                {t("start_of_the_sale")} :<br />
                {new Date(list.startDateTime).toLocaleDateString([lang], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Col>
              <Col>
                {t("end_of_the_sale")} :<br />
                {new Date(list.endDateTime).toLocaleDateString([lang], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Col>
            </Row>
          </CardFooter>
        </Card>
      </div>
    </Col>
  );
};

export default DealersElement;
