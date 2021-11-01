import React, { useState } from "react";
import useEffect from "./useEffect";

const useUser = (userId) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    getUserApi(userId).then((data) => setUser(data));
  }, [userId]);
  return user;
};

function Profile({ userId }) {
  const user = useUser(userId);
}
