import React, { useState, useEffect } from "react";
import { t } from "../common/Translate";
import { Row, Col } from "reactstrap";
import _ from "lodash";
import { showableValue, renderValue, renderLabel } from "../Records/TableList";
import EquipmentList from "../Records/EquipmentList.js";
import UlList from "../Records/UlList.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faScrewdriver,
  faClipboard,
  faClipboardList,
  faCar,
  faEye,
  faWrench,
  faRoad,
  faPrint,
  faCog,
  faDharmachakra,
} from "@fortawesome/free-solid-svg-icons";
import { BodySvg } from "./BodySvg";
import { Api } from "../../providers/Api";
import {
  customReportGallery,
  customReportGalleryDamages,
  customReportOrder,
  checkGalleryIsEmpty,
} from "../../helper/Report";

const Report = (props) => {
  const [record, setRecord] = useState([]);
  const [downloadPdf, setDownloadPdf] = useState(true);
  const [headerPosition, setHeaderPosition] = useState("1.6rem");

  const fetchRecord = async () => {
    try {
      return await Api.request("GET", `/sale/${props.refId}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let mounted = true;
    fetchRecord().then((result) => {
      if (mounted) {
        setRecord(result.data);
      }
    });
    window.addEventListener("scroll", handleScroll);
    return () => {
      mounted = false;
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    window.scrollY > 50 ? setHeaderPosition("0") : setHeaderPosition("2rem");
  };

  if (record && record.uuid) {
    const { vehicle } = record || {};
    const {
      wheelsDamages,
      bodyDamages,
      innerDamages,
      roadTestDamages,
      motorDamages,
      bodyDamagesGallery,
      innerDamagesGallery,
      motorDamagesGallery,
      accidentDamage,
      generalCosts,
      wheelsDamagesGallery,
      roadTestDamagesGallery,
    } = customReportGalleryDamages(vehicle.damages);
    const { gallery, vinPicture, motorPicture } = customReportGallery(
      vehicle.gallery
    );
    const {
      orderedwheelsFront,
      orderedwheelsBack,
      ordredcharacteristics,
      orderedSirvicing,
      orderedGeneralCostsOne,
      orderedGeneralCostsTwo,
      orderedInspection,
    } = customReportOrder(vehicle, accidentDamage, generalCosts);
    const { rankedConstructorEquipments } = vehicle || {};
    const {
      veryImportantDatEquipment,
      importantDatEquipment,
      fewImportantDatEquipment,
    } = rankedConstructorEquipments || [];
    const generatePdf = () => {
      setDownloadPdf(false);
      window.print();
      setDownloadPdf(true);
    };
    return (
      <>
        <div className="report-pdf">
          <div className="page-header" style={{ top: headerPosition }}>
            <table>
              <tr>
                <td>
                  <img
                    alt="autobizTrade"
                    className="logo"
                    src={""}
                    style={{ opacity: 0 }}
                  />
                </td>
                <td className="text-center" width="100%">
                  <h1 className="mt-md-5">
                    {vehicle.brandLabel} {vehicle.modelLabel}{" "}
                    {vehicle.versionLabel} *
                  </h1>
                </td>
                <td>
                  <div className=" text-nowrap text-right mt-md-5 mr-md-2">
                    {t("folder")} :{" "}
                    <span className="font-weight-bold">
                      {vehicle.fileNumber}{" "}
                    </span>
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <div className="page-footer">
            <p className="font-style-italic xs-pb-5 s-pb-5 l-pb-5">
              {t("version_warning_message")}
            </p>
            {downloadPdf && (
              <div className="download-report">
                <button onClick={generatePdf}>
                  <FontAwesomeIcon icon={faPrint} />
                </button>
              </div>
            )}
          </div>
          <table className="page-body">
            <thead>
              <tr>
                <td>
                  <div className="page-header-space"></div>
                </td>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  <div className="page">
                    <section>
                      <table className="gallery">
                        {gallery && <GalleryTable pictures={gallery} />}
                      </table>
                    </section>
                    <section>
                      <div className="px-5">
                        <Row>
                          <Col>
                            {ordredcharacteristics && (
                              <Table items={ordredcharacteristics}></Table>
                            )}
                          </Col>
                          <Col>
                            <div className="vin">
                              {t("vin")}{" "}
                              <span className="bold">
                                {vehicle.vin && ` : ${vehicle.vin}`}
                              </span>
                            </div>
                            <div className="bg-greyLight text-center">
                              {vinPicture && (
                                <img
                                  alt=""
                                  src={vinPicture.value}
                                  className="vin-picture"
                                />
                              )}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </section>
                    <section>
                      <h2 className="icon-title">
                        <FontAwesomeIcon icon={faClipboard} />
                        {t("inspection_infos")}
                      </h2>
                      <div className="px-5">
                        {orderedInspection && (
                          <Table items={orderedInspection}></Table>
                        )}
                      </div>
                    </section>
                  </div>
                  <div className="page">
                    <section>
                      <h2 className="icon-title">
                        <FontAwesomeIcon icon={faScrewdriver} />
                        {t("servicing")}
                      </h2>
                      <div className="px-5">
                        {orderedSirvicing && (
                          <Table items={orderedSirvicing}></Table>
                        )}
                      </div>
                    </section>
                    <section>
                      <h2 className="icon-title">
                        <FontAwesomeIcon icon={faClipboard} />
                        {t("declared_equiments")}
                      </h2>
                      <div className="px-5">
                        <Row>
                          <Col>
                            {vehicle.declaredEquipments &&
                              vehicle.declaredEquipments.length > 0 && (
                                <EquipmentList
                                  items={vehicle.declaredEquipments}
                                />
                              )}
                          </Col>
                        </Row>
                      </div>
                    </section>
                    {vehicle.rankedConstructorEquipments && (
                      <>
                        <section>
                          <h2 className="icon-title">
                            <FontAwesomeIcon icon={faClipboardList} />
                            {t("equiments")} <i>{t("constructor_source")}</i>
                          </h2>
                          <div className="px-5">
                            <Row>
                              <Col>
                                {veryImportantDatEquipment && (
                                  <UlList items={veryImportantDatEquipment} />
                                )}
                              </Col>
                              <Col>
                                {importantDatEquipment && (
                                  <UlList items={importantDatEquipment} />
                                )}
                              </Col>
                              <Col>
                                {fewImportantDatEquipment && (
                                  <UlList items={fewImportantDatEquipment} />
                                )}
                              </Col>
                            </Row>
                          </div>
                        </section>
                      </>
                    )}
                    <section>
                      <h2 className="icon-title">
                        <FontAwesomeIcon icon={faDharmachakra} />
                        {t("WheelCharacteristics")}
                      </h2>
                      <div className="px-5">
                        <Row>
                          <Col>
                            <div className="section-title">{t("front")}</div>
                            {orderedwheelsFront && (
                              <Table items={orderedwheelsFront}></Table>
                            )}
                          </Col>
                          <Col>
                            <div className="section-title">{t("back")}</div>
                            {orderedwheelsBack && (
                              <Table items={orderedwheelsBack}></Table>
                            )}
                          </Col>
                        </Row>
                      </div>
                    </section>
                    <section>
                      <h2 className="icon-title">
                        <FontAwesomeIcon icon={faWrench} />
                        {t("generalCosts")}
                      </h2>
                      <div className="px-5">
                        <Row>
                          <Col>
                            {orderedGeneralCostsOne && (
                              <Table items={orderedGeneralCostsOne}></Table>
                            )}
                          </Col>
                          <Col>
                            {orderedGeneralCostsTwo && (
                              <Table items={orderedGeneralCostsTwo}></Table>
                            )}
                          </Col>
                        </Row>
                      </div>
                    </section>
                    <section>
                      <h2 className="icon-title">
                        <FontAwesomeIcon icon={faEye} />
                        {t("frevoWheels")}
                      </h2>
                      <div className="px-5">
                        <Row>
                          <Col>
                            {" "}
                            {wheelsDamages && (
                              <Table items={wheelsDamages}></Table>
                            )}
                            {Object.keys(wheelsDamages).length === 0 &&
                              t("no_damages")}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            {!checkGalleryIsEmpty(wheelsDamagesGallery) && (
                              <>
                                <h5 className="mt-5 text-center bg-greyLight p-2">
                                  {t("wheelsDamages gallery")}
                                </h5>

                                <table className="gallery">
                                  <GalleryTableLabel
                                    pictures={wheelsDamagesGallery}
                                  />
                                </table>
                              </>
                            )}
                          </Col>
                        </Row>
                      </div>
                    </section>
                    <section>
                      <h2 className="icon-title">
                        <FontAwesomeIcon icon={faCar} />
                        {t("frevoBody")}
                      </h2>
                      <div className="px-5">
                        <Row>
                          {bodyDamages && <Table items={bodyDamages}></Table>}

                          {Object.keys(bodyDamages).length === 0 &&
                            t("no_damages")}
                        </Row>
                        <Row>
                          {!checkGalleryIsEmpty(bodyDamagesGallery) && (
                            <Col>
                              <h5 className="mt-5 text-center bg-greyLight p-2">
                                {t("bodyDamages")}
                              </h5>

                              <table className="galleryLabel">
                                <GalleryTableLabel
                                  pictures={bodyDamagesGallery}
                                />
                              </table>
                            </Col>
                          )}
                        </Row>
                      </div>
                    </section>
                    <section>
                      <h2 className="icon-title">
                        <FontAwesomeIcon icon={faEye} />
                        {t("frevoInner")}
                      </h2>
                      <div className="px-5">
                        <Row>
                          {innerDamages && <Table items={innerDamages}></Table>}

                          {Object.keys(innerDamages).length === 0 &&
                            t("no_damages")}
                        </Row>
                        {!checkGalleryIsEmpty(innerDamagesGallery) && (
                          <Row>
                            <Col>
                              <h5 className="mt-5 text-center bg-greyLight p-2">
                                {t("damagesInner")}
                              </h5>
                              <table className="gallery">
                                <GalleryTableLabel
                                  pictures={innerDamagesGallery}
                                />
                              </table>
                            </Col>
                          </Row>
                        )}
                      </div>
                    </section>
                    <section>
                      <h2 className="icon-title">
                        <FontAwesomeIcon icon={faRoad} />
                        {t("road_test")}
                      </h2>

                      <div className="px-5">
                        <Row>
                          <Col>
                            {roadTestDamages && (
                              <Table items={roadTestDamages}></Table>
                            )}
                          </Col>
                        </Row>

                        {!checkGalleryIsEmpty(roadTestDamagesGallery) && (
                          <Row>
                            <Col>
                              <h5 className="mt-5 text-center bg-greyLight p-2">
                                {t("damagesRoadTest")}
                              </h5>
                              <table className="gallery">
                                <GalleryTableLabel
                                  pictures={roadTestDamagesGallery}
                                />
                              </table>
                            </Col>
                          </Row>
                        )}
                      </div>
                    </section>
                    <section>
                      <h2 className="icon-title">
                        <FontAwesomeIcon icon={faCog} />
                        {t("motor")}
                      </h2>
                      <div className="px-5">
                        <Row>
                          <Col>
                            {" "}
                            {motorDamages && (
                              <Table items={motorDamages}></Table>
                            )}{" "}
                          </Col>
                        </Row>
                        {motorPicture && (
                          <>
                            <Row>
                              <Col>
                                <div> {t("motorPicture")} </div>{" "}
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <div>
                                  {motorPicture && (
                                    <img
                                      alt=""
                                      src={motorPicture.value}
                                      className="motor-picture"
                                    />
                                  )}
                                </div>
                              </Col>

                              <Col></Col>
                            </Row>
                          </>
                        )}
                      </div>
                    </section>
                  </div>
                </td>
              </tr>
            </tbody>

            <tfoot>
              <tr>
                <td>
                  <div className="page-footer-space"></div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </>
    );
  } else {
    return <>loading</>;
  }
};

const Table = ({ items }) => {
  return (
    <table className="table">
      {_.map(
        items,
        (item) =>
          showableValue(item.element, item.value, "fr") && (
            <tr key={item.element}>
              <td className="label">
                <div>{renderLabel(item.element)}</div>
              </td>

              <td className="value  container w-75" key={item.element}>
                <div
                  style={{
                    color: item.isCustom === true ? "red" : "",
                    fontStyle: item.isCustom === true ? "italic" : "",
                  }}
                >
                  {renderValue(item.element, item.value, "fr")}
                </div>
              </td>
            </tr>
          )
      )}
    </table>
  );
};

const GalleryTable = ({ pictures }) => {
  const chunkPictures = chunk(Object.values(pictures), 3);
  let cell = "";
  return (
    chunkPictures &&
    chunkPictures.map((row) => {
      cell = row.map((cell) => (
        <td>
          <div>
            <img src={cell.value} />
          </div>
        </td>
      ));
      return <tr>{cell}</tr>;
    })
  );
};

const GalleryTableLabel = ({ pictures }) => {
  const chunkPictures = chunk(Object.values(pictures), 6);

  let cell = "";
  return (
    chunkPictures &&
    chunkPictures.map((row) => {
      cell = row.map(
        (cell) =>
          cell.image && (
            <td>
              <div>
                <img src={cell.image} height="200px" width="200px" />
              </div>
              {
                <div className="py-2 text-center">
                  <b>{t(cell.element)}</b>

                  <div> {t(cell.damage)}</div>
                </div>
              }
            </td>
          )
      );
      return <tr>{cell}</tr>;
    })
  );
};

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

export default Report;
