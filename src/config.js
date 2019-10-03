const ENV = process.env.REACT_APP_ENV;

const apisB2bPlateform = {
  dev: "http://localhost:4000",
  staging: "https://sskra8rrdj.execute-api.eu-west-1.amazonaws.com/dev"
};
exports.apiB2bPlateform = apisB2bPlateform[ENV];

exports.link_new_password="https://www.autobiz-market.com/fr/mot-de-passe-oublie"
