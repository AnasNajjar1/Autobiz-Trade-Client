import React from "react";
import Translate from "../common/Translate";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <ul>
        <li>
          <Link to="/content/Cgu">
            <Translate code="terms_of_use"></Translate>
          </Link>
        </li>
        <li>
          <Link to="/content/Contact">
            <Translate code="contact_us"></Translate>
          </Link>
        </li>
        {/*         <li>
          <Link to="/content/SignIn">
            <Translate code="sign_in"></Translate>
          </Link>
        </li> */}
      </ul>
    </footer>
  );
};

export default Footer;
