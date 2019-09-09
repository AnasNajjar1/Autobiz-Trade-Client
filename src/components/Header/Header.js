import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/img/autobiz-marketplace.png";
import { Auth } from "aws-amplify";
import { Spinner } from 'reactstrap';


const Header = () => {
  const [username, setUsername] = useState("");

  Auth.currentUserInfo().then(user => {
    setUsername(user.username);
  });

  const signOut = async function() {
    Auth.signOut()
      .then(data => console.log(data))
      .catch(err => console.log(err));
    return;
  };

  return (
    <header>
      <Link to="/">
        <img alt="Autobiz Market" className="logo" src={logo} />
      </Link>
      <div className=" float-right mt-1 mr-2">

        { username && <span className="header-username mr-1">Hello {username}</span> || <Spinner className="mr-2" color="primary" size="sm" /> }

        

        <button
          class="btn btn-outline-success"
          type="submit"
          onClick={() => signOut()}
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
};

export default Header;
