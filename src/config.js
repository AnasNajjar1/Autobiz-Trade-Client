const ENV = process.env.REACT_APP_ENV;

const apisB2bPlateform = {
  dev: "http://localhost:4000",
  staging: "https://e0ufgxwv4c.execute-api.eu-west-1.amazonaws.com/staging",
  prod: "https://ttqmvnrudk.execute-api.eu-west-1.amazonaws.com/prod",
};
exports.apiB2bPlateform = apisB2bPlateform[ENV];

exports.link_new_password =
  "https://www.autobiz-market.com/fr/mot-de-passe-oublie";

const identityPoolIds = {
  dev: "eu-west-1:6505e22b-5315-4260-80d8-65550855378f",
  staging: "eu-west-1:f9823600-f4b5-4759-889d-1b02c431135a",
  prod: "eu-west-1:e8cbcb21-aa17-41e1-bdfc-58c09cb55566",
};

exports.identityPoolId = identityPoolIds[ENV];

exports.region = "eu-west-1";

const staticContents = {
  dev: "https://translations-host-dev.s3-eu-west-1.amazonaws.com/trade-app",
  staging: "https://translations-host-dev.s3-eu-west-1.amazonaws.com/trade-app",
  prod: "https://translations-host-prod.s3-eu-west-1.amazonaws.com/trade-app",
};

const staticImages = {
  dev: "https://b2b-pictures-prod.s3-eu-west-1.amazonaws.com",
  staging: "https://b2b-pictures-prod.s3-eu-west-1.amazonaws.com",
  prod: "https://b2b-pictures-prod.s3-eu-west-1.amazonaws.com",
};

exports.staticContentUrl = staticContents[ENV];
exports.staticImagesUrl = staticImages[ENV];
exports.staticCache = "static-content";
exports.staticFiles = { locale: "locale.json" };

const contactEmails = {
  dev: "stg-support-autobizTrade@autobiz.com",
  staging: "stg-support-autobizTrade@autobiz.com",
  prod: "support-autobizTrade@autobiz.com",
};

exports.contactEmail = contactEmails[ENV];

exports.pdfLang = {
  fr: "fr",
  de: "de",
  es: "es",
  default: "fr",
};

exports.tagManagerArgs = {
  gtmId: "GTM-K4DKLSR",
};
