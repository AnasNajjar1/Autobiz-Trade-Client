import React from "react";
import { Helmet } from "react-helmet";
import { t } from "../../components/common/Translate";
const HelmetComponent = ({ language }) => {
  return (
    <Helmet
      htmlAttributes={{ lang: language }}
      title={t("title_meta_data")}
      meta={[
        {
          name: `description`,
          content: t("description_meta_data"),
        },
      ]}
      link={[
        {
          rel: "canonical",
          href: `https://trade.autobiz.com/${language}/login`,
        },
        {
          rel: "alternate",
          href: "https://trade.autobiz.com/fr/login",
          hrefLang: "fr-FR",
        },
        {
          rel: "alternate",
          href: "https://trade.autobiz.com/es/login",
          hrefLang: "es-ES",
        },
        {
          rel: "alternate",
          href: "https://trade.autobiz.com/it/login",
          hrefLang: "it-IT",
        },
        {
          rel: "alternate",
          href: "https://trade.autobiz.com/pt/login",
          hrefLang: "pt-PT",
        },
        {
          rel: "alternate",
          href: "https://trade.autobiz.com/en/login",
          hrefLang: "en-EN",
        },
        {
          rel: "alternate",
          href: "https://trade.autobiz.com/de/login",
          hrefLang: "de-DE",
        },
      ]}
    ></Helmet>
  );
};
export default HelmetComponent;
