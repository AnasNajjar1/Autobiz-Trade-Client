import _ from "lodash";

export const showWheelsImg = (element, gallery) => {
  let link = null;
  if (
    element === "wheels_front_rim_alu_left" ||
    element === "wheels_front_rim_steel_left" ||
    element === "wheels_front_cover_left"
  ) {
    link = _.extend.apply(
      null,
      _.filter(gallery, (g) => g.key === "wheels_front_left_picture")
    ).value;
  } else if (
    element === "wheels_front_rim_alu_right" ||
    element === "wheels_front_rim_steel_right" ||
    element === "wheels_front_cover_right"
  ) {
    link = _.extend.apply(
      null,
      _.filter(gallery, (g) => g.key === "wheels_front_right_picture")
    ).value;
  } else if (
    element === "wheels_back_rim_alu_left" ||
    element === "wheels_back_rim_steel_left" ||
    element === "wheels_back_cover_left"
  ) {
    link = _.extend.apply(
      null,
      _.filter(gallery, (g) => g.key === "wheels_back_left_picture")
    ).value;
  } else if (
    element === "wheels_back_rim_alu_right" ||
    element === "wheels_back_rim_steel_right" ||
    element === "wheels_back_cover_right"
  ) {
    link = _.extend.apply(
      null,
      _.filter(gallery, (g) => g.key === "wheels_back_right_picture")
    ).value;
  }
  return link;
};

const presetOrderGallery = [
  {
    label: "three_quarters_front_picture",
    order: 1,
  },
  {
    label: "left_side_picture",
    order: 2,
  },
  {
    label: "three_quarters_back_left_picture",
    order: 3,
  },
  {
    label: "three_quarters_back_picture",
    order: 4,
  },
  {
    label: "right_side_picture",
    order: 5,
  },
  {
    label: "three_quarters_front_right_picture",
    order: 6,
  },
  {
    label: "front_picture",
    order: 7,
  },
  {
    label: "motor_picture",
    order: 8,
  },
  {
    label: "counter_picture",
    order: 9,
  },
  {
    label: "inside_front_picture",
    order: 10,
  },
  {
    label: "dashboard_picture",
    order: 11,
  },
  {
    label: "inside_back_picture",
    order: 12,
  },
  {
    label: "back_picture",
    order: 13,
  },
  {
    label: "trunk_picture",
    order: 14,
  },
  {
    label: "wheels_front_left_picture",
    order: 15,
  },
  {
    label: "wheels_back_left_picture",
    order: 16,
  },
  {
    label: "wheels_back_right_picture",
    order: 17,
  },
  {
    label: "wheels_front_right_picture",
    order: 18,
  },
  {
    label: "other_car_pictures1",
    order: 19,
  },
  {
    label: "other_car_pictures2",
    order: 20,
  },
  {
    label: "other_car_pictures3",
    order: 21,
  },
  {
    label: "other_car_pictures4",
    order: 22,
  },
  {
    label: "other_car_pictures5",
    order: 23,
  },
  {
    label: "other_car_pictures6",
    order: 24,
  },
  {
    label: "other_car_pictures7",
    order: 25,
  },
  {
    label: "other_car_pictures8",
    order: 26,
  },
  {
    label: "other_car_pictures9",
    order: 27,
  },
  {
    label: "other_car_pictures10",
    order: 28,
  },
  {
    label: "other_car_pictures11",
    order: 29,
  },
  {
    label: "other_car_pictures12",
    order: 30,
  },
  {
    label: "other_car_pictures13",
    order: 31,
  },
  {
    label: "other_car_pictures14",
    order: 32,
  },
  {
    label: "other_car_pictures15",
    order: 33,
  },
  {
    label: "registration_card_picture",
    order: 34,
  },
  {
    label: "vin_picture",
    order: 35,
  },
  {
    label: "servicing_manual_picture1",
    order: 36,
  },
  {
    label: "servicing_manual_picture2",
    order: 37,
  },
  {
    label: "servicing_manual_picture3",
    order: 38,
  },
  {
    label: "servicing_manual_picture4",
    order: 39,
  },
  {
    label: "servicing_manual_picture5",
    order: 40,
  },
  {
    label: "servicing_manual_picture6",
    order: 41,
  },
  {
    label: "servicing_manual_picture7",
    order: 42,
  },
  {
    label: "servicing_manual_picture8",
    order: 43,
  },
  {
    label: "servicing_manual_picture9",
    order: 44,
  },
  {
    label: "servicing_manual_picture10",
    order: 45,
  },
  {
    label: "servicing_manual_picture11",
    order: 46,
  },
  {
    label: "servicing_manual_picture12",
    order: 47,
  },
  {
    label: "servicing_manual_picture13",
    order: 48,
  },
  {
    label: "servicing_manual_picture14",
    order: 49,
  },
  {
    label: "servicing_manual_picture15",
    order: 50,
  },
];

export const orderGalleryPictures = (gallery) => {
  let orderedGallery = [];
  const disorderedGallery = [];

  _.forEach(gallery, ({ key, value }) => {
    const picture = { key, value };
    // chek if label exist in order table
    const foundedLabel = _.filter(presetOrderGallery, { label: key });
    if (!_.isEmpty(foundedLabel)) {
      orderedGallery[foundedLabel[0].order] = picture;
    } else {
      disorderedGallery.push(picture);
    }
  });
  orderedGallery = _.filter(
    orderedGallery,
    (picture) => picture != null
  ).concat(disorderedGallery);
  return orderedGallery;
};

export const excludedMarketData = [
  {
    b2cMarketValue: 0,
    dpaProAmt: 0,
    salesSpeedName: "NA",
    standardMileage: 0,
  },
];

export const excludedKeyPoint = ["imported", "fewCosts"];

export const excludedEquipments = ["none"];

export const listZone = [
  "servicing",
  "wheels",
  "body",
  "inner",
  "road_test",
  "motor",
  "crash",
];

export const contentIsNull = (content) => {
  return _.find(content, (element) => element);
};
