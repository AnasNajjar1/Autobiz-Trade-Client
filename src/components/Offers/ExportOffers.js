import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import {
  Row,
  Col,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  Label,
} from "reactstrap";
import moment from "moment";
import { API } from "aws-amplify";
import { t } from "../common/Translate";
import "react-datepicker/dist/react-datepicker.css";
import * as Locale from "date-fns/locale";
import { getCurrentLanguage } from "../../language-context";

const ExportOffers = ({ setAllowExport, setOffers, userId }) => {
  let [startDate, setStartDate] = useState(null);
  let [endDate, setEndDate] = useState(null);
  const [modalDownloadOffers, setModalDownloadOffers] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const language = () => {
    const appLanguage = getCurrentLanguage()
    return Locale[appLanguage] ? Locale[appLanguage] : Locale["enGB"];
  };

  const toggleModalDownloadOffers = () =>
    setModalDownloadOffers(!modalDownloadOffers);

  const fetchOffers = async () => {
    endDate = endDate ? moment(endDate).format("YYYY-MM-DD") : null;
    startDate = startDate ? moment(startDate).format("YYYY-MM-DD") : null;
    if (endDate && !startDate) {
      startDate = moment(endDate).subtract(90, "days").format("YYYY-MM-DD");
    }
    if (startDate && !endDate) {
      endDate = moment(startDate).add(90, "days").format("YYYY-MM-DD");
    }
    startDate = startDate + " 00:00:00";
    endDate = endDate + " 23:59:59";
    const result = await API.get("b2bPlateform", `/offer`, {
      queryStringParameters: {
        filter: JSON.stringify({
          createdAtInterval: [startDate, endDate],
          userId,
        }),
        range: JSON.stringify([]),
        sort: JSON.stringify(["id", "desc"]),
      },
      response: true,
    });
    setOffers(result.data);
    setAllowExport(true);
  };

  const confirmDownloadOffers = () => {
    let isValidInterval = true;
    if (!startDate && !endDate) {
      setErrorMsg("noDateSelected");
      isValidInterval = false;
    }

    if (startDate && endDate) {
      if (startDate > endDate) {
        setErrorMsg("dateMinSupDateMax");
        isValidInterval = false;
      }
      if (
        moment.duration(moment(endDate).diff(moment(startDate))).asDays() > 90
      ) {
        setErrorMsg("dateSup90Days");
        isValidInterval = false;
      }
    }
    if (isValidInterval) {
      fetchOffers();
      setModalDownloadOffers(false);
      setErrorMsg(null);
    }
  };

  return (
    <>
      <Button
        outline
        color="secondary"
        size="sm"
        className="download-offer"
        onClick={toggleModalDownloadOffers}
      >
        <FontAwesomeIcon icon={faDownload} className="mr-2" />
        {t("downloadOffers")}
      </Button>
      <Modal
        className="d-none d-lg-block"
        isOpen={modalDownloadOffers}
        toggle={toggleModalDownloadOffers}
      >
        <ModalBody>
          <Row>
            <Col md={1} />
            <Col md={4}>
              <Label>
                <small>
                  <b>{t("dateMin")}</b>
                </small>
              </Label>
              <br />
              <DatePicker
                locale={language()}
                selected={startDate}
                onChange={(startDate) => {
                  setStartDate(startDate);
                  setErrorMsg(null);
                }}
                dateFormat="dd/MM/yyyy"
                className="date-picker-modal"
              />
            </Col>
            <Col md={2} />
            <Col md={4}>
              <Label>
                <small>
                  <b>{t("dateMax")}</b>
                </small>
              </Label>
              <DatePicker
                locale={language()}
                selected={endDate}
                onChange={(endDate) => {
                  setEndDate(endDate);
                  setErrorMsg(null);
                }}
                dateFormat="dd/MM/yyyy"
                className="date-picker-modal"
              />
            </Col>
            <Col md={1} />
          </Row>
          <Row>
            <Col md={1} />
            <Col md={11}>
              {errorMsg && (
                <span className="error-download-offer text-danger d-none d-sm-inline">
                  {t(errorMsg)}
                </span>
              )}
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Row>
            <Col md={6}>
              <Button
                color="secondary"
                className="rounded"
                onClick={toggleModalDownloadOffers}
              >
                {t("cancel")}
              </Button>
            </Col>
            <Col md={6}>
              <Button
                color="success"
                className="rounded"
                onClick={() => confirmDownloadOffers()}
              >
                {t("downloadCta")}
              </Button>
            </Col>
          </Row>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ExportOffers;
