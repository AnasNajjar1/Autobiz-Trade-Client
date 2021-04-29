import _ from "lodash";

const showWheelsImg = (element, gallery) => {
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

export { showWheelsImg };
