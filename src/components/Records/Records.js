import React, { useState, useEffect } from "react";
import Translate, { t } from "../common/Translate";
import Cookies from "js-cookie";
import moment from "moment";
import _ from "lodash";
import { API } from "aws-amplify";
import {
  Container,
  Row,
  Col,
  Alert,
  Button,
  TabContent,
  TabPane
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuoteLeft,
  faQuoteRight,
  faSpinner,
  faExclamationTriangle,
  faMapMarkerAlt,
  faExternalLinkAlt,
  faExclamationCircle
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
import { BrowserView, MobileView } from "react-device-detect";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
const Record = props => {
  const [record, setRecord] = useState([]);
  const [sections, setSections] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("1");
  const [activeSubTab, setActiveSubTab] = useState("servicing");
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

  useEffect(() => {
    let ld = [];

    if (record !== null && record.damages) {
      Object.values(record.damages).map(v => {
        let isExist = _.get(ld, v.zone, null);
        if (isExist === null) ld[v.zone] = [v];
        else isExist.push(v);
      });
    }
    setSections(ld);
  }, [record]);

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
  let orderadminDetail = {};
  let gcDate = _.get(record, "administrativeDetails.gcDate", null);

  try {
    if (gcDate)
      Object.entries(record.administrativeDetails).forEach(([key, value]) => {
        _.set(orderadminDetail, key, value);
        if (key === "gcDate" && gcDate)
          _.set(
            orderadminDetail,
            "ownershipDuration",
            calculateOwnerShipDuration(gcDate)
          );
      });
  } catch (e) {
    console.log("Error while calculate ownershipDuration");
  }
  if (orderadminDetail) record.administrativeDetails = orderadminDetail;
  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

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
                <Button
                  color="light"
                  className={
                    activeTab === "1"
                      ? "container-separator-title"
                      : "container-separator-title-light"
                  }
                  onClick={() => toggle("1")}
                >
                  {t("vehicle_description")}
                </Button>
                <Button
                  color="light"
                  className={
                    activeTab === "2"
                      ? "container-separator-title"
                      : "container-separator-title-light"
                  }
                  onClick={() => toggle("2")}
                >
                  {t("titleServicingAndDamage")}
                </Button>
              </div>
            </Col>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <Row>
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
                        {/* {Object.values(record.administrativeDetails).map(
                          items => ( */}
                        <TableList items={record.administrativeDetails} />
                        {/* )
                        )} */}
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
                            <Col xs="12" md="6" className="section-market">
                              <Translate code="the_market"></Translate>
                              <i>
                                <Translate code="autobizMarketSource"></Translate>
                              </i>
                            </Col>
                            <Col xs="12" md="6" className="section-title-link">
                              <a
                                href={record.market.MarketLink}
                                target="_blank"
                              >
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
                          {Object.values(record.constructorEquipments).map(
                            items =>
                              items && (
                                <UlList
                                  items={items}
                                  key={Object.keys(items)}
                                />
                              )
                          )}
                        </Col>
                      </>
                    )}
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <BrowserView>
                  <Row>
                    <Col lg="12" className="section-zone">
                      <ListZones
                        activeSubTab={activeSubTab}
                        setActiveSubTab={setActiveSubTab}
                      />
                    </Col>
                    <div className="section-damages">
                      {activeSubTab && (
                        <ShowDamages
                          data={_.get(sections, activeSubTab, null)}
                        />
                      )}
                    </div>
                  </Row>
                </BrowserView>
                <MobileView>
                  <Row>
                    <Col lg="12">
                      {Object.entries(sections).map(([section, items]) => (
                        <div key={section}>
                          <div className="section-title">{t(section)}</div>
                          {subDamages(items)}
                        </div>
                      ))}
                    </Col>
                  </Row>
                </MobileView>
              </TabPane>
            </TabContent>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Record;

const calculateOwnerShipDuration = gcDate => {
  return moment.duration(moment().diff(moment(gcDate))).asMilliseconds();
};

const ShowDamages = data => {
  let res;
  if (_.get(data, "data", null) !== null) {
    res = Object.values(data).map(v => iterateData(v));
  } else
    res = (
      <Col className="mt-5">
        <Translate code="no_damage" />
      </Col>
    );
  return res;
};

const iterateData = v => {
  let item = null;
  item = subDamages(v);
  return item;
};

const subDamages = items => {
  let damagesImage = [];
  items.forEach((i, key) => {
    if (i.damage_picture) damagesImage[key] = [i.damage_picture];
    if (i.damage_picture2) damagesImage[key].push(i.damage_picture2);
  });
  return items.map((i, key) => (
    <Damage i={i} key={key} index={key} damagesImage={damagesImage} />
  ));
};

const Damage = ({ i, index, damagesImage }) => {
  const [popedUp, setPopup] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(null);

  const togglePopup = photo => {
    let currentKey;
    damagesImage[index].forEach((i, key) => {
      if (i === photo) currentKey = key;
    });
    setPhotoIndex(currentKey);
    setPopup(!popedUp);
  };

  let accidentDamage;
  if (typeof i.damage === "object") accidentDamage = i.damage;

  return (
    <div
      className={
        (i.is_custom == true &&
          i.custom_damage !== "" &&
          "custom-damage mt-4") ||
        "damage-list mt-4"
      }
      key={i.element}
    >
      <div className="item">
        {(i.is_custom == true && i.custom_damage !== "" && (
          <>
            <div className="label">
              <FontAwesomeIcon icon={faExclamationCircle} />
              {t("other_custom_damage")} {t("inFrench")}
            </div>
            <div className="value">{i.custom_damage}</div>
          </>
        )) || (
          <>
            <div className="label">{t(i.element)}</div>
            <div className="value">
              {typeof i.damage === "object" &&
                i.damage.map((i, key) => {
                  if (key < accidentDamage.length - 1) return `${t(i)}, `;
                  else return `${t(i)}`;
                })}
              {typeof i.damage !== "object" && t(i.damage)}
            </div>
          </>
        )}
        {popedUp && (
          <Lightbox
            mainSrc={damagesImage[index][photoIndex]}
            nextSrc={
              damagesImage[index][(photoIndex + 1) % damagesImage[index].length]
            }
            prevSrc={
              damagesImage[index][
                (photoIndex + damagesImage[index].length - 1) %
                  damagesImage[index].length
              ]
            }
            onCloseRequest={togglePopup}
            onMovePrevRequest={() =>
              setPhotoIndex(
                (photoIndex + damagesImage[index].length - 1) %
                  damagesImage[index].length
              )
            }
            onMoveNextRequest={() =>
              setPhotoIndex((photoIndex + 1) % damagesImage[index].length)
            }
          />
        )}
        {i.damage_picture && (
          <span onClick={() => togglePopup(i.damage_picture)}>
            <img src={i.damage_picture} className="damage-img" />
          </span>
        )}
        {i.damage_picture2 && (
          <span onClick={() => togglePopup(i.damage_picture2)}>
            <img src={i.damage_picture2} className="damage-img" />
          </span>
        )}
      </div>
    </div>
  );
};

const ListZones = ({ activeSubTab, setActiveSubTab }) => {
  const listZone = [
    "servicing",
    "wheels",
    "body",
    "inner",
    "road_test",
    "motor",
    "crash"
  ];

  return (
    <div className="list-zone">
      <div className="item">
        {listZone.map(i => (
          <div
            className={i == activeSubTab ? "label active-label" : "label"}
            key={i}
            onClick={() => setActiveSubTab(i)}
          >
            {`${t(i)}`}
          </div>
        ))}
      </div>
    </div>
  );
};
