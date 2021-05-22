import React from "react";
import { Link } from "react-router-dom";

import "./HomePage.css";
import {HOMEPAGE_IMG} from "../../helpers/resources";

class HomePage extends React.Component {
  render() {
    return (
      <div className="homePage">
        <div className="message">
          <img src={HOMEPAGE_IMG} />
          <h5>Online Voting System</h5>
          <p>An easier way to organize elections....</p>
          <div className="actions">
            <Link to="/login">
              <button className="btn-small">Login</button>
            </Link>
            {/* <Link to="/signup/voter">
              <button className="btn-small">Signup as Voter</button>
            </Link>
            <Link to="/signup/candidate">
              <button className="btn-small">Signup as Candidate</button>
            </Link> */}
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
