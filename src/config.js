const ENV = process.env.REACT_APP_ENV;

const apisB2bPlateform = {
  local: "http://localhost:4000",
  dev: "https://stg72-api-trade.shakazoola.com",
  staging: "https://stg72-api-trade.shakazoola.com",
  ppr: "https://ppr-api-trade.autobiz.com",
  prod: "https://api-trade.autobiz.com",
};
exports.apiB2bPlateform = apisB2bPlateform[ENV];

exports.linkNewPassword = {
  fr: "https://www.autobiz-market.com/fr/mot-de-passe-oublie",
  it: "https://www.autobiz-market.com/it/password-dimenticata",
  pt: "https://www.autobiz-market.com/pt/forgotpassword",
  de: "https://www.autobiz-market.com/de/passwort-vergessen",
  nl: "https://www.autobiz-market.com/fr/mot-de-passe-oublie",
  en: "https://www.autobiz-market.com/fr/mot-de-passe-oublie",
  es: "https://www.sistemavo.es/has-olvidado-tu-contrasena",
};

const identityPoolIds = {
  local: "eu-west-1:6505e22b-5315-4260-80d8-65550855378f",
  dev: "eu-west-1:f9823600-f4b5-4759-889d-1b02c431135a",
  staging: "eu-west-1:f9823600-f4b5-4759-889d-1b02c431135a",
  ppr: "eu-west-1:78e88d38-c70d-4ca3-8438-408ddb4aede7",
  prod: "eu-west-1:e8cbcb21-aa17-41e1-bdfc-58c09cb55566",
};

exports.identityPoolId = identityPoolIds[ENV];

exports.region = "eu-west-1";

const staticContents = {
  local: "https://translations-host-dev.s3-eu-west-1.amazonaws.com/trade-app",
  dev: "https://translations-host-dev.s3-eu-west-1.amazonaws.com/trade-app",
  staging: "https://translations-host-dev.s3-eu-west-1.amazonaws.com/trade-app",
  ppr: "https://translations-host-prod.s3-eu-west-1.amazonaws.com/trade-app",
  prod: "https://translations-host-prod.s3-eu-west-1.amazonaws.com/trade-app",
};

const staticImages = {
  local: "https://b2b-pictures-prod.s3-eu-west-1.amazonaws.com",
  dev: "https://b2b-pictures-prod.s3-eu-west-1.amazonaws.com",
  staging: "https://b2b-pictures-prod.s3-eu-west-1.amazonaws.com",
  ppr: "https://b2b-pictures-prod.s3-eu-west-1.amazonaws.com",
  prod: "https://b2b-pictures-prod.s3-eu-west-1.amazonaws.com",
};

exports.staticContentUrl = staticContents[ENV];
exports.staticImagesUrl = staticImages[ENV];
exports.staticCache = "static-content";
exports.staticFiles = { locale: "locale.json" };

const contactEmails = {
  local: "stg-support-autobizTrade@autobiz.com",
  dev: "stg-support-autobizTrade@autobiz.com",
  staging: "stg-support-autobizTrade@autobiz.com",
  ppr: "stg-support-autobizTrade@autobiz.com",
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

exports.tradeHelpMail = "trade-help@autobiz.com";

const recaptchaAccess = {
  siteKey: "6LdS7mUaAAAAAI-qKAvB0WoIRnGfqfXaaBiOdSKr",
};
exports.recaptchaAccess = recaptchaAccess;

exports.didomiConfig = {
  apiKey: "cfad80dd-8fb6-43fa-a253-7156b52c2514",
  noticeId: "ATZaMPw2",
  config: {
    app: {
      name: "autobizTrade",
    },
  },
};

exports.zendeskConfig = {
  apiKey: "95647fe6-313e-48a9-97a8-e840b2c1a60e",
};
