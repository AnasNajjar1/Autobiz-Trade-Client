import React from "react";
import Translate from "../common/Translate";
import { contactEmail, staticImagesUrl } from "../../config";
import { getCurrentLanguage } from "../../language-context";

const Footer = () => {
  let lang = getCurrentLanguage();

  return (
    <footer>
      <ul>
        <li>
          <a
            href={`${staticImagesUrl}/cgu/cgu-${lang.toLowerCase()}.pdf`}
            target="__blank"
          >
            <Translate code="terms_of_use" />
          </a>
        </li>
        <li>
          <a href={`mailto:${contactEmail}`}>
            <Translate code="contact_us" />
          </a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
