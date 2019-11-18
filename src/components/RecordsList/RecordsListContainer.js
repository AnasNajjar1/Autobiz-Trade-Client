import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faFilter
} from "@fortawesome/free-solid-svg-icons";
import Translate, { t } from "../common/Translate";
import FilterBrands from "./FilterBrands";
import FilterSearch from "./FilterSearch";
import FilterModels from "./FilterModels";
import FilterYears from "./FilterYears";
import FilterKilometers from "./FilterKilometers";
import FilterCheckboxes from "./FilterCheckboxes";
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
  DelimitedArrayParam,
  ArrayParam
} from "use-query-params";

const RecordsListContainer = () => {
  const offers = ["offerToPrivate", "stock"];

  const ItemsPerPage = 12;

  const sortList = [
    /* "sort_price_asc",
    "sort_price_desc", */
    "sort_sales_ending_soon",
    "sort_date_asc",
    "sort_date_desc",
    "sort_mileage_asc",
    "sort_mileage_desc"
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
    offerType: ["all"],
    city: ["all"],
    sort: "sort_sales_ending_soon",
    range: [0, ItemsPerPage - 1]
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
    offerType: DelimitedArrayParam,
    city: DelimitedArrayParam,
    sort: StringParam,
    range: ArrayParam
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
    offerType: query.offerType || initialFormState.offerType,
    city: query.city || initialFormState.city,
    sort: query.sort || initialFormState.sort,
    range: query.range || initialFormState.range
  });

  const [records, setRecords] = useState([]);
  const [RecordsCount, setRecordsCount] = useState([]);
  const [modelLabels, setModelLabels] = useState([]);

  const [filters, setFilters] = useState([]);

  const [menuMobileOpen, setMenuMobileOpen] = useState(false);

  const updateField = e => {
    const { name, value } = e.target;
    setValues({
      ...form,
      [name]: value
    });
  };

  const showCustomList = listName => {
    form.list = listName;
    setQuery(form);
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

    setValues({
      ...form,
      [target]: tmpTarget
    });
  };

  const removeFilter = target => {
    form[target] = "";
    handleSubmit();
  };

  const onKeyDown = e => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setMenuMobileOpen(false);
    form.range = initialFormState.range;
    setQuery(form);
  };

  const handleReset = () => {
    handleSubmit();
    setValues(initialFormState);
    setQuery(initialFormState);
  };

  const handleSort = value => {
    form.sort = value;
    setQuery(form);
  };

  const showMore = () => {
    form.range[1] = form.range[1] + ItemsPerPage;
    setQuery(form);
  };

  useEffect(() => {
    const fetchRecords = async () => {
      const result = await API.get("b2bPlateform", `/filter`, {
        response: true
      });
      setFilters(result.data);
    };

    fetchRecords();
  }, []);

  useEffect(() => {
    const fetchRecords = async () => {
      const result = await API.get("b2bPlateform", `/vehicle`, {
        queryStringParameters: {
          sort: form.sort,
          search: form.search,
          list: form.list,
          brandLabel: form.brandLabel,
          modelLabel: form.modelLabel,
          yearMecMin: form.yearMecMin,
          yearMecMax: form.yearMecMax,
          mileageMin: form.mileageMin,
          mileageMax: form.mileageMax,
          offerType: JSON.stringify(form.offerType),
          city: JSON.stringify(form.city),
          country: form.country,
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
    };

    fetchRecords();
  }, [query]);

  useEffect(() => {
    form.modelLabel = "";
    if (filters.models) {
      setModelLabels(filters.models[form.brandLabel]);
    } else {
      setModelLabels([]);
    }
  }, [form.brandLabel]);
  return (
    <Container>
      <Row>
        <div className="search-record-nav">
          <div className="section">
            <Row>
              <Col className="col col-6" sm="8" md="12">
                <FilterSearch
                  value={form.search}
                  onChange={updateField}
                  onKeyDown={onKeyDown}
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
                  Filtrer <FontAwesomeIcon icon={faFilter} />
                </button>
              </Col>
            </Row>
          </div>
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
                <Translate code="year_mec" />
              </p>
              <FilterYears
                yearMecMin={form.yearMecMin}
                yearMecMax={form.yearMecMax}
                updateField={updateField}
              />

              <p className="section-title">
                <Translate code="km" />
              </p>
              <FilterKilometers
                mileageMin={form.mileageMin}
                mileageMax={form.mileageMax}
                updateField={updateField}
              />

              <p className="section-title">
                <Translate code="storage_place" />
              </p>

              {filters.cities && (
                <FilterCheckboxes
                  data={filters.cities}
                  target="city"
                  values={form.city}
                  updateField={updateCheckBox}
                  all
                />
              )}

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
            <Section>
              <FormActions reset={handleReset} submit={handleSubmit} />
            </Section>
          </div>
        </div>
        <Col>
          <Row>
            <Col className="mb-2">
              <Button
                color={form.list === "all" ? "primary" : "secondary"}
                className="mr-2"
                onClick={() => showCustomList("all")}
              >
                {t("all_vehicles")}
              </Button>

              <Button
                color={form.list === "my_offers" ? "primary" : "secondary"}
                onClick={() => showCustomList("my_offers")}
              >
                {t("my_vehicles")}
              </Button>
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
          {RecordsCount === 0 && (
            <Alert color="secondary" className="text-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
              <Translate code="no_result" />
            </Alert>
          )}

          {RecordsCount > 0 && (
            <Row className="car-list">
              <Col xs="12" sm="6" lg="8">
                <div className="h5 mb-3">
                  <b>{RecordsCount}</b> <Translate code="vehicles" />
                </div>
              </Col>
              <Col xs="12" sm="6" lg="4">
                <Sort list={sortList} value={form.sort} sort={handleSort} />
              </Col>
              {records &&
                records.map((record, index) => (
                  <RecordsElement key={index} record={record} />
                ))}
            </Row>
          )}
          {RecordsCount > records.length && (
            <Row>
              <Col className="text-center">
                <Button color="secondary" onClick={showMore}>
                  <Translate code="show_more" />
                </Button>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default RecordsListContainer;
