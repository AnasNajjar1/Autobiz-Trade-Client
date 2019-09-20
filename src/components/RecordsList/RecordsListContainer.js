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
    kmMin: "",
    kmMax: "",
    offersTypes: ["all"],
    pointOfSales: ["all"],
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
    kmMin: NumberParam,
    kmMax: NumberParam,
    offersTypes: DelimitedArrayParam,
    pointOfSales: DelimitedArrayParam,
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
    kmMin: query.kmMin || initialFormState.kmMin,
    kmMax: query.kmMax || initialFormState.kmMax,
    offersTypes: query.offersTypes || initialFormState.offersTypes,
    pointOfSales: query.pointOfSales || initialFormState.pointOfSales,
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
      let apiQuery = {
        ProjectionExpression:
          "id, content.vehicle.brandLabel, content.vehicle.modelLabel, content.vehicle.versionLabel, content.vehicle.firstRegistrationDate, content.vehicle.fuelLabel, content.vehicle.mileage, content.vehicle.profileCosts, content.vehicle.carPictures.front_picture, content.pointOfSale.city, content.pointOfSale.zipCode, content.salesInfos.#TYPE"
      };
      const ExpressionAttributeNames = { "#TYPE": "type" };
      let ExpressionAttributeValues = {};
      let arrayFilterExpression = [];

      if (query.brandLabel) {
        ExpressionAttributeValues[":brandLabel"] = query.brandLabel;
        arrayFilterExpression.push("content.vehicle.brandLabel = :brandLabel");
      }

      if (query.modelLabel) {
        ExpressionAttributeValues[":modelLabel"] = query.modelLabel;
        arrayFilterExpression.push("content.vehicle.modelLabel = :modelLabel");
      }

      if (query.kmMin) {
        ExpressionAttributeValues[":mileageMin"] = query.kmMin;
        arrayFilterExpression.push("content.vehicle.mileage >= :mileageMin");
      }

      if (query.kmMax) {
        ExpressionAttributeValues[":mileageMax"] = query.kmMax;
        arrayFilterExpression.push("content.vehicle.mileage <= :mileageMax");
      }

      if (query.yearMecMin) {
        const dateMin = new Date(Date.UTC(query.yearMecMin, 0, 1));
        ExpressionAttributeValues[":yearMecMin"] = dateMin.toISOString();
        arrayFilterExpression.push(
          "content.vehicle.firstRegistrationDate >= :yearMecMin"
        );
      }

      if (query.yearMecMax) {
        const dateMax = new Date(
          Date.UTC(query.yearMecMax, 11, 31, 23, 59, 59)
        );
        ExpressionAttributeValues[":yearMecMax"] = dateMax.toISOString();
        arrayFilterExpression.push(
          "content.vehicle.firstRegistrationDate <= :yearMecMax"
        );
      }

      if (query.pointOfSales && !query.pointOfSales.includes("all")) {
        let citiesKeys = [];
        query.pointOfSales.forEach(function(pointOfSale, key) {
          ExpressionAttributeValues[`:city_${key}`] = pointOfSale;
          citiesKeys.push(`:city_${key}`);
        });

        arrayFilterExpression.push(
          `content.pointOfSale.city IN(${citiesKeys.join(",")})`
        );
      }

      if (query.offersTypes && !query.offersTypes.includes("all")) {
        let offersTypeKeys = [];
        query.offersTypes.forEach(function(type, key) {
          ExpressionAttributeValues[`:offersType_${key}`] = type;
          offersTypeKeys.push(`:offersType_${key}`);
        });

        arrayFilterExpression.push(
          `content.salesInfos.#TYPE IN(${offersTypeKeys.join(",")})`
        );
      }

      if (arrayFilterExpression.length > 0) {
        apiQuery.FilterExpression = arrayFilterExpression.join(" and ");
      }
      apiQuery.ExpressionAttributeNames = ExpressionAttributeNames;
      if (!_.isEmpty(ExpressionAttributeValues)) {
        apiQuery.ExpressionAttributeValues = ExpressionAttributeValues;
      }

      const result = await axios.get(`${process.env.REACT_APP_API}/vehicle`, {
        params: {
          sort: JSON.stringify(form.sort)
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
                kmMin={form.kmMin}
                kmMax={form.kmMax}
                updateField={updateField}
              />

              <p className="section-title">
                <Translate code="storage_place" />
              </p>

              {filters.city && (
                <FilterCheckboxes
                  data={Object.keys(filters.city)}
                  target="pointOfSales"
                  values={form.pointOfSales}
                  updateField={updateCheckBox}
                  all
                />
              )}

              <p className="section-title">
                <Translate code="offer_type" />
              </p>
              <FilterCheckboxes
                data={offers}
                target="offersTypes"
                values={form.offersTypes}
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
                value={query.kmMin}
                target="kmMin"
                removeFilter={removeFilter}
              />
              <FilterTag
                label={t("km_max")}
                value={query.kmMax}
                target="kmMax"
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
