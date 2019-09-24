const ENV = process.env.REACT_APP_ENV;

const apisB2bPlateform = {
  dev: "http://localhost:4000",
  staging: "https://88ub06z9zb.execute-api.us-east-1.amazonaws.com/dev"
};
exports.apiB2bPlateform = apisB2bPlateform[ENV];
