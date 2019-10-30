const ENV = process.env.REACT_APP_ENV;

const apisB2bPlateform = {
  dev: "http://localhost:4000",
  staging: "https://eob0vo3eq3.execute-api.eu-west-1.amazonaws.com/dev"
};
exports.apiB2bPlateform = apisB2bPlateform[ENV];

exports.link_new_password =
  "https://www.autobiz-market.com/fr/mot-de-passe-oublie";

  const identityPoolIds = {
    dev: "eu-west-1:6505e22b-5315-4260-80d8-65550855378f",
    staging: "eu-west-1:6505e22b-5315-4260-80d8-65550855378f"
  };

  exports.identityPoolId = identityPoolIds[ENV];

  exports.region = "eu-west-1"