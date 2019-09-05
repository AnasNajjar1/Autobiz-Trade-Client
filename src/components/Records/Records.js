import React, { useState, useEffect } from "react";
import Translate from "../common/Translate";
import axios from "axios";
import { Container, Row, Col, Alert } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faExclamationTriangle,
  faMapMarkerAlt
} from "@fortawesome/free-solid-svg-icons";
import Carousel from "./Carousel.js";
import TagsProps from "./TagsProps.js";
import Grade from "./Grade.js";
import Auction from "./Auction.js";
import CheckList from "./CheckList.js";
import Documents from "./Documents.js";
import TableList from "./TableList.js";
import EquipmentList from "./EquipmentList.js";
import UlList from "./UlList.js";

const Record = props => {
  const [record, setRecord] = useState([]);

  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const result = await axios.get(
          `${process.env.REACT_APP_API}/record?id=${props.refId}`
        );
        setRecord(result.data);
        setLoading(false);
      } catch (error) {
        setNotFound(true);
      }
    };
    fetchRecord();
  }, []);

  if (notFound) {
    return (
      <Container>
        <Row>
          <Col>
            <Alert color="secondary" className="text-center mb-5">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
              <Translate code="unknown_vehicle" />
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <Row>
          <Col>
            <div className="text-center my-5">
              <FontAwesomeIcon icon={faSpinner} size="3x" spin />
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  const {
    fileNumber,
    vehicle,
    pointOfSale,
    administrativeDetails,
    characteristics,
    equipments,
    history,
    market,
    keyPoints,
    documents,
    constructorsEquipments
  } = record.content;

  // exemple keyPoints
  /*   let keyPoints = {
    values: ["Première main", "Tva Récupérable", "Non accidenté", "Réseau"],
    country: { label: "France", code: "fr" }
  }; */

  // exemple documents
  /*   let documents = [
    {
      title: "Télecharger le rapport d'expertise",
      link:
        "https://www.autobiz-market.com/bundles/autobizmarketmodenonconnecte/CGU/FR/ConditionsGenerales.pdf"
    },
    {
      title: "Télecharger un autre pdf",
      link:
        "https://www.autobiz-market.com/bundles/autobizmarketmodenonconnecte/CGU/FR/ConditionsGenerales.pdf"
    }
  ]; */

  // exemple constructorsEquipments
  /*   let constructorsEquipments = [
    "Navigateur GPS",
    "Phare Xenon",
    "Volant Cuir",
    "Crochet attelage",
    "Prise USB, prise iPod",
    "Régulateur de vitesse",
    "Direction assistée",
    "Airbags Frontaux",
    "Système Audio général",
    "Ordinateur de nord",
    "Volant Multifonctions",
    "Phares antibrouillard",
    "Rétroviseurs électriques",
    "Fermeture centralisée des portes",
    "Peinture métalisée"
  ]; */
  return (
    <>
      <Container className="pb-5">
        <Row>
          <Col xs="12">
            <div className="gray pl-3 mb-1">Référence : {fileNumber}</div>
          </Col>
          <Col xs="12" md="6">
            <div className="car-props">
              <div className="section radius">
                <div className="h1">
                  {vehicle.brandLabel} {vehicle.modelLabel}
                </div>
                <div className="gray mb-1">{vehicle.versionlabel} </div>
                <Carousel items={vehicle.carPictures} />
              </div>
              <TagsProps
                tags={[
                  {
                    label: "year_mec",
                    value: vehicle.firstRegistrationDate.substr(0, 4)
                  },
                  { label: "fuelLabel", value: vehicle.fuelLabel },
                  { label: "km", value: vehicle.mileage.toLocaleString() }
                ]}
              />
              <Row>
                <Col>
                  <div className="h3 text-center">
                    <Translate code="global_condition"></Translate>
                  </div>
                  <Grade letter={vehicle.profileCosts} />
                </Col>
                {pointOfSale.pointOfSaleName !== null && (
                  <Col className="reseller-col">
                    <FontAwesomeIcon icon={faMapMarkerAlt} size="1x" />
                    {pointOfSale.pointOfSaleName} {pointOfSale.city}{" "}
                    {pointOfSale.zipCode}
                  </Col>
                )}
              </Row>
            </div>
          </Col>
          <Col>
            <div className="section radius mb-4 py-4">
              {<Auction refId={props.refId} />}
            </div>

            {keyPoints && (
              <div className="section radius mb-4 py-4">
                <div className="h2 mb-4 text-center">
                  <Translate code="key_points"></Translate>
                </div>
                <CheckList items={keyPoints} />
              </div>
            )}
            {documents &&
              (documents.length > 0 && <Documents items={documents} />)}
          </Col>
        </Row>
      </Container>
      <div className="white-container-wrapper">
        <Container>
          <Row>
            <Col xs="12" className="text-center">
              <div className="container-separator">
                <div className="container-separator-title">
                  <Translate code="vehicle_description"></Translate>
                </div>
              </div>
            </Col>
            <Col xs="12" md="6">
              {characteristics && (
                <>
                  <div className="section-title">
                    <Translate code="caracteristics"></Translate>
                  </div>
                  <TableList items={characteristics} />
                </>
              )}

              {administrativeDetails && (
                <>
                  <div className="section-title">
                    <Translate code="administrative_details"></Translate>
                  </div>
                  <TableList items={administrativeDetails} />
                </>
              )}
            </Col>
            <Col xs="12" md="6">
              {equipments && equipments.length > 0 && (
                <>
                  <div className="section-title">
                    <Translate code="declared_equiments"></Translate>
                  </div>
                  <EquipmentList items={equipments} />
                </>
              )}
              {market && (
                <>
                  <div className="section-title">
                    <Translate code="the_market"></Translate>
                  </div>
                  <TableList items={market} />
                </>
              )}
              {history && (
                <>
                  <div className="section-title">
                    <Translate code="history"></Translate>
                  </div>
                  <TableList items={history} />
                </>
              )}
            </Col>

            {constructorsEquipments && constructorsEquipments.length > 0 && (
              <>
                <Col xs="12">
                  <hr className="mt-5 mb-0" />
                </Col>
                <Col xs="12">
                  <div className="section-title text-center">
                    <Translate code="equiments"></Translate>
                    <i>
                      <Translate code="constructor_source"></Translate>
                    </i>
                  </div>
                  <UlList items={constructorsEquipments} />
                </Col>
              </>
            )}
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Record;
