// src/components/PrivateRoute.js

import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import axios from "axios";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:9000/auth/me", { withCredentials: true })
    .then(() => setIsAuth(true))
      .catch(() => setIsAuth(false));
  }, [rest.location]); // Verif in any route changing

  if (isAuth === null) {
    return <div>Loading...</div>;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuth ? <Component {...props} /> : <Redirect to="/auth/login" />
      }
    />
  );
};

export default PrivateRoute;
