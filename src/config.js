const ENV = process.env.REACT_APP_ENV;

const apisB2bPlateform = {
  dev: "http://localhost:4000",
  staging: "https://eob0vo3eq3.execute-api.eu-west-1.amazonaws.com/dev",
  prod : "https://ttqmvnrudk.execute-api.eu-west-1.amazonaws.com/prod"
};
exports.apiB2bPlateform = apisB2bPlateform[ENV];

exports.link_new_password =
"https://www.autobiz-market.com/fr/mot-de-passe-oublie";

const identityPoolIds = {
  dev: "eu-west-1:6505e22b-5315-4260-80d8-65550855378f",
  staging: "eu-west-1:6505e22b-5315-4260-80d8-65550855378f",
  prod : "eu-west-1:e8cbcb21-aa17-41e1-bdfc-58c09cb55566"
};

exports.identityPoolId = identityPoolIds[ENV];

exports.region = "eu-west-1"

const staticContents = {
  dev : "https://b2b-translate-dev.s3-eu-west-1.amazonaws.com",
  staging : "https://b2b-translate-dev.s3-eu-west-1.amazonaws.com",
  prod : "https://b2b-translate-prod.s3-eu-west-1.amazonaws.com"
}

exports.staticContentUrl=staticContents[ENV]
exports.staticCache = 'static-content'
exports.staticFiles = { locale : "locale.json" }

const contactEmails = {
  dev : "stg-support-autobizTrade@autobiz.com",
  staging : "stg-support-autobizTrade@autobiz.com",
  prod : "support-autobizTrade@autobiz.com"
}

exports.contactEmail = contactEmails[ENV]

exports.StaticFile = ["https://www.autobiz-market.com/bundles/autobizmarketmodenonconnecte/CGU/"]
