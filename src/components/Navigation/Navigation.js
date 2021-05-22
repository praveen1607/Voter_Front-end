import React from "react";
import { Link } from "react-router-dom";

import "./Navigation.css";

const Navigation = () => {
  const [userInfo, setUserInfo] = React.useState(null);

  React.useEffect(() => {
    if (JSON.parse(localStorage.getItem("userDetails"))) {
      setUserInfo(JSON.parse(localStorage.getItem("userDetails")));
    }
  }, []);

  const logOut = () => {
    localStorage.removeItem("userDetails");
  };

  return (
    <nav>
      {userInfo && (
        <div class="nav-wrapper">
          <Link to="/dashboard">
            <div class="brand-logo"><h5>Online Voting System</h5></div>
          </Link>
          <ul class="right hide-on-med-and-down">
            {userInfo.role === "admin" && (
              <>
                <li>
                  <Link to="/party">
                    Parties
                  </Link>
                </li>
                <li>
                  <Link to="/election">
                    Election
                  </Link>
                </li>
                <li>
                  <Link to="/list/voters">
                    Voters
                  </Link>
                </li>
                <li>
                  <Link to="/list/candidates">
                    Candidates
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link to="/" onClick={logOut}>
                Logout
              </Link>
            </li>
            {/* <li><a href="badges.html">Components</a></li> */}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
