import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Alert } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faFilter
} from "@fortawesome/free-solid-svg-icons";
import Translate, { t } from "../common/Translate";
import FilterBrands from "./FilterBrands";
import FilterModels from "./FilterModels";
import FilterYears from "./FilterYears";
import FilterKilometers from "./FilterKilometers";
import FilterCheckboxes from "./FilterCheckboxes";
import Sort from "./Sort.js";

import RecordsElement from "./RecordsElement";
import _ from "lodash";
import FilterTag from "./FilterTag";
import Section from "./Section";
import FormActions from "./FormActions";

import {
  useQueryParams,
  NumberParam,
  StringParam,
  ObjectParam,
  DelimitedArrayParam,
  ArrayParam
} from "use-query-params";

const RecordsListContainer = () => {
  const offers = ["private", "stock"];

  const sortList = [
    /*     {
      id: "price_asc",
      name: t("sort_price_asc")
    },
    {
      id: "price_desc",
      name: t("sort_price_desc")
    }, */
    {
      value: ["creationDate", "DESC"],
      name: t("most_recent")
    },
    {
      value: ["creationDate", "ASC"],
      name: t("less_recent")
    },
    {
      value: ["content.vehicle.firstRegistrationDate", "ASC"],
      name: t("sort_date_asc")
    },
    {
      value: ["content.vehicle.firstRegistrationDate", "DESC"],
      name: t("sort_date_desc")
    },
    {
      value: ["content.characteristics.mileage", "ASC"],
      name: t("sort_mileage_desc")
    },
    {
      value: ["content.characteristics.mileage", "DESC"],
      name: t("sort_mileage_asc")
    }
  ];

  const initialFormState = {
    search: "",
    brandLabel: "",
    modelLabel: "",
    yearMecMin: "",
    yearMecMax: "",
    mileageMin: "",
    mileageMax: "",
    salesInfosType: ["all"],
    pointOfSaleCity: ["all"],
    sort: ["creationDate", "DESC"],
    limit: 20,
    page: 1
  };

  const [query, setQuery] = useQueryParams({
    search: StringParam,
    brandLabel: StringParam,
    modelLabel: StringParam,
    yearMecMin: NumberParam,
    yearMecMax: NumberParam,
    mileageMin: NumberParam,
    mileageMax: NumberParam,
    salesInfosType: DelimitedArrayParam,
    pointOfSaleCity: DelimitedArrayParam,
    sort: ArrayParam,
    limit: NumberParam,
    page: NumberParam
  });

  const [form, setValues] = useState({
    search: query.search || initialFormState.search,
    brandLabel: query.brandLabel || initialFormState.brandLabel,
    modelLabel: query.modelLabel || initialFormState.modelLabel,
    yearMecMin: query.yearMecMin || initialFormState.yearMecMin,
    yearMecMax: query.yearMecMax || initialFormState.yearMecMax,
    mileageMin: query.mileageMin || initialFormState.mileageMin,
    mileageMax: query.mileageMax || initialFormState.mileageMax,
    salesInfosType: query.salesInfosType || initialFormState.salesInfosType,
    pointOfSaleCity: query.pointOfSaleCity || initialFormState.pointOfSaleCity,
    sort: query.sort || initialFormState.sort,
    limit: query.limit || initialFormState.limit,
    page: query.page || initialFormState.page
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

  const handleSubmit = () => {
    setMenuMobileOpen(false);
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

  useEffect(() => {
    const fetchRecords = async () => {
      const result = await axios(`${process.env.REACT_APP_API}/filter`);
      setFilters(result.data);
    };

    fetchRecords();
  }, []);

  useEffect(() => {
    const fetchRecords = async () => {
      const result = await axios.get(`${process.env.REACT_APP_API}/vehicle`, {
        params: {
          sort: JSON.stringify(form.sort),
          brandLabel: form.brandLabel,
          modelLabel: form.modelLabel,
          yearMecMin: form.yearMecMin,
          yearMecMax: form.yearMecMax,
          mileageMin: form.mileageMin,
          mileageMax: form.mileageMax,
          salesInfosType: JSON.stringify(form.salesInfosType),
          pointOfSaleCity: JSON.stringify(form.pointOfSaleCity)
        }
      });

      setRecordsCount(result.data.length);
      setRecords(result.data);
    };
    fetchRecords();
  }, [query]);

  useEffect(() => {
    form.modelLabel = "";

    const fetchModelLabels = async () => {
      if (form.brandLabel === "") {
        setModelLabels([]);
      } else {
        if (filters.modelLabel) {
          let modelLabels = Object.keys(filters.modelLabel[form.brandLabel]);
          setModelLabels(modelLabels);
        }
      }
    };
    fetchModelLabels();
  }, [form.brandLabel]);

  return (
    <Container>
      <Row>
        <div className="search-record-nav">
          <div className="section d-md-none">
            {" "}
            {/* replace by <Section> when filterSearch is active */}
            <Row>
              {/*
              <Col className="col col-6" sm="8" md="12">
                <FilterSearch value={form.search} onChange={updateField} />
              </Col> 
              */}
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

              {filters.brandLabel && (
                <FilterBrands
                  brands={Object.keys(filters.brandLabel)}
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

              {filters.city && (
                <FilterCheckboxes
                  data={Object.keys(filters.city)}
                  target="pointOfSaleCity"
                  values={form.pointOfSaleCity}
                  updateField={updateCheckBox}
                  all
                />
              )}

              <p className="section-title">
                <Translate code="offer_type" />
              </p>
              <FilterCheckboxes
                data={offers}
                target="salesInfosType"
                values={form.salesInfosType}
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
                  <b>{RecordsCount}</b> <Translate code="vehicules" />
                </div>
              </Col>
              <Col xs="12" sm="6" lg="4">
                <Sort list={sortList} value={form.sortBy} sort={handleSort} />
              </Col>
              {records.map((record, index) => (
                <RecordsElement key={index} record={record} />
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default RecordsListContainer;
