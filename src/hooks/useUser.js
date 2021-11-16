import React, { useState, useEffect } from "react";
import { Auth } from "../providers/Auth";

export const useUser = () => {
  const [username, setUsername] = useState(null);
  const [usercountry, setUsercountry] = useState(null);
  const [autobizUserId, setAutobizUserId] = useState(null);

  const getUserDetails = async () => {
    try {
      const user = Auth.currentUser();
      setUsername(`${user.firstname} ${user.lastname}`);
      setUsercountry(user.country.toLowerCase());
      setAutobizUserId(`${user.country}_${user.userId}`);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return { username, usercountry, autobizUserId };
};
