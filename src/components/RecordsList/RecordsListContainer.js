import React, { useState, useEffect } from "react";
import MenuSwitcher from "../common/MenuSwitcher";
import SupplyTypeSwitcher from "../common/SupplyTypeSwitcher";
import { Container, Row, Col, Alert, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faFilter,
  faStar,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import Translate, { t } from "../common/Translate";
import FilterBrands from "./FilterBrands";
import FilterSearch from "./FilterSearch";
import FilterModels from "./FilterModels";
import FilterYears from "./FilterYears";
import FilterKilometers from "./FilterKilometers";
import FilterGeoloc from "./FilterGeoloc";
import FilterLists from "./FilterLists";
import Sort from "./Sort.js";
import { API } from "aws-amplify";
import RecordsElement from "./RecordsElement";
import FilterTag from "./FilterTag";
import Section from "./Section";
import FormActions from "./FormActions";
import {
  useQueryParams,
  NumberParam,
  StringParam,
  ArrayParam,
} from "use-query-params";

const RecordsListContainer = ({ usercountry }) => {
  const ItemsPerPage = 100;

  const sortLabelList = [
    "sort_sales_ending_soon_desc",
    "sort_sales_ending_soon_asc",
    "selling_price_asc",
    "selling_price_desc",
    "sort_mileage_asc",
    "sort_mileage_desc",
  ];

  const initialFormState = {
    search: "",
    list: "all",
    brandLabel: "",
    modelLabel: "",
    yearMecMin: "",
    yearMecMax: "",
    mileageMin: "",
    mileageMax: "",
    supplyType: "STOCK",
    country: [usercountry],
    zipCode: "",
    radius: 300,
    lat: "",
    lng: "",
    listId: "",
    sortLabel: "sort_sales_ending_soon_desc",
    range: [0, ItemsPerPage - 1],
  };

  const [query, setQuery] = useQueryParams({
    search: StringParam,
    list: StringParam,
    brandLabel: StringParam,
    modelLabel: StringParam,
    yearMecMin: NumberParam,
    yearMecMax: NumberParam,
    mileageMin: NumberParam,
    mileageMax: NumberParam,
    supplyType: StringParam,
    country: ArrayParam,
    zipCode: StringParam,
    lat: StringParam,
    lng: StringParam,
    radius: NumberParam,
    listId: NumberParam,
    sortLabel: StringParam,
    range: ArrayParam,
  });

  const [form, setValues] = useState({
    search: query.search || initialFormState.search,
    list: query.list || initialFormState.list,
    brandLabel: query.brandLabel || initialFormState.brandLabel,
    modelLabel: query.modelLabel || initialFormState.modelLabel,
    yearMecMin: query.yearMecMin || initialFormState.yearMecMin,
    yearMecMax: query.yearMecMax || initialFormState.yearMecMax,
    mileageMin: query.mileageMin || initialFormState.mileageMin,
    mileageMax: query.mileageMax || initialFormState.mileageMax,
    supplyType: query.supplyType || initialFormState.supplyType,
    country: query.country || initialFormState.country,
    zipCode: query.zipCode || initialFormState.zipCode,
    radius: query.radius || initialFormState.radius,
    lat: query.lat || initialFormState.lat,
    lng: query.lng || initialFormState.lng,
    listId: query.listId || initialFormState.listId,
    sortLabel: query.sortLabel || initialFormState.sortLabel,
    range: query.range || initialFormState.range,
  });

  const [records, setRecords] = useState([]);
  const [RecordsCount, setRecordsCount] = useState([]);
  const [modelLabels, setModelLabels] = useState([]);
  const [filters, setFilters] = useState([]);
  const [aggregation, setAggregation] = useState([]);
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const bodyPos = sessionStorage.getItem("scrollPos");

  const updateField = (e) => {
    const { name, value } = e.target;

    const tmpForm = {
      ...form,
      [name]: value,
    };
    setValues(tmpForm);
    sessionStorage.removeItem("scrollPos");
  };

  const updatePosition = (position) => {
    const tmpForm = {
      ...form,
      lat: position.lat,
      lng: position.lng,
    };
    setValues(tmpForm);
  };

  const updateSearch = () => {
    setQuery(form);
  };

  const showCustomList = (listName) => {
    form.list = listName;
    setQuery(form);
    sessionStorage.removeItem("scrollPos");
  };

  const removeFilter = (target) => {
    form[target] = "";
    setQuery(form);
    sessionStorage.removeItem("scrollPos");
  };

  const handleReset = () => {
    setValues(initialFormState);
    setQuery(initialFormState);
  };

  const handleSortLabel = (value) => {
    form.sortLabel = value;
    setQuery(form);
  };
  useEffect(() => {
    const fetchRecords = async () => {
      const result = await API.get("b2bPlateform", `/filter`, {
        queryStringParameters: {
          filter: JSON.stringify({
            list: form.list,
            search: form.search,
            supplyType: form.supplyType,
            yearMecMin: form.yearMecMin,
            yearMecMax: form.yearMecMax,
            mileageMin: form.mileageMin,
            mileageMax: form.mileageMax,
            listId: form.listId,
            country: form.country,
            lat: form.lat,
            lng: form.lng,
            radius: form.radius,
          }),
        },
        response: true,
      });
      setFilters(result.data);
    };

    fetchRecords();
  }, [query]);

  useEffect(() => {
    const fetchRecords = async () => {
      setIsFetching(true);
      const result = await API.get("b2bPlateform", `/sale`, {
        queryStringParameters: {
          sortLabel: form.sortLabel,
          range: JSON.stringify(form.range),
          filter: JSON.stringify({
            list: form.list,
            search: form.search,
            supplyType: form.supplyType,
            brandLabel: form.brandLabel,
            modelLabel: form.modelLabel,
            yearMecMin: form.yearMecMin,
            yearMecMax: form.yearMecMax,
            mileageMin: form.mileageMin,
            mileageMax: form.mileageMax,
            listId: form.listId,
            country: form.country,
            lat: form.lat,
            lng: form.lng,
            radius: form.radius,
          }),
        },
        response: true,
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
  }, [query]);

  useEffect(() => {
    const fetchRecords = async () => {
      const result = await API.get("b2bPlateform", `/aggregations`, {
        queryStringParameters: {
          filter: JSON.stringify({
            list: form.list,
            search: form.search,
            supplyType: form.supplyType,
            brandLabel: form.brandLabel,
            modelLabel: form.modelLabel,
            yearMecMin: form.yearMecMin,
            yearMecMax: form.yearMecMax,
            mileageMin: form.mileageMin,
            mileageMax: form.mileageMax,
            listId: form.listId,
            lat: form.lat,
            lng: form.lng,
            radius: form.radius,
          }),
        },
        response: true,
      });
      setAggregation(result.data);
    };

    fetchRecords();
  }, [query]);
  const stockageNbr = aggregation.countries;
  const countOfferToPrivate = aggregation.countOfferToPrivate;

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
  }, [
    form.modelLabel,
    form.supplyType,
    JSON.stringify(form.country),
    form.radius,
    form.lat,
    form.lng,
    form.listId,
  ]);

  useEffect(() => {
    form.zipCode = "";
    form.lat = "";
    form.lng = "";
    setQuery(form);
  }, [JSON.stringify(form.country)]);

  // infinte scroll

  useEffect(() => {
    window.scrollTo(0, bodyPos);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching]);

  const handleScroll = () => {
    const scrollPos = Math.round(
      (window.innerHeight + document.documentElement.scrollTop) / 10
    );
    const windowHeight = Math.round(document.documentElement.offsetHeight / 10);

    if (scrollPos !== windowHeight || isFetching) return;

    const currentRange = parseInt(form.range[1]);
    if (currentRange <= parseInt(RecordsCount)) {
      form.range[1] = currentRange + ItemsPerPage;
      setQuery(form);
      setIsFetching(true);
    }
  };
  return (
    <Container>
      <MenuSwitcher current="records" />

      <div className="d-md-none text-center">
        <p className="section-title">
          <Translate code="offer_type" />
        </p>
        <SupplyTypeSwitcher
          current={form.supplyType}
          updateField={updateField}
          countOfferToPrivate={countOfferToPrivate}
        />
      </div>

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
                  Filtrer <FontAwesomeIcon icon={faFilter} />
                </button>
              </Col>
            </Row>
          </Section>

          <div
            className={`${menuMobileOpen === false ? "d-none" : ""} d-md-block`}
          >
            <Section>
              <div className="d-none d-md-block">
                <p className="section-title">
                  <Translate code="offer_type" />
                </p>

                <SupplyTypeSwitcher
                  current={form.supplyType}
                  updateField={updateField}
                  countOfferToPrivate={countOfferToPrivate}
                />
              </div>

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
                stockageNbr={stockageNbr}
              />
              {filters.lists && (
                <>
                  <p className="section-title">
                    <Translate code="lists" />
                  </p>
                  <FilterLists
                    lists={filters.lists}
                    value={form.listId}
                    updateField={updateField}
                  />
                </>
              )}
            </Section>
            <Section>
              <FormActions reset={handleReset} />
            </Section>
          </div>
        </div>
        <Col>
          <Row>
            <Col className="list-filter-buttons">
              <div className="d-none d-md-block">
                <Button
                  size="sm"
                  outline
                  className={form.list === "all" ? "active" : "inactive"}
                  onClick={() => showCustomList("all")}
                >
                  {t("all_vehicles")}
                </Button>
                <Button
                  size="sm"
                  outline
                  className={form.list === "my_offers" ? "active" : "inactive"}
                  onClick={() => showCustomList("my_offers")}
                >
                  {t("my_offers")}
                </Button>
                <Button
                  size="sm"
                  outline
                  className={
                    form.list === "my_bookmarked_sales" ? "active" : "inactive"
                  }
                  onClick={() => showCustomList("my_bookmarked_sales")}
                >
                  <FontAwesomeIcon icon={faStar} className="mr-2" />
                  {t("my_favourites")}
                </Button>
                <Button
                  size="sm"
                  outline
                  className={form.list === "my_dealers" ? "active" : "inactive"}
                  onClick={() => showCustomList("my_dealers")}
                >
                  {t("vehicles_from_my_dealers")}
                </Button>
                <Button
                  size="sm"
                  outline
                  className={
                    form.list === "my_purchases" ? "active" : "inactive"
                  }
                  onClick={() => showCustomList("my_purchases")}
                >
                  {t("my_purchases")}
                </Button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col className="tag-list">
              <FilterTag
                label={t("search")}
                value={query.search}
                target="search"
                removeFilter={removeFilter}
              />
              <FilterTag
                label={t("vehicule_brand")}
                value={query.brandLabel}
                target="brandLabel"
                removeFilter={removeFilter}
              />

              <FilterTag
                label={t("vehicule_model")}
                value={query.modelLabel}
                target="modelLabel"
                removeFilter={removeFilter}
              />

              <FilterTag
                label={t("km_min")}
                value={query.mileageMin}
                target="mileageMin"
                removeFilter={removeFilter}
              />
              <FilterTag
                label={t("km_max")}
                value={query.mileageMax}
                target="mileageMax"
                removeFilter={removeFilter}
              />
              <FilterTag
                label={t("year_mec_min")}
                value={query.yearMecMin}
                target="yearMecMin"
                removeFilter={removeFilter}
              />
              <FilterTag
                label={t("year_mec_max")}
                value={query.yearMecMax}
                target="yearMecMax"
                removeFilter={removeFilter}
              />
            </Col>
          </Row>

          <div className="d-block d-md-none mb-3">
            <label className="gray text-uppercase">{t("vehicles")}</label>
            <Row className="row-thin">
              <Col className="col-thin col-8" md="12">
                <select
                  className="rounded form-control form-control-sm"
                  onChange={(e) =>
                    e.target.value && showCustomList(e.target.value)
                  }
                  value={form.list}
                >
                  <option value="all">{t("all_vehicles")}</option>
                  <option value="my_offers">{t("my_offers")}</option>
                  <option value="my_dealers">
                    {t("vehicles_from_my_dealers")}
                  </option>
                  <option value="my_purchases">{t("my_purchases")}</option>
                </select>
              </Col>
              <Col className="col-thin">
                <Button
                  block
                  outline={form.list !== "my_bookmarked_sales"}
                  className="rounded"
                  size="sm"
                  color="primary"
                  onClick={() => showCustomList("my_bookmarked_sales")}
                >
                  {t("my_favourites")}
                  <FontAwesomeIcon icon={faStar} className="ml-2" />
                </Button>
              </Col>
            </Row>
          </div>
          {RecordsCount === 0 && (
            <Alert color="secondary" className="text-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
              <Translate code="no_result" />
            </Alert>
          )}

          {RecordsCount > 0 && !isFetching && (
            <>
              <Row>
                <Col xs="12" md="8" lg="5" xl="4" className="order-md-2">
                  <label className="gray text-uppercase d-md-none">
                    {t("sort_by")}
                  </label>
                  <Sort
                    list={sortLabelList}
                    value={form.sortLabel}
                    sort={handleSortLabel}
                  />
                </Col>
                <Col xs="12" md="4" lg="7" xl="8" className="order-md-1">
                  <div className="h5 mt-1 mb-3">
                    <b>{RecordsCount}</b> <Translate code="vehicles" />
                  </div>
                </Col>
              </Row>
              <Row className="car-list">
                {records &&
                  records.map((record, index) => (
                    <RecordsElement key={index} record={record} />
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

export default RecordsListContainer;
