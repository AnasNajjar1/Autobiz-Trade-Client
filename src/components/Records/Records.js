import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Alert } from "reactstrap";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faExclamationTriangle,
  faMapMarkerAlt,
  faExternalLinkAlt
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
  const [auction, setAuction] = useState([]);
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

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const result = await axios.get(
          `${process.env.REACT_APP_API}/auction?id=${props.refId}`
        );
        setAuction(result.data);
      } catch (error) {}
    };
    fetchAuction();
  }, [record]);

  if (notFound) {
    return (
      <Container>
        <Row>
          <Col>
            <Alert color="secondary" className="text-center mb-5">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
              Véhicule inconnu
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
    market
    //keyPoints,
    //documents,
    //constructorsEquipments
  } = record.content;

  // exemple keyPoints
  let keyPoints = {
    values: ["Première main", "Tva Récupérable", "Non accidenté", "Réseau"],
    country: { label: "France", code: "fr" }
  };

  // exemple documents
  let documents = [
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
  ];

  // exemple constructorsEquipments
  let constructorsEquipments = [
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
  ];

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
                    label: "Année MEC",
                    value: vehicle.firstRegistrationDate.substr(0, 4)
                  },
                  { label: "Énergie", value: vehicle.fuelLabel },
                  { label: "Km", value: vehicle.mileage.toLocaleString() }
                ]}
              />
              <Row>
                <Col>
                  <div className="h3 text-center">État général</div>
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
              <Auction values={auction} />
            </div>

            {keyPoints && (
              <div className="section radius mb-4 py-4">
                <div className="h2 mb-4 text-center">Points clés</div>
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
                  Description du véhicule
                </div>
              </div>
            </Col>
            <Col xs="12" md="6">
              {characteristics && (
                <>
                  <div className="section-title">Caractéristiques</div>
                  <TableList items={characteristics} />
                </>
              )}

              {administrativeDetails && (
                <>
                  <div className="section-title">
                    Détails administratifs <i>Source Sivin</i>
                  </div>
                  <TableList items={administrativeDetails} />
                </>
              )}
            </Col>
            <Col xs="12" md="6">
              {equipments && equipments.length > 0 && (
                <>
                  <div className="section-title">Equipements déclarés</div>
                  <EquipmentList items={equipments} />
                </>
              )}
              {market && (
                <>
                  <div className="section-title">Le marché</div>
                  <TableList items={market} />
                </>
              )}
              {history && (
                <>
                  <div className="section-title">Historique</div>
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
                    Equipements <i>Sources constructeur</i>
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
