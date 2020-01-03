import React, { useState, useEffect } from "react";
import Translate, { t } from "../common/Translate";
import Cookies from "js-cookie";
import moment from "moment";
import _ from "lodash";
import { API } from "aws-amplify";
import { Container, Row, Col, Alert } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuoteLeft,
  faQuoteRight,
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

  const appLanguage = Cookies.get("appLanguage");

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const result = await API.get(
          "b2bPlateform",
          `/vehicle/${props.refId}`,
          { response: true }
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

  const { pointOfSale = {}, bookmarked } = record;

  let gcDate = _.get(record, "administrativeDetails.gcDate", null);
  try {
    if (gcDate)
      _.set(
        record,
        "administrativeDetails.ownershipDuration",
        calculateOwnerShipDuration(gcDate)
      );
  } catch (e) {
    console.log("Error while calculate ownershipDuration");
  }

  return (
    <>
      <Container className="pb-5">
        <Row>
          <Col xs="12">
            <div className="gray pl-3 mb-1">
              {t("reference")}
              {record.fileNumber}
            </div>
          </Col>
          <Col xs="12" md="6">
            <div className="car-props">
              <div className="section radius">
                <div className="h1">
                  {record.brandLabel} {record.modelLabel}
                </div>
                {record.versionLabel && (
                  <div className="gray mb-1">{record.versionLabel} * </div>
                )}
                {record.gallery && <Carousel items={record.gallery} />}
              </div>
              <TagsProps
                tags={[
                  {
                    label: "firstRegistrationDate",
                    value: moment(
                      record.characteristics.firstRegistrationDate
                    ).format("MM-YYYY")
                  },
                  { label: "fuelLabel", value: record.fuelLabel },
                  {
                    label: "km",
                    value: record.mileage && record.mileage.toLocaleString()
                  }
                ]}
              />
              <Row>
                <Col>
                  <div className="h3 text-center">
                    <Translate code="global_condition"></Translate>
                  </div>
                  <Grade letter={record.profileCosts} />
                </Col>
                {pointOfSale.name !== null && (
                  <Col className="reseller-col">
                    <FontAwesomeIcon icon={faMapMarkerAlt} size="1x" />
                    {pointOfSale.name}
                    <br />
                    {pointOfSale.zipCode} {pointOfSale.city}
                    <br />
                    {t(pointOfSale.country)}
                  </Col>
                )}
              </Row>
            </div>
            {record.versionLabel && (
              <Row>
                <Col>
                  <p className="small font-italic text-secondary">
                    {t("version_warning_message")}
                  </p>
                </Col>
              </Row>
            )}
          </Col>
          <Col>
            <Auction refId={props.refId} bookmarked={bookmarked} />
            {record.salesComment && (
              <div className="section radius mb-4 py-4">
                <p className="gray">
                  {t("sellers_comment")}

                  {appLanguage !== record.salesCommentInt.sourceLanguage && (
                    <span> {t("translated")}</span>
                  )}
                </p>
                <p className="mb-0 font-italic">
                  <FontAwesomeIcon
                    icon={faQuoteLeft}
                    className="mr-2 text-primary"
                  />
                  {(record.salesCommentInt &&
                    record.salesCommentInt.translation[appLanguage]) ||
                    record.salesComment}
                  <FontAwesomeIcon
                    icon={faQuoteRight}
                    className="ml-2 text-primary"
                  />
                </p>
                {appLanguage !== record.salesCommentInt.sourceLanguage && (
                  <p className="gray small mt-2">
                    ({t("original")}) {record.salesComment}
                  </p>
                )}
              </div>
            )}
            {record.keyPoints && record.keyPoints.length > 0 && (
              <div className="section radius mb-4 py-4">
                <div className="h2 mb-4 text-center">
                  <Translate code="key_points"></Translate>
                </div>
                <CheckList items={record.keyPoints} />
              </div>
            )}
            {record.documents && <Documents items={record.documents} />}
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
              {record.characteristics && (
                <>
                  <div className="section-title">
                    <Translate code="caracteristics"></Translate>
                  </div>
                  <TableList items={record.characteristics} />
                </>
              )}
              {record.administrativeDetails && (
                <>
                  <div className="section-title">
                    <Translate code="administrative_details"></Translate>
                  </div>
                  <TableList items={record.administrativeDetails} />
                </>
              )}
            </Col>
            <Col xs="12" md="6">
              {record.declaredEquipments &&
                record.declaredEquipments.length > 0 && (
                  <>
                    <div className="section-title">
                      <Translate code="declared_equiments"></Translate>
                    </div>
                    <EquipmentList items={record.declaredEquipments} />
                  </>
                )}
              {record.market && (
                <>
                  <div className="section-title">
                    <Row>
                      <Col xs="12" md="4">
                        <Translate code="the_market"></Translate>
                        <i><Translate code="autobizMarketSource"></Translate></i>
                      </Col>
                      <Col xs="12" md="8" className="section-title-link">
                        <a href={record.market.MarketLink} target="_blank">
                          {`${t("market_link")} `}
                          <FontAwesomeIcon icon={faExternalLinkAlt} />
                        </a>
                      </Col>
                    </Row>
                  </div>
                  <TableList items={record.market} />
                </>
              )}
              {record.history && (
                <>
                  <div className="section-title">
                    <Translate code="history"></Translate>
                  </div>
                  <TableList items={record.history} />
                </>
              )}
              {record.servicing && (
                <>
                  <div className="section-title">
                    <Translate code="servicing"></Translate>
                  </div>
                  <TableList items={record.servicing} />
                </>
              )}
            </Col>

            {record.constructorEquipments &&
              record.constructorEquipments.length > 0 && (
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
                    {Object.values(record.constructorEquipments).map(items => (
                      <UlList items={items} />
                    ))}
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

const calculateOwnerShipDuration = gcDate => {
  return moment.duration(moment().diff(moment(gcDate))).asMilliseconds()
};
