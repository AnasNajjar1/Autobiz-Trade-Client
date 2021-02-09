import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';

export const useUser = () => {
  const [username, setUsername] = useState(null);
  const [usercountry, setUsercountry] = useState(null);

  const getUserDetails = async () => {
    Auth.currentAuthenticatedUser({ bypassCache: false }).then(user => {
      setUsername(`${user.firstname} ${user.lastname}`);
      setUsercountry(user.country.toLowerCase());
    });
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return { username, usercountry };
};
