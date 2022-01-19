import moment from "moment";
import _ from "lodash";
import { t } from "../components/common/Translate";

const carPictures = [
  "three_quarters_front_picture",
  "left_side_picture",
  "three_quarters_back_left_picture",
  "back_picture",
  "three_quarters_back_picture",
  "right_side_picture",
  "three_quarters_front_right_picture",
  "front_picture",
  "counter_picture",
  "dashboard_picture",
  "inside_front_picture",
  "inside_back_picture",
  "trunk_picture",
  "wheels_front_left_picture",
  "wheels_front_right_picture",
  "wheels_back_right_picture",
  "wheels_back_left_picture",
];

const ordredKeysCharacteristics = [
  "firstRegistrationDate",
  "mileage",
  "gcDate",
  "firstHand",
  "ownershipDuration",
  "vehicleType",
  "fuelLabel",
  "gearBoxLabel",
  "power",
  "fiscal",
  "co2",
  "imported",
  "seats",
  "door",
  "color",
  "metallic",
];

const ordredKeysInspection = [
  "vat",
  "vatDetails",
  "car_crashed",
  "painting_test",
  "accident",
  "body_rear_trunk_floor",
  "painting_anomaly",
];
const orderedKeysServicing = [
  "nextTechnicalCheckDate",
  "servicingHistory",
  "lastServicingDate",
  "lastServicingKm",
  "distributionBelt",
];

const orderedKeysWheelsFront = [
  "wheelsFrontDimensions",
  "rimTypeFront",
  "wheelsFrontTireBrand",
];

const orderedKeysWheelsBack = [
  "wheelsBackDimensions",
  "rimTypeBack",
  "wheelsBackTireBrand",
];
const orderedKeysGeneralCostsOne = [
  "car_inspection",
  "technical_check",
  "distribution_belt",
];
const orderedKeysGeneralCostsTwo = ["secondSetKey", "userManual"];

const getOrderAdminDetails = (administrativeDetails) => {
  let orderadminDetail = {};
  let gcDate = _.get(administrativeDetails, "gcDate", null);
  try {
    if (gcDate) {
      Object.entries(administrativeDetails).forEach(([key, value]) => {
        _.set(orderadminDetail, key, value);
        if (key === "gcDate")
          _.set(
            orderadminDetail,
            "ownershipDuration",
            moment.duration(moment().diff(moment(gcDate))).asMilliseconds()
          );
      });
    }
  } catch (e) {
    console.log("Error while calculate ownershipDuration");
  }
  return orderadminDetail;
};

const preferredOrder = (obj, order) => {
  var newObject = [];
  for (var i = 0; i < order.length; i++) {
    if (obj.hasOwnProperty(order[i])) {
      newObject.push({
        element: order[i],
        value: obj[order[i]],
      });
    }
  }
  return newObject;
};

export const customReportGallery = (vehicleGallery) => {
  let gallery = [];
  // order gallery
  carPictures.map((pic) => {
    const elem = _.find(vehicleGallery, (o) => o.key === pic);
    if (elem) gallery.push(elem);
  });
  const vinPicture = vehicleGallery.find((v) => v.key === "vin_picture");
  let motorPicture = vehicleGallery.find((v) => "motor_picture" === v.key);
  motorPicture = motorPicture
    ? motorPicture
    : vehicleGallery.find((v) => "motor_other" === v.key);

  return {
    gallery,
    vinPicture,
    motorPicture,
  };
};

export const customReportOrder = (vehicle, accidentDamage, generalCosts) => {
  const orderadminDetail = getOrderAdminDetails(vehicle.administrativeDetails);
  if (orderadminDetail) vehicle.administrativeDetails = orderadminDetail;
  const orderedGeneralCostsOne = preferredOrder(
    generalCosts,
    orderedKeysGeneralCostsOne
  );

  const orderedInspection = preferredOrder(
    Object.assign({}, vehicle.history, accidentDamage),
    ordredKeysInspection
  );
  const vehicleCharacteristics = Object.assign(
    {},
    vehicle.characteristics,
    vehicle.history,
    vehicle.administrativeDetails,
    vehicle.history,
    orderadminDetail
  );
  const ordredcharacteristics = preferredOrder(
    vehicleCharacteristics,
    ordredKeysCharacteristics
  );

  const orderedSirvicing = preferredOrder(
    vehicle.servicing,
    orderedKeysServicing
  );
  const orderedwheelsFront = preferredOrder(
    vehicle.characteristics,
    orderedKeysWheelsFront
  );
  const orderedwheelsBack = preferredOrder(
    vehicle.characteristics,
    orderedKeysWheelsBack
  );
  const orderedGeneralCostsTwo = preferredOrder(
    vehicle.administrativeDetails,
    orderedKeysGeneralCostsTwo
  );
  return {
    ordredcharacteristics,
    orderedSirvicing,
    orderedwheelsFront,
    orderedwheelsBack,
    orderedGeneralCostsTwo,
    orderedInspection,
    orderedGeneralCostsOne,
  };
};

export const checkGalleryIsEmpty = (damages) => {
  let emptyGallery =
    _.isEmpty(damages) ||
    Object.values(damages).every((elem) => elem.image.length === 0);
  return emptyGallery;
};

export const customReportGalleryDamages = (damages) => {
  let wheelsDamages = [];
  let bodyDamages = [];
  let innerDamages = [];
  let accidentDamage = {};
  let generalCosts = {};
  let roadTestDamages = [];
  let motorDamages = [];
  let bodyDamagesGallery = {};
  let innerDamagesGallery = {};
  let motorDamagesGallery = {};
  let wheelsDamagesGallery = {};
  let roadTestDamagesGallery = {};
  // Map on car damages

  damages.map((e) => {
    const carElements = ["wheels", "road_test", "motor", "body", "inner"];
    carElements.map((elem) => {
      if (elem === e.zone) {
        if (elem === "road_test") elem = "roadTest";

        const value = `${elem}Damages`;
        eval(value).push({
          element: e.element,
          value:
            e.custom_damage && e.custom_damage.length > 0
              ? e.custom_damage
              : e.damage,
          isCustom:
            e.custom_damage && e.custom_damage.length > 0 ? true : false,
        });

        const valueGallery = `${elem}DamagesGallery`;
        eval(valueGallery)[e.element] = {
          image: e.damage_picture,
          damage: e.custom_damage,
          element: e.element,
        };
      }
    });

    if (
      [
        "car_crashed",
        "painting_test",
        "accident",
        "body_rear_trunk_floor",
        "painting_anomaly",
      ].includes(e.element)
    )
      accidentDamage[e.element] = e.damage;

    if (accidentDamage["accident"] !== "yes")
      accidentDamage["painting_anomaly"] = undefined;

    if (
      ["car_inspection", "technical_check", "distribution_belt"].includes(
        e.element
      )
    )
      generalCosts[e.element] = e.damage;
  });

  return {
    generalCosts,
    wheelsDamages,
    bodyDamages,
    innerDamages,
    roadTestDamages,
    motorDamages,
    accidentDamage,
    bodyDamagesGallery,
    innerDamagesGallery,
    motorDamagesGallery,
    wheelsDamagesGallery,
    roadTestDamagesGallery,
  };
};
