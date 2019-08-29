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
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      console.log("ici:", props);
      try {
        const result = await axios.get(
          `${process.env.REACT_APP_API}/record?id=${props.refId}`
        );
        console.log(result.data);
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
    vehicle,
    pointOfSale,
    history,
    administrativeDetails,
    documents,
    characteristics,
    constructorsEquipments,
    equipments,
    market
  } = record.content;

  let keyPoints = {
    vat: history.vat,
    servicingInBrandNetwork: history.servicingInBrandNetwork,
    firstHand: administrativeDetails.firstHand
  };

  keyPoints = _.keys(_.pickBy(keyPoints));
  console.log(constructorsEquipments);
  return (
    <>
      <Container className="pb-5">
        <Row>
          <Col xs="12">
            <div className="gray pl-3 mb-1">Référence :</div>
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
              {/* <Auction values={auction} /> */}
            </div>

            {keyPoints.length > 0 && (
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
              {characteristics.length > 0 && (
                <>
                  <div className="section-title">Caractéristiques</div>
                  <TableList items={characteristics} />
                </>
              )}

              {administrativeDetails.length > 0 && (
                <>
                  <div className="section-title">
                    Détails administratifs <i>Source Sivin</i>
                  </div>
                  <TableList items={administrativeDetails} />
                </>
              )}
            </Col>
            <Col xs="12" md="6">
              {equipments.length > 0 && (
                <>
                  <div className="section-title">Equipements déclarés</div>
                  <EquipmentList items={equipments} />
                </>
              )}
              {/*
              {market && (
                <>
                  <Row className="align-items-end mb-2">
                    <Col>
                      <div className="section-title mb-0">Le marché</div>
                    </Col>
                    {market.link && (
                      <Col className="text-right">
                        <small>
                          <a href={market.link} className="gray">
                            Voir l’analyse de marché du véhicule{" "}
                            <FontAwesomeIcon
                              icon={faExternalLinkAlt}
                              size="1x"
                            />
                          </a>
                        </small>
                      </Col>
                    )}
                  </Row>
                  <TableList items={market.items} />
                </>
              )}
                          {history.length > 0 && (
                <>
                  <div className="section-title">Historique</div>
                  <TableList items={history} />
                </>
              )} */}
            </Col>

            {constructorsEquipments && (
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
  /* 
  const {
    vehicle,
    pointOfSale,
    auction,
    keyPoints,
    documents,
    equipments,
    characteristics,
    administrativeDetails,
    market,
    history,
    constructorsEquipments
  } = record;

  return (
    <>
      <Container className="pb-5">
        <Row>
          <Col xs="12">
            <div className="gray pl-3 mb-1">Référence : {record.refHexaId}</div>
          </Col>
          <Col xs="12" md="6">
            <div className="car-props">
              <div className="section radius">
                <div className="h1">
                  {vehicle.brandLabel} {vehicle.modelLabel}
                </div>
                <div className="gray mb-1">{vehicle.versionlabel} </div>
                <Carousel items={vehicle.car_pictures} />
              </div>
              <TagsProps
                tags={[
                  { label: "Année MEC", value: vehicle.year_mec },
                  { label: "Énergie", value: vehicle.fuelLabel },
                  { label: "Km", value: vehicle.mileage.toLocaleString() }
                ]}
              />
              <Row>
                <Col>
                  <div className="h3 text-center">État général</div>
                  <Grade letter={vehicle.profile_costs} />
                </Col>
                <Col className="reseller-col">
                  <FontAwesomeIcon icon={faMapMarkerAlt} size="1x" />
                  {pointOfSale.pointOfSaleName} {pointOfSale.city}{" "}
                  {pointOfSale.zipCode}
                </Col>
              </Row>
            </div>
          </Col>
          <Col>
            <div className="section radius mb-4 py-4">
              <Auction values={auction} />
            </div>

            <div className="section radius mb-4 py-4">
              <div className="h2 mb-4 text-center">Points clés</div>
              <CheckList items={keyPoints} />
            </div>

            <Documents items={documents} />
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
              {characteristics.length > 0 && (
                <>
                  <div className="section-title">Caractéristiques</div>
                  <TableList items={characteristics} />
                </>
              )}

              {administrativeDetails.length > 0 && (
                <>
                  <div className="section-title">
                    Détails administratifs <i>Source Sivin</i>
                  </div>
                  <TableList items={administrativeDetails} />
                </>
              )}
            </Col>
            <Col xs="12" md="6">
              {equipments.length > 0 && (
                <>
                  <div className="section-title">Equipements déclarés</div>
                  <EquipmentList items={equipments} />
                </>
              )}

              {market.length > 0 && (
                <>
                  <Row className="align-items-end mb-2">
                    <Col>
                      <div className="section-title mb-0">Le marché</div>
                    </Col>
                    {market.link && (
                      <Col className="text-right">
                        <small>
                          <a href={market.link} className="gray">
                            Voir l’analyse de marché du véhicule{" "}
                            <FontAwesomeIcon
                              icon={faExternalLinkAlt}
                              size="1x"
                            />
                          </a>
                        </small>
                      </Col>
                    )}
                  </Row>
                  <TableList items={market.items} />
                </>
              )}
              {history.length > 0 && (
                <>
                  <div className="section-title">Historique</div>
                  <TableList items={history} />
                </>
              )}
            </Col>

            {constructorsEquipments.length > 0 && (
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
  ); */
};

export default Record;
