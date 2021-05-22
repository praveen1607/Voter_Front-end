import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


import "./App.css";

import Navigation from "./components/Navigation/Navigation";

import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import HomePage from "./pages/HomePage/HomePage";
import Dashboard from "./pages/Dashboard/Dashboard";
import AddElection from "./pages/AddElection/AddElection";
import Voters from "./pages/List/Voters";
import Candidates from "./pages/List/Candidates";
import Party from "./pages/Party/Party";
import Election from "./pages/Election/Election";
import ElectionStats from "./pages/ElectionStats/ElectionStats";

function App() {
  useEffect(() => {});

  return (
    <div className="App">
      <Router>
        <div>
          {/* navigation */}
        </div>
        <Switch>
          {/* <Route exact path="/" component={HomePage} /> */}
          <Route exact path="/" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <div>
            <Navigation />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/add/:userRole" component={Signup} />
            <Route exact path="/addElection" component={AddElection} />
            <Route exact path="/list/voters" component={Voters} />
            <Route exact path="/list/candidates" component={Candidates} />
            <Route exact path="/party" component={Party} />
            <Route exact path="/election" component={Election} />
            <Route exact path="/electionStats/:electionID" component={ElectionStats} />
            {/* <Route exact path="/edit/:userRole/:collegeID" component={Signup} /> */}
          </div>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
