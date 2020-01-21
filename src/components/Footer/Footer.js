import React from "react";
import Translate from "../common/Translate";
import { Link } from "react-router-dom";
import { contactEmail, StaticFile, staticContentUrl } from "../../config"
import Cookies from "js-cookie";

const Footer = () => {
  let lang = Cookies.get("appLanguage");

  return (
    <footer>
      <ul>
        <li>
          <a href={`${staticContentUrl}/${lang}/terms_of_sales.pdf`} target="__blank"><Translate code="terms_of_sales" /></a>
        </li>
        <li>
          <a href={`${StaticFile}${lang.toUpperCase()}/ConditionsGenerales.pdf`} target="__blank"><Translate code="terms_of_use" /></a>
        </li>
        <li>
          <a href={`mailto:${contactEmail}`}><Translate code="contact_us" /></a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
