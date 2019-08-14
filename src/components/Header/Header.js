import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/img/autobiz-marketplace.png";
const Header = () => {
  return (
    <header>
      <Link to="/">
        <img alt="Autobiz Market" className="logo" src={logo} />
      </Link>
    </header>
  );
};

export default Header;
