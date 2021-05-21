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
  TabPane,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faQuoteLeft,
  faQuoteRight,
  faSpinner,
  faExclamationTriangle,
  faExternalLinkAlt,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import iconCockadeRed from "../../assets/img/cockade-red.svg";
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
import Parser from "html-react-parser";
import Bookmark from "../common/Bookmark";
import Tooltip from "../common/Tooltip";
import "react-image-lightbox/style.css";
import {
  showWheelsImg,
  orderGalleryPictures,
  excludedMarketData,
} from "../../helper/Vehicle";

const Record = (props) => {
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
        const result = await API.get("b2bPlateform", `/sale/${props.refId}`, {
          response: true,
        });
        setRecord(result.data);
        setLoading(false);
      } catch (error) {
        setNotFound(true);
      }
    };
    fetchRecord();
  }, [props.refId]);

  useEffect(() => {
    let ld = [];

    if (record && record.vehicle && record.vehicle.damages) {
      Object.values(record.vehicle.damages).map((v) => {
        let isExist = _.get(ld, v.zone, null);

        if (isExist === null) {
          ld[v.zone] = [v];
        } else {
          isExist.push(v);
        }
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

  const { vehicle, supplyType } = record;
  const { pointofsale, market } = vehicle;
  const gallery = orderGalleryPictures(vehicle.gallery);
  let orderadminDetail = {};
  let gcDate = _.get(vehicle, "administrativeDetails.gcDate", null);

  const { rankedConstructorEquipments } = vehicle || {};
  const {
    veryImportantDatEquipment,
    importantDatEquipment,
    fewImportantDatEquipment,
  } = rankedConstructorEquipments || [];

  const entryStockDate =
    supplyType === "OFFER_TO_PRIVATE" && vehicle.entryStockDate
      ? moment(vehicle.entryStockDate).format("DD-MM-YYYY")
      : null;

  const displayMarketData =
    _.filter(
      _.filter(market, (v, k) => k !== "marketLink"),
      (d) => d !== null
    ).length !== 0
      ? _.some(
          excludedMarketData,
          _.omit(market, ["marketDataDate", "marketLink"])
        )
        ? false
        : true
      : false;


  // TODO: move ownerShipDuration calculation to API
  try {
    if (gcDate) {
      Object.entries(vehicle.administrativeDetails).forEach(([key, value]) => {
        _.set(orderadminDetail, key, value);
        if (key === "gcDate" && gcDate) {
          _.set(
            orderadminDetail,
            "ownershipDuration",
            calculateOwnerShipDuration(gcDate)
          );
        }
      });
      if (orderadminDetail) {
        vehicle.administrativeDetails = orderadminDetail;
      }
    }
  } catch (e) {
    console.log("Error while calculate ownershipDuration");
  }

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <>
      <Container className="pb-5">
        <Row className="mb-3">
          <div className="col-auto">
            <small className="gray pl-3 mb-1">
              {t("reference")}
              {vehicle.fileNumber}
            </small>
          </div>
          <div className="col text-right">
            {supplyType === "OFFER_TO_PRIVATE" && (
              <>
                <img
                  alt={t("offerToPrivate")}
                  className="mr-2"
                  src={iconCockadeRed}
                />
                <small className="text-danger">{t("offerToPrivate")}</small>
                <Tooltip id="legendOfferToPrivate">
                  {t("legendOfferToPrivate")}
                </Tooltip>
              </>
            )}
            {supplyType === "STOCK" && (
              <>
                <FontAwesomeIcon
                  icon={faShoppingCart}
                  className="mr-2 text-success"
                  size="1x"
                />
                <small className="gray">{t("in_stock")}</small>
                <Tooltip id="legendStock">{t("legendStock")}</Tooltip>
              </>
            )}
          </div>
        </Row>
        <Row>
          <Col xs="12" md="6">
            <div className="car-props">
              <div className="section radius">
                <Bookmark
                  refId={record.uuid}
                  bookmarked={record.isBookmarkedByUser}
                  scope="sale"
                />

                <div className="h1">
                  {vehicle.brandLabel} {vehicle.modelLabel}
                </div>
                {vehicle.versionLabel && (
                  <div className="gray mb-1">{vehicle.versionLabel} * </div>
                )}
                {gallery && <Carousel items={gallery} />}
              </div>
              <TagsProps
                tags={[
                  {
                    label: "firstRegistrationDate",
                    value: moment(
                      vehicle.characteristics.firstRegistrationDate,
                      "YYYY-MM-DD"
                    ).format("MM-YYYY"),
                  },
                  {
                    label: "fuelLabel",
                    value: vehicle.characteristics.fuelLabel,
                  },
                  {
                    label: "km",
                    value:
                      vehicle.characteristics.mileage &&
                      vehicle.characteristics.mileage.toLocaleString(),
                  },
                ]}
              />
              <Row>
                <Col>
                  <div className="h3 text-center">
                    <Translate code="global_condition"></Translate>
                  </div>
                  <Grade letter={vehicle.profileBodyCosts} />
                </Col>
                {pointofsale && pointofsale.name !== null && (
                  <Col xs="12" sm="6" md="12" lg="6">
                    <div className="reseller-block">
                      {pointofsale.name}
                      <br />
                      {pointofsale.zipCode} {pointofsale.city}
                      <br />
                      {t(pointofsale.country)}
                      <br />
                      <a href={`/dealers/${pointofsale.uuid}`}>
                        <FontAwesomeIcon
                          icon={faExternalLinkAlt}
                          className="mr-1"
                        />
                        {t("linkCarDealer")}
                      </a>
                    </div>
                  </Col>
                )}
              </Row>
            </div>
            {vehicle.versionLabel && (
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
            <Auction refId={props.refId} entryStockDate={entryStockDate} />
            {record.comment && (
              <div className="section radius mb-4 py-4">
                <p className="gray">
                  {t("sellers_comment")}

                  {record.commentInt &&
                    appLanguage !== record.commentInt.sourceLanguage && (
                      <span> {t("translated")}</span>
                    )}
                </p>
                <p className="mb-0 font-italic">
                  <FontAwesomeIcon
                    icon={faQuoteLeft}
                    className="mr-2 text-primary"
                  />
                  {(record.commentInt &&
                    record.commentInt.translation[appLanguage]) ||
                    record.comment}
                  <FontAwesomeIcon
                    icon={faQuoteRight}
                    className="ml-2 text-primary"
                  />
                </p>
                {record.commentInt &&
                  appLanguage !== record.commentInt.sourceLanguage && (
                    <p className="gray small mt-2">
                      ({t("original")}) {record.comment}
                    </p>
                  )}
              </div>
            )}
            {vehicle.keyPoints && vehicle.keyPoints.length > 0 && (
              <div className="section radius mb-4 py-4">
                <div className="h2 mb-4 text-center">
                  <Translate code="key_points"></Translate>
                </div>
                <CheckList items={vehicle.keyPoints} />
              </div>
            )}
            {vehicle.documents && <Documents items={vehicle.documents} />}
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

                {pointofsale &&
                  (pointofsale.paymentDeadline ||
                    pointofsale.pickupDeadline ||
                    pointofsale.comments) && (
                    <Button
                      color="light"
                      className={
                        activeTab === "3"
                          ? "container-separator-title"
                          : "container-separator-title-light"
                      }
                      onClick={() => toggle("3")}
                    >
                      {t("sale_informations")}
                    </Button>
                  )}
              </div>
            </Col>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <Row>
                  <Col xs="12" md="6">
                    {vehicle.characteristics && (
                      <>
                        <div className="section-title">
                          <Translate code="caracteristics"></Translate>
                        </div>
                        <TableList items={vehicle.characteristics} />
                      </>
                    )}
                    {vehicle.administrativeDetails && (
                      <>
                        <div className="section-title">
                          <Translate code="administrative_details"></Translate>
                        </div>
                        <TableList items={vehicle.administrativeDetails} />
                      </>
                    )}
                  </Col>
                  <Col xs="12" md="6">
                    {vehicle.declaredEquipments &&
                      vehicle.declaredEquipments.length > 0 && (
                        <>
                          <div className="section-title">
                            <Translate code="declared_equiments"></Translate>
                          </div>
                          <EquipmentList items={vehicle.declaredEquipments} />
                        </>
                      )}
                    {market && (
                      <>
                        <div className="section-title">
                          <Row>
                            <Col xs="12" md="6" className="section-market">
                              <Translate code="the_market"></Translate>
                              <i>
                                <Translate code="autobizMarketSource"></Translate>
                              </i>
                            </Col>
                            {market.marketLink && (
                              <Col
                                xs="12"
                                md="6"
                                className="section-title-link"
                              >
                                <a href={market.marketLink} target="_blank">
                                  {`${t("market_link")} `}
                                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                                </a>
                              </Col>
                            )}
                          </Row>
                        </div>
                        <div
                          className={`list-table-default ${
                            !displayMarketData && "list-table-empty"
                          }`}
                        >
                          {displayMarketData ? (
                            <>
                              <TableList items={market} />
                              {market.marketDataDate && (
                                <div className="pb-2 px-4">
                                  <small>
                                    {t("dataDate")} :{" "}
                                    {moment(market.marketDataDate).format(
                                      "DD/MM/YYYY"
                                    )}
                                  </small>
                                </div>
                              )}
                            </>
                          ) : (
                            <span className="text-danger">
                              {t("unavailableMarketData")}
                            </span>
                          )}
                        </div>
                      </>
                    )}

                    {vehicle.history && (
                      <>
                        <div className="section-title">
                          <Translate code="history"></Translate>
                        </div>
                        <TableList items={vehicle.history} />
                      </>
                    )}
                    {vehicle.servicing && (
                      <>
                        <div className="section-title">
                          <Translate code="servicing"></Translate>
                        </div>
                        <TableList items={vehicle.servicing} />
                      </>
                    )}
                  </Col>
                  {vehicle.rankedConstructorEquipments && (
                    <>
                      <Col xs="12">
                        <hr className="my-3" />
                      </Col>
                      <Col xs="12">
                        <div className="section-title mt-0 mb-1">
                          <Translate code="equiments"></Translate>
                          <i>
                            <Translate code="constructor_source"></Translate>
                          </i>
                        </div>
                      </Col>
                      <Col xs="12" lg="6">
                        {veryImportantDatEquipment && (
                          <UlList
                            items={veryImportantDatEquipment}
                            title={t("veryImportantDatEquipment")}
                          />
                        )}

                        {importantDatEquipment && (
                          <UlList
                            items={importantDatEquipment}
                            title={t("importantDatEquipment")}
                          />
                        )}
                      </Col>
                      <Col xs="12" lg="6">
                        {fewImportantDatEquipment && (
                          <UlList
                            items={fewImportantDatEquipment}
                            title={t("fewImportantDatEquipment")}
                          />
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
                          gallery={vehicle.gallery}
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
              {pointofsale && (
                <TabPane tabId="3">
                  <Row className="bordered-row">
                    <Col md="4">
                      <div className="h2 mb-3">{t("payment_deadline")}</div>
                      {(pointofsale.paymentDeadline &&
                        Parser(pointofsale.paymentDeadline)) ||
                        t("no_informations")}
                    </Col>
                    <Col md="4">
                      <div className="h2 mb-3">{t("pickup_deadline")}</div>
                      {(pointofsale.pickupDeadline &&
                        Parser(pointofsale.pickupDeadline)) ||
                        t("no_informations")}
                    </Col>
                    <Col md="4">
                      <div className="h2 mb-3">{t("comments")}</div>
                      {(pointofsale.comments && Parser(pointofsale.comments)) ||
                        t("no_informations")}
                    </Col>
                  </Row>
                </TabPane>
              )}
            </TabContent>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Record;

const calculateOwnerShipDuration = (gcDate) => {
  return moment.duration(moment().diff(moment(gcDate))).asMilliseconds();
};

const ShowDamages = ({ data, gallery }) => {
  let res;
  if (data !== null) {
    res = iterateData(data, gallery);
  } else
    res = (
      <Col className="mt-5 text-center">
        <Translate code="no_damage" />
      </Col>
    );
  return res;
};

const iterateData = (v, gallery) => {
  let item = null;
  item = subDamages(v, gallery);
  return item;
};

const subDamages = (items, gallery) => {
  let damagesImage = [];

  items.forEach((i, key) => {
    if (
      i.zone === "wheels" &&
      ["replace", "smart_rep"].includes(i.reconditionning)
    ) {
      i.damage_picture = showWheelsImg(i.element, gallery);
    }
    if (i.damage_picture) damagesImage.push(i.damage_picture);
    if (i.damage_picture2) damagesImage.push(i.damage_picture2);
  });
  return items.map((i, key) => {
    if (i.element !== "motor_longeron")
      return <Damage i={i} key={key} index={key} damagesImage={damagesImage} />;
  });
};

const Damage = ({ i, index, damagesImage }) => {
  const [popedUp, setPopup] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(null);

  const togglePopup = (photo) => {
    let currentKey;
    damagesImage.forEach((i, key) => {
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
          "custom-damage mt-3") ||
        "damage-list mt-3"
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
            mainSrc={
              (photoIndex && damagesImage[photoIndex]) || damagesImage[0]
            }
            nextSrc={damagesImage[(photoIndex + 1) % damagesImage.length]}
            prevSrc={
              damagesImage[
                (photoIndex + damagesImage.length - 1) % damagesImage.length
              ]
            }
            onCloseRequest={togglePopup}
            onMovePrevRequest={() =>
              setPhotoIndex(
                (photoIndex + damagesImage.length - 1) % damagesImage.length
              )
            }
            onMoveNextRequest={() =>
              setPhotoIndex((photoIndex + 1) % damagesImage.length)
            }
          />
        )}
        {i.damage_picture && (
          <span onClick={() => togglePopup(i.damage_picture)}>
            <img src={i.damage_picture} className="damage-img" alt="" />
          </span>
        )}
        {i.damage_picture2 && (
          <span onClick={() => togglePopup(i.damage_picture2)}>
            <img src={i.damage_picture2} className="damage-img" alt="" />
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
    "crash",
  ];

  return (
    <div className="list-zone">
      <div className="item">
        {listZone.map((i) => (
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
