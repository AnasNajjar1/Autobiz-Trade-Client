import React, { useState, useEffect } from "react";
import { t } from "../common/Translate";

import { Row, Col } from "reactstrap";
import _ from "lodash";
import logo from "../../assets/img/autobiz-trade.svg";
import { showableValue, renderValue, renderLabel } from "../Records/TableList";
import EquipmentList from "../Records/EquipmentList.js";
import UlList from "../Records/UlList.js";
import Grade from "../Records/Grade.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faScrewdriver,
  faClipboard,
  faClipboardList,
  faCar,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { BodySvg } from "./BodySvg";
import { InnerSvg } from "./InnerSvg";
import { WheelsSvg } from "./WheelsSvg";
import { Api } from "../../providers/Api";

const Report = (props) => {
  const [record, setRecord] = useState([]);

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
    return () => (mounted = false);
  }, []);

  let wheelsDamages = {};
  let bodyDamages = {};
  let bodyDamagesGallery = {};
  let innerDamages = {};

  if (record && record.uuid) {
    const { vehicle } = record || {};

    if (vehicle.damages) {
      vehicle.damages
        .filter((e) => e.zone === "wheels")
        .forEach((o) => {
          wheelsDamages[o.element] = o.damage;
        });

      vehicle.damages
        .filter((e) => e.zone === "body")
        .forEach((o) => {
          bodyDamages[o.element] = o.damage;
          bodyDamagesGallery[o.element] = {
            image: o.damage_picture,
            damage: o.damage,
            element: o.element,
          };
        });

      vehicle.damages
        .filter((e) => e.zone === "inner")
        .forEach((o) => {
          innerDamages[o.element] = o.damage;
        });
    }

    const { rankedConstructorEquipments } = vehicle || {};
    const {
      veryImportantDatEquipment,
      importantDatEquipment,
      fewImportantDatEquipment,
    } = rankedConstructorEquipments || [];

    return (
      <>
        <div className="report-pdf">
          <div className="page-header">
            <table>
              <tr>
                <td>
                  <img alt="autobizTrade" className="logo" src={logo} />
                </td>
                <td className="text-center" width="100%">
                  <h1>
                    {vehicle.brandLabel} {vehicle.modelLabel}{" "}
                    {vehicle.versionLabel} *
                  </h1>
                </td>
                <td>
                  <div className="header-info text-nowrap text-right">
                    {t("folder")} :{" "}
                    <span className="font-weight-bold">
                      {vehicle.fileNumber}{" "}
                    </span>
                    <br />
                    {t("registration")} :{" "}
                    <span className="font-weight-bold">
                      {vehicle.registration}
                    </span>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <div className="page-footer">
            <p className="font-style-italic">{t("version_warning_message")}</p>
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
                        {vehicle.gallery && (
                          <GalleryTable pictures={vehicle.gallery} />
                        )}
                      </table>
                    </section>
                    <section>
                      <div className="px-5">
                        <Row>
                          <Col>
                            {vehicle.characteristics && (
                              <Table items={vehicle.characteristics}></Table>
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
                              <img
                                src={vehicle.vinPicture}
                                className="vin-picture"
                              />
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
                        <Row>
                          <Col></Col>
                          <Col>
                            <div className="h3 text-center">
                              {t("global_condition")}
                            </div>
                            <Grade letter={vehicle.profileBodyCosts} />
                          </Col>
                        </Row>
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
                        {vehicle.servicing && (
                          <Table items={vehicle.servicing}></Table>
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
                        <FontAwesomeIcon icon={faCar} />
                        {t("WheelCharacteristics")}
                      </h2>
                      <div className="px-5">
                        <Row>
                          <Col>
                            <div className="section-title">{t("front")}</div>
                            {vehicle.wheelsFront && (
                              <Table items={vehicle.wheelsFront}></Table>
                            )}
                          </Col>
                          <Col>
                            <div className="section-title">{t("back")}</div>
                            {vehicle.wheelsBack && (
                              <Table items={vehicle.wheelsBack}></Table>
                            )}
                          </Col>
                        </Row>
                      </div>
                    </section>
                    <section>
                      <h2 className="icon-title">
                        <FontAwesomeIcon icon={faEye} />
                        {t("generalCosts")}
                      </h2>
                      <div className="px-5">
                        <Row>
                          <Col>
                            {vehicle.generalCosts && (
                              <Table items={vehicle.generalCosts}></Table>
                            )}
                          </Col>
                        </Row>
                      </div>
                    </section>
                    <section>
                      <h2 className="icon-title">
                        <FontAwesomeIcon icon={faEye} />
                        {t("wheels")}
                      </h2>
                      <div className="px-5">
                        <Row>
                          <Col>
                            <WheelsSvg damage={wheelsDamages} />
                          </Col>
                          <Col>
                            {wheelsDamages && (
                              <Table items={wheelsDamages}></Table>
                            )}

                            {Object.keys(wheelsDamages).length === 0 &&
                              t("no_damages")}
                          </Col>
                        </Row>
                      </div>
                    </section>
                    <section>
                      <h2 className="icon-title">
                        <FontAwesomeIcon icon={faEye} />
                        {t("body")}
                      </h2>
                      <div className="px-5">
                        <Row>
                          <Col>
                            <BodySvg damage={bodyDamages} />
                          </Col>
                          <Col>
                            {bodyDamages && <Table items={bodyDamages}></Table>}

                            {Object.keys(bodyDamages).length === 0 &&
                              t("no_damages")}
                          </Col>
                        </Row>
                        {bodyDamagesGallery && (
                          <Row>
                            <Col>
                              <h5 className="mt-5 text-center bg-greyLight p-2">
                                {t("BodyDamages")}
                              </h5>
                              <table className="gallery">
                                <GalleryTableLabel
                                  pictures={bodyDamagesGallery}
                                />
                              </table>
                            </Col>
                          </Row>
                        )}
                      </div>
                    </section>
                    <section>
                      <h2 className="icon-title">
                        <FontAwesomeIcon icon={faEye} />
                        {t("inner")}
                      </h2>
                      <div className="px-5">
                        <Row>
                          <Col>
                            <InnerSvg dammage={innerDamages} />
                          </Col>
                          <Col>
                            {innerDamages && (
                              <Table items={innerDamages}></Table>
                            )}

                            {Object.keys(innerDamages).length === 0 &&
                              t("no_damages")}
                          </Col>
                        </Row>
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
      {Object.keys(items).map(
        (key) =>
          showableValue(key, items[key], "fr") && (
            <tr key={key}>
              <td>
                <div className="label">{renderLabel(key)}</div>
              </td>
              <td className="value " key={key}>
                <div>{renderValue(key, items[key], "fr")}</div>
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
            <img src={cell} />
          </div>
        </td>
      ));
      return <tr>{cell}</tr>;
    })
  );
};

const GalleryTableLabel = ({ pictures }) => {
  const chunkPictures = chunk(Object.values(pictures), 4);

  let cell = "";
  return (
    chunkPictures &&
    chunkPictures.map((row) => {
      cell = row.map((cell) => (
        <td>
          <div>
            <img src={cell.image} />
          </div>
          <div className="py-2">
            <div className="text-center font-weight-bold">
              {t(cell.element)}
            </div>
            <div className="text-center">{t(cell.damage)}</div>
          </div>
        </td>
      ));
      return <tr>{cell}</tr>;
    })
  );
};

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

export default Report;
