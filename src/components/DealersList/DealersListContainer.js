import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Container, Row, Col, Alert, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faSpinner,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import Translate, { t } from "../common/Translate";
import { API } from "aws-amplify";
import {
  useQueryParams,
  NumberParam,
  StringParam,
  DelimitedArrayParam,
  ArrayParam,
} from "use-query-params";
import DealersElement from "./DealersElement";
import MenuSwitcher from "../common/MenuSwitcher";
import Section from "../RecordsList/Section";
import FormActions from "../RecordsList/FormActions";
import FilterSearch from "../RecordsList/FilterSearch";
import FilterBrands from "../RecordsList/FilterBrands";
import FilterModels from "../RecordsList/FilterModels";
import FilterGeoloc from "../RecordsList/FilterGeoloc";

const DealersListContainer = () => {
  const ItemsPerPage = 6;
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);
  const [modelLabels, setModelLabels] = useState([]);

  let history = useHistory();

  const updateField = (e) => {
    const { name, value } = e.target;
    const tmpForm = {
      ...form,
      [name]: value,
    };
    setValues(tmpForm);
  };

  const updateSearch = () => {
    setQuery(form);
  };

  const updatePosition = (position) => {
    const tmpForm = {
      ...form,
      lat: position.lat,
      lng: position.lng,
    };
    setValues(tmpForm);
  };

  const showCustomList = (listName) => {
    if (listName === "vehicles_from_my_dealers") {
      return history.push("/records?list=my_dealers");
    }

    form.list = listName;
    setQuery(form);
  };

  const handleReset = () => {
    setValues(initialFormState);
    setQuery(initialFormState);
  };

  useEffect(() => {
    const fetchRecords = async () => {
      const result = await API.get("b2bPlateform", `/filter`, {
        response: true,
      });
      setFilters(result.data);
    };

    fetchRecords();
  }, []);

  const initialFormState = {
    search: "",
    list: "all",
    onlineOffersMinCount: 0,
    brandLabel: "",
    modelLabel: "",
    country: "all",
    zipCode: "",
    radius: 300,
    lat: "",
    lng: "",
    range: [0, ItemsPerPage - 1],
  };

  const [query, setQuery] = useQueryParams({
    search: StringParam,
    list: StringParam,
    onlineOffersMinCount: NumberParam,
    brandLabel: StringParam,
    modelLabel: StringParam,
    country: StringParam,
    zipCpde: StringParam,
    radius: StringParam,
    lat: StringParam,
    lng: StringParam,
    range: ArrayParam,
  });

  const [form, setValues] = useState({
    search: query.search || initialFormState.search,
    list: query.list || initialFormState.list,
    onlineOffersMinCount:
      query.onlineOffersMinCount || initialFormState.onlineOffersMinCount,
    brandLabel: query.brandLabel || initialFormState.brandLabel,
    modelLabel: query.modelLabel || initialFormState.modelLabel,
    country: query.country || initialFormState.country,
    zipCode: query.zipCode || initialFormState.zipCode,
    radius: query.radius || initialFormState.radius,
    lat: query.lat || initialFormState.lat,
    lng: query.lng || initialFormState.lng,
    range: query.range || initialFormState.range,
  });
  const [dealers, setDealers] = useState([]);
  const [DealersCount, setDealersCount] = useState([]);
  const [filters, setFilters] = useState([]);

  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchDealers = async () => {
      setIsFetching(true);
      const result = await API.get("b2bPlateform", `/pointOfSale`, {
        queryStringParameters: {
          search: form.search,
          list: form.list,
          onlineOffersMinCount: JSON.stringify(form.onlineOffersMinCount),
          brandLabel: form.brandLabel,
          modelLabel: form.modelLabel,
          country: form.country,
          radius: form.radius,
          lat: form.lat,
          lng: form.lng,
          range: JSON.stringify(form.range),
        },
        response: true,
      });

      const contentRange = result.headers["content-range"];

      if (result.data && result.data.length > 0) {
        const contentRangeArray = contentRange.split("/");
        setDealersCount(contentRangeArray[1]);
        setDealers(result.data);
      } else {
        setDealersCount(0);
        setDealers([]);
      }
      setIsFetching(false);
    };

    fetchDealers();
  }, [query]);

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
  }, [form.modelLabel, form.country, form.radius, form.lat, form.lng]);

  useEffect(() => {
    form.zipCode = "";
    form.lat = "";
    form.lng = "";
    setQuery(form);
  }, [form.country]);

  // infinte scroll
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isFetching
    )
      return;

    const currentRange = parseInt(form.range[1]);

    if (currentRange <= DealersCount) {
      form.range[1] = currentRange + ItemsPerPage;
      setQuery(form);
      setIsFetching(true);
    }
  };

  return (
    <Container>
      <MenuSwitcher current="dealers" />
      <hr />
      <Row>
        <div className="search-record-nav">
          <Section className="search-section">
            <Row>
              <Col className="col col-8" md="12">
                <FilterSearch
                  value={form.search}
                  updateField={updateField}
                  updateSearch={updateSearch}
                />
              </Col>

              <Col className="col d-md-none">
                <button
                  type="button"
                  className="btn btn-sm btn-block btn-danger-reverse rounded"
                  onClick={() =>
                    setMenuMobileOpen(menuMobileOpen ? false : true)
                  }
                >
                  {t("Filter")} <FontAwesomeIcon icon={faFilter} />
                </button>
              </Col>
            </Row>
          </Section>

          <div
            className={`${menuMobileOpen === false ? "d-none" : ""} d-md-block`}
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
                <Translate code="storage_place" />
              </p>

              <FilterGeoloc
                country={form.country}
                zipCode={form.zipCode}
                radius={form.radius}
                lat={form.lat}
                lng={form.lng}
                updateField={updateField}
                updateSearch={updateSearch}
                updatePosition={updatePosition}
              />
            </Section>
            <Section>
              <FormActions reset={handleReset} />
            </Section>
          </div>
        </div>

        <Col>
          <Row>
            <Col className="list-filter-buttons mb-2 d-none d-md-block">
              <Button
                size="sm"
                outline
                className={form.list === "all" ? "active" : "inactive"}
                onClick={() => showCustomList("all")}
              >
                {t("all_dealers")}
              </Button>

              <Button
                size="sm"
                outline
                className={form.list === "my_dealers" ? "active" : "inactive"}
                onClick={() => showCustomList("my_dealers")}
              >
                {t("my_dealers")}
              </Button>
              <Link to="/records?list=my_dealers">
                <Button size="sm" outline className="inactive">
                  {t("vehicles_from_my_dealers")}
                </Button>
              </Link>
            </Col>
          </Row>
          {DealersCount === 0 && (
            <Alert color="secondary" className="text-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
              <Translate code="no_result" />
            </Alert>
          )}

          {DealersCount > 0 && (
            <>
              <div className="d-block d-md-none mt-3 mb-3">
                <Row className="row-thin">
                  <Col className="col-thin col-12">
                    <select
                      className="rounded form-control form-control-sm"
                      onChange={(e) =>
                        e.target.value && showCustomList(e.target.value)
                      }
                      value={form.list}
                    >
                      <option></option>
                      <option value="all">{t("all_dealers")}</option>
                      <option value="my_dealers">{t("my_dealers")}</option>
                      <option value="vehicles_from_my_dealers">
                        {t("vehicles_from_my_dealers")}
                      </option>
                    </select>
                  </Col>
                </Row>
              </div>
              <Row className="dealer-list">
                <Col xs="12" sm="6" lg="8">
                  <div className="h5 mb-3">
                    <b>{DealersCount}</b> {t("dealers")}
                  </div>
                </Col>

                {dealers &&
                  dealers.map((record, index) => (
                    <DealersElement key={index} dealer={record} />
                  ))}
              </Row>
            </>
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
  );
};

export default DealersListContainer;
