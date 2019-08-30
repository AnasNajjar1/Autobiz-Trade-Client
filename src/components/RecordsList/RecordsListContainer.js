import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Alert } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faFilter
} from "@fortawesome/free-solid-svg-icons";
import FilterSearch from "./FilterSearch";
import FilterBrands from "./FilterBrands";
import FilterModels from "./FilterModels";
import FilterYears from "./FilterYears";
import FilterKilometers from "./FilterKilometers";
import FilterCheckboxes from "./FilterCheckboxes";
import Sort from "./Sort.js";

import Amplify, { API } from 'aws-amplify';

import RecordsElement from "./RecordsElement";
import _ from "lodash";
import FilterTag from "./FilterTag";
import Section from "./Section";
import FormActions from "./FormActions";

import {
  useQueryParams,
  NumberParam,
  StringParam,
  DelimitedArrayParam
} from "use-query-params";

const RecordsListContainer = () => {
  const offers = ["private", "stock"];

  const sortList = [
    {
      id: "price_asc",
      name: "Tri : Prix croissants"
    },
    {
      id: "price_desc",
      name: "Tri : Prix décroissants"
    },
    {
      id: "age_desc",
      name: "Tri : Plus anciens"
    },
    {
      id: "age_asc",
      name: "Tri : Plus récents"
    },
    {
      id: "km_desc",
      name: "Tri : Plus kilométrés"
    },
    {
      id: "km_asc",
      name: "Tri : Moins kilométrés"
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
    sort: "age_asc",
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
    sort: StringParam,
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

  const handleSort = e => {
    const { value } = e.target;
    form.sort = value;
    setQuery(form);
  };

  useEffect(() => {
    const fetchRecords = async () => {
      const result = await API.get("b2bPlateform", `/filters`);
      console.log(result)
      setFilters(result);
    };
    fetchRecords();
  }, []);

  useEffect(() => {
    const fetchRecords = async () => {
      let apiQuery = {
        ProjectionExpression:
          "id, content.vehicle.brandLabel, content.vehicle.modelLabel, content.vehicle.versionLabel, content.vehicle.firstRegistrationDate, content.vehicle.fuelLabel, content.vehicle.mileage, content.vehicle.profileCosts, content.vehicle.carPictures.front_picture, content.pointOfSale.city, content.pointOfSale.zipCode"
      };

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

      console.log(query.pointOfSales);

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

      if (arrayFilterExpression.length > 0) {
        apiQuery.FilterExpression = arrayFilterExpression.join(" and ");
      }
      if (!_.isEmpty(ExpressionAttributeValues)) {
        apiQuery.ExpressionAttributeValues = ExpressionAttributeValues;
      }

      console.log(apiQuery);

      const result = await API.post("b2bPlateform", `/records`,{body : JSON.stringify(apiQuery)});
      
      // axios.post(
      //   `${process.env.REACT_APP_API}/records`,
      //   JSON.stringify(apiQuery)
      // );
      setRecordsCount(result.Count);
      setRecords(result.Items);
    };
    fetchRecords();
  }, [query]);

  useEffect(() => {
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
          <Section>
            <Row>
              <Col className="col col-6" sm="8" md="12">
                <FilterSearch value={form.search} onChange={updateField} />
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
          </Section>
          <div
            className={`${menuMobileOpen === false ? "d-none" : ""} d-md-block`}
          >
            <Section>
              <p className="section-title">Marque et modèle</p>

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
              <p className="section-title">Année MEC</p>
              <FilterYears
                yearMecMin={form.yearMecMin}
                yearMecMax={form.yearMecMax}
                updateField={updateField}
              />

              <p className="section-title">KM</p>
              <FilterKilometers
                kmMin={form.kmMin}
                kmMax={form.kmMax}
                updateField={updateField}
              />

              <p className="section-title">Lieu de stockage</p>

              {filters.city && (
                <FilterCheckboxes
                  data={Object.keys(filters.city)}
                  target="pointOfSales"
                  values={form.pointOfSales}
                  updateField={updateCheckBox}
                  all
                />
              )}

              <p className="section-title">Types d'offres</p>
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
                label="Recherche"
                value={query.search}
                target="search"
                removeFilter={removeFilter}
              />
              <FilterTag
                label="Marque"
                value={query.brandLabel}
                target="brandLabel"
                removeFilter={removeFilter}
              />

              <FilterTag
                label="Modèle"
                value={query.modelLabel}
                target="modelLabel"
                removeFilter={removeFilter}
              />

              <FilterTag
                label="Km min"
                value={query.kmMin}
                target="kmMin"
                removeFilter={removeFilter}
              />
              <FilterTag
                label="Km max"
                value={query.kmMax}
                target="kmMax"
                removeFilter={removeFilter}
              />
              <FilterTag
                label="Année MEC min"
                value={query.yearMecMin}
                target="yearMecMin"
                removeFilter={removeFilter}
              />
              <FilterTag
                label="Année MEC max"
                value={query.yearMecMax}
                target="yearMecMax"
                removeFilter={removeFilter}
              />
            </Col>
          </Row>
          {RecordsCount === 0 && (
            <Alert color="secondary" className="text-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
              Pas de résultats
            </Alert>
          )}

          {RecordsCount > 0 && (
            <Row className="car-list">
              <Col xs="12" sm="6" lg="8">
                <div className="h5 mb-3">
                  <b>{RecordsCount}</b> véhicules
                </div>
              </Col>
              <Col xs="12" sm="6" lg="4">
                <Sort
                  list={sortList}
                  value={form.sort}
                  updateField={handleSort}
                />
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
