import React, { useState, useEffect } from "react";
import Translate, { t } from "../common/Translate";
import { API } from "aws-amplify";
import {
  Container,
  Row,
  Col,
  Alert,
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faMapMarkerAlt,
  faSpinner,
  faSearch,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import iconPdf from "../../assets/img/ico-pdf.png";
import BrandsCarousel from "../common/BrandsCarousel";
import RecordsElement from "../RecordsList/RecordsElement";
import Section from "../RecordsList/Section";
import FilterSearch from "../RecordsList/FilterSearch";
import FilterBrands from "../RecordsList/FilterBrands";
import FilterModels from "../RecordsList/FilterModels";
import FilterYears from "../RecordsList/FilterYears";
import FilterKilometers from "../RecordsList/FilterKilometers";
import FormActions from "../RecordsList/FormActions";
import FilterCheckboxes from "../RecordsList/FilterCheckboxes";
import { staticImagesUrl } from "../../config"

const Dealer = props => {
  const [dealer, setDealer] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [infoClosed, setInfoClosed] = useState(true);
  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");
  const [records, setRecords] = useState();
  const [RecordsCount, setRecordsCount] = useState();
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);
  const [modelLabels, setModelLabels] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const ItemsPerPage = 100;
  const offers = ["offerToPrivate", "stock"];

  useEffect(() => {
    const fetchDealer = async () => {
      try {
        const result = await API.get("b2bPlateform", `/pointOfSale`, {
          queryStringParameters: {
            uuid: props.refId
          },
          response: true
        });

        setDealer(result.data);
        setLoading(false);
      } catch (error) {
        setNotFound(true);
      }
    };
    fetchDealer();
  }, []);

  const readMore = () => {
    setInfoClosed(false);
  };

  const readLess = () => {
    setInfoClosed(true);
  };

  const openModal = (title, body) => {
    setModal(true);
    setModalTitle(title);
    setModalBody(body);
  };

  const closeModal = () => {
    setModal(false);
  };

  const initialFormState = {
    pointOfSale: "",
    search: "",
    list: "all",
    brandLabel: "",
    modelLabel: "",
    yearMecMin: "",
    yearMecMax: "",
    mileageMin: "",
    mileageMax: "",
    offerType: ["all"],
    range: [0, ItemsPerPage - 1]
  };

  const [form, setValues] = useState({
    pointOfSale: initialFormState.pointOfSale,
    search: initialFormState.search,
    list: initialFormState.list,
    brandLabel: initialFormState.brandLabel,
    modelLabel: initialFormState.modelLabel,
    yearMecMin: initialFormState.yearMecMin,
    yearMecMax: initialFormState.yearMecMax,
    mileageMin: initialFormState.mileageMin,
    mileageMax: initialFormState.mileageMax,
    offerType: initialFormState.offerType,
    range: initialFormState.range
  });

  const [query, setQuery] = useState(form);

  const [filters, setFilters] = useState([]);

  const updateField = e => {
    const { name, value } = e.target;
    const tmpForm = {
      ...form,
      [name]: value
    };
    setValues(tmpForm);
  };

  const updateSearch = () => {
    setQuery(form);
  };

  const handleReset = () => {
    setValues(initialFormState);
    setQuery(initialFormState);
  };

  const updateCheckBox = (e, target) => {
    const { value, checked } = e.target;
    let tmpTarget = form[target];

    if (value === "all") {
      if (checked) {
        tmpTarget = ["all"];
      } else {
        tmpTarget = [];
      }
    } else {
      tmpTarget = tmpTarget.filter(function(item) {
        return item !== "all";
      });

      if (tmpTarget.includes(value)) {
        tmpTarget = tmpTarget.filter(function(item) {
          return item !== value;
        });
      } else {
        tmpTarget = [...tmpTarget, value];
      }
    }

    const tmpForm = {
      ...form,
      [target]: tmpTarget
    };

    setValues(tmpForm);
    setQuery(tmpForm);
  };

  useEffect(() => {
    form.modelLabel = "";
    setQuery(form);
    if (filters.models) {
      setModelLabels(filters.models[form.brandLabel]);
    } else {
      setModelLabels([]);
    }
  }, [form.brandLabel]);

  useEffect(() => {
    setQuery(form);
  }, [form.modelLabel]);

  useEffect(() => {
    if (dealer !== false) {
      const fetchRecords = async () => {
        const result = await API.get("b2bPlateform", `/filter`, {
          queryStringParameters: {
            pointOfSale: dealer.id
          },
          response: true
        });
        setFilters(result.data);
      };

      fetchRecords();
    }
  }, [dealer]);

  useEffect(() => {
    if (dealer !== false) {
      const fetchRecords = async () => {
        setIsFetching(true);
        const result = await API.get("b2bPlateform", `/vehicle`, {
          queryStringParameters: {
            pointOfSale: dealer.id,
            search: form.search,
            list: form.list,
            brandLabel: form.brandLabel,
            modelLabel: form.modelLabel,
            yearMecMin: form.yearMecMin,
            yearMecMax: form.yearMecMax,
            mileageMin: form.mileageMin,
            mileageMax: form.mileageMax,
            offerType: JSON.stringify(form.offerType),
            range: JSON.stringify(form.range)
          },
          response: true
        });

        const contentRange = result.headers["content-range"];
        if (result.data && result.data.length > 0) {
          const contentRangeArray = contentRange.split("/");
          setRecordsCount(contentRangeArray[1]);
          setRecords(result.data);
        } else {
          setRecordsCount(0);
          setRecords([]);
        }
        setIsFetching(false);
      };

      fetchRecords();
    }
  }, [dealer, query]);

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

  return (
    <>
      <Modal isOpen={modal} toggle={closeModal}>
        <ModalHeader toggle={closeModal}>{modalTitle}</ModalHeader>
        <ModalBody>{modalBody}</ModalBody>
      </Modal>

      <Container>
        <Row>
          <Col xs="12" md="6">
            <div className="section radius">
              <div className="h1 mb-3">{dealer.name}</div>
              <div className="section-price text-left">
                <p className="gray h6 my-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                  {dealer.zipCode} {dealer.city}
                </p>
              </div>
              <p className="text-primary my-3 font-italic small">
                {t("online_offers:")} {dealer.count_vehicles}
              </p>
            </div>

            {dealer.documentation && (
              <table className="documentation my-4">
                <thead>
                  <tr>
                    <th colSpan="3">{t("documentation")}</th>
                  </tr>
                </thead>
                <tbody>
                  {dealer.documentation.map((document, index) => (
                    <tr key={index}>
                      <td>{t(document.title)}</td>
                      <td className="icon">
                        {document.text && (
                          <FontAwesomeIcon
                            icon={faSearch}
                            onClick={() =>
                              openModal(document.title, document.text)
                            }
                          />
                        )}
                      </td>
                      <td className="icon">
                        {document.pdf && (
                          <a href={document.pdf} target="_blank">
                            <img src={iconPdf} alt="pdf" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Col>
          <Col xs="12" md="6">
            <div className="section radius">
              <img
                src={dealer.picture ? dealer.picture : `${staticImagesUrl}/pointOfSales/default-front-dealer-picture.png`}
                alt={dealer.name}
                className="overflowed-image"
              />
              <BrandsCarousel brands={dealer.brands} />
            </div>
          </Col>
        </Row>
        {dealer.info && (
          <Row>
            <Col lg={{ size: 10, offset: 1 }}>
              <div className="section radius my-4 p-4">
                <div className="h5">Infos</div>
                <p
                  className={
                    infoClosed ? "info-two-lines closed" : "info-two-lines open"
                  }
                >
                  <span className="readmore" onClick={readMore}>
                    {t("read more")}
                  </span>
                  {dealer.info}
                  <span className="readless" onClick={readLess}>
                    {t("read less")}
                  </span>
                </p>
              </div>
            </Col>
          </Row>
        )}
      </Container>
      <div className="dealer-sticky-title">
        <Container>
          {t("vehicles_of")}
          <strong>{dealer.name}</strong>
        </Container>
      </div>
      <Container className="pb-5">
        <Row>
          <div className="search-record-nav">
            <Section>
              <Row>
                <Col className="col col-6" sm="8" md="12">
                  <FilterSearch
                    value={form.search}
                    updateField={updateField}
                    updateSearch={updateSearch}
                  />
                </Col>

                <Col className="col d-md-none">
                  <button
                    type="button"
                    className="btn btn-block btn-danger-reverse rounded"
                    onClick={() =>
                      setMenuMobileOpen(menuMobileOpen ? false : true)
                    }
                  >
                    {t("filter")} <FontAwesomeIcon icon={faFilter} />
                  </button>
                </Col>
              </Row>
            </Section>

            <div
              className={`${
                menuMobileOpen === false ? "d-none" : ""
              } d-md-block`}
            >
              <Section>
                <p className="section-title">
                  <Translate code="brand_and_model" />
                </p>

                {filters.brands && (
                  <FilterBrands
                    brands={filters.brands}
                    value={form.brandLabel}
                    updateField={updateField}
                  />
                )}

                {modelLabels && (
                  <FilterModels
                    models={modelLabels}
                    value={form.modelLabel}
                    updateField={updateField}
                  />
                )}
                <p className="section-title">
                  <Translate code="year_mec" />
                </p>
                <FilterYears
                  yearMecMin={form.yearMecMin}
                  yearMecMax={form.yearMecMax}
                  updateField={updateField}
                  updateSearch={updateSearch}
                />

                <p className="section-title">
                  <Translate code="km" />
                </p>
                <FilterKilometers
                  mileageMin={form.mileageMin}
                  mileageMax={form.mileageMax}
                  updateField={updateField}
                  updateSearch={updateSearch}
                />

                <p className="section-title">
                  <Translate code="offer_type" />
                </p>
                <FilterCheckboxes
                  data={offers}
                  target="offerType"
                  values={form.offerType}
                  updateField={updateCheckBox}
                  all
                />
              </Section>
            </div>
            <Section>
              <FormActions reset={handleReset} />
            </Section>
          </div>
          <Col>
            {RecordsCount === 0 && (
              <Alert color="secondary" className="text-center">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="mr-2"
                />
                <Translate code="no_result" />
              </Alert>
            )}

            {isFetching === false && RecordsCount > 0 && (
              <Row className="car-list">
                <Col xs="12" sm="6" lg="8">
                  <div className="h5 mb-3">
                    <b>{RecordsCount}</b> {t("vehicles")}
                  </div>
                </Col>

                {records &&
                  records.map((record, index) => (
                    <RecordsElement key={index} record={record} />
                  ))}
              </Row>
            )}
            {isFetching && (
              <Row>
                <Col className="text-center">
                  <FontAwesomeIcon icon={faSpinner} size="3x" spin />
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dealer;
