import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <ul>
        <li>
          <Link to="/content/Cgu">CGU</Link>
        </li>
        <li>
          <Link to="/content/Contact">Nous contacter</Link>
        </li>
        <li>
          <Link to="/content/SignIn">Devenir client</Link>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
