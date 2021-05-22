import React from "react";
import M from "materialize-css";
import {Link} from "react-router-dom";
import "materialize-css/dist/css/materialize.min.css";
import axios from "axios";
import moment from "moment";

import "./Election.css";

class Election extends React.Component {
  state = {
    isLoading: false,
    elections: [],
    candidates: [],
    parties: [],
    nominees: [],
    addCandidate: false,
    selectedElection: null,
    selectedCandidate: "",
    selectedParty: "",
  };

  componentDidMount() {
    this.getAllData();
  }

  getAllData = () => {
    this.getElections();
    this.getParties();
    // this.getCandidates();
  };

  getElections = () => {
    this.setState({ isLoading: false });
    fetch("http://localhost:8080/api/v1/election/view/all")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.electionsList);
        this.setState({ elections: data.electionsList, isLoading: false });
        M.toast({ html: data.message });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  getCandidates = (branch) => {
    this.setState({ isLoading: true });
    fetch("http://localhost:8080/api/v1/candidate/getAll")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        this.setState({ candidates: data.candidates.filter(candidate=>candidate.branch.includes(branch)), isLoading: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  getParties = () => {
    this.setState({ isLoading: false });
    fetch("http://localhost:8080/api/v1/party/getAll")
      .then((res) => res.json())
      .then((data) => {
        this.setState({ parties: data.partyList, isLoading: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  getNominees = (election) => {
    this.setState({ isLoading: true });
    const data = {
      electionID: election._id
    };
    fetch("http://localhost:8080/api/v1/admin/get/nominees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        M.toast({ html: data.message });
        this.setState({
          isLoading: false,
          newPartyName: "",
          newPartyShortForm: "",
          addCandidate: true,
          selectedElection: election,
          nominees: data.nominees,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  viewElection = (election) => {
    console.log(election);
    this.getCandidates(election.location);
    this.getNominees(election);
  };

  addCandidateToElection = async () => {
    console.log("addcandidatetoelection");
    const {
      selectedCandidate,
      selectedParty,
      selectedElection,
    } = this.state;
    console.log(selectedCandidate,selectedParty,selectedElection);
    if (selectedCandidate === "" || selectedParty === "") {
      M.toast({ html: "Please select candidate and party both" });
    } else {
      const data = {
        party: selectedParty,
        candidate: selectedCandidate,
        election: selectedElection._id,
      };
      try{
        this.setState({ isLoading: true });
        const response = await axios.post('http://localhost:8080/api/v1/admin/add/nominee',data);
        if (response.data.isError === true) {
          this.setState({isLoading:false});
          M.toast({ html: response.data.error });
        } else {
          // M.toast({ html: data.message });
          this.setState({ selectedCandidate: "", selectedParty: "",addCandidate:false,isLoading:false});
          this.getAllData();
          this.getNominees(this.state.selectedElection);
        }

      }catch(err){
        console.log(err);
        this.setState({isLoading:false});
      }
        
    }
  };

  deleteElection = async (election) => {
    console.log(election);
    const data={
      electionID:election._id
    };
    this.getNominees(election);
    try{
      this.setState({isLoading:true});
      const response=await axios.post("http://localhost:8080/api/v1/admin/get/nominees",{
        electionID: election._id,
      })
      const nomineesList=response.data.nominees;
      nomineesList.forEach(nominee=>{
        this.deleteNominee(nominee._id);
      });
      await axios.post("http://localhost:8080/api/v1/election/delete",data);
      this.getElections();
    }catch(err){
      console.log(err);
      this.setState({isLoading:false});
    }
  };

  deleteNominee = async (nomineeID) => {
    const data = {
      nomineeId: nomineeID,
    };
    try {
      this.setState({ isLoading: true });
      const url = `http://localhost:8080/api/v1/admin/delete`;
      const response = await axios.post(url, data);
      this.setState({ isLoading: false });
      this.getNominees(this.state.selectedElection);
      // if (response.status === 204) {
      //   M.toast({ html: "Nominee deleted successfully" });
        
      // }
    } catch (err) {
      console.error(err);
      this.setState({ isLoading: false });
    }
  };

  render() {
    return (
      <div className="Election">
        <>
          {this.state.isLoading ? (
            <>Loading...</>
          ) : (
            <div className="row">
              <div className="col s4">
                <h5>
                  <u>Elections List</u>
                  <span
                    class="new badge"
                    data-badge-caption={`${this.state.elections.length} elections`}
                  ></span>
                </h5>
                <Link to="/addElection"><button className="waves-effect btn">ADD ELECTION</button></Link>
                <div className="ListCollection">
                  <ul className="collection">
                    {this.state.elections.map((election) => {
                      return (
                        <li
                          className="collection-item avatar"
                          key={election._id}
                        >
                          <i className="material-icons circle green">
                            local_play
                          </i>
                          <span className="title">
                            {election.location}
                            {" ( "}
                            {election.position}
                            {" ) "}
                            <i
                              className="material-icons"
                              style={{ color: "red", float: "right" }}
                              onClick={() => {
                                this.deleteElection(election);
                              }}
                            >
                              delete
                            </i>
                            <i
                              className="material-icons"
                              style={{ float: "right" }}
                              onClick={() => {
                                this.viewElection(election);
                              }}
                            >
                              remove_red_eye
                            </i>
                          </span>
                          <br/>
                          <div>
                            <strong>From:</strong> {moment(election.startTime).format("MMMM Do YYYY, h:mm:ss a")} 
                            
                          </div>
                          <div>
                          <strong>To:</strong> {moment(election.endTime).format("MMMM Do YYYY, h:mm:ss a")}
                          </div>
                          <Link to={`/electionStats/${election._id}`} className="btn">
                              VIEW STATS
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div className="col s1"></div>
              <div className="col s7">
                <div>
                  {this.state.addCandidate ? (
                    <>
                      <h6><b><u>Candidate List</u></b></h6>
                      {/* <div className="input-field">
                        <select
                          className="browser-default"
                          onChange={(e) =>
                            this.setState({ selectedCandidate: e.target.value })
                          }
                          value={this.state.selectedCandidate}
                        >
                          <option value="" disabled selected>
                            Choose your option
                          </option>

                          {this.state.candidates.map((candidate, index) => {
                            return (
                              <option key={index} value={candidate._id}>
                                {candidate.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="input-field">
                        <select
                          className="browser-default"
                          onChange={(e) =>
                            this.setState({ selectedParty: e.target.value })
                          }
                          value={this.state.selectedParty}
                        >
                          <option value="" disabled selected>
                            Choose your option
                          </option>

                          {this.state.parties.map((party, index) => {
                            return (
                              <option key={index} value={party._id}>
                                {party.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <button
                        className="waves-effect btn"
                        onClick={this.addCandidateToElection}
                      >
                        Add Candidate
                      </button> */}
                      <div>
                        {/* {this.state.nominees.length && ( */}
                          <ul className="CandidateCollection">
                            {this.state.nominees.map((nominee, index) => {
                              return (
                                <li
                                  className="candidateInfo"
                                  key={index}
                                ><b>
                                  {nominee.candidate.name}
                                  {", "}
                                  {nominee.party.name}
                                  </b>
                                  <i
                                    className="material-icons"
                                    style={{ color: "red", float: "right" }}
                                    onClick={() => {
                                      this.deleteNominee(nominee._id);
                                    }}
                                  >
                                    delete
                                  </i>
                                </li>
                              );
                            })}
                          </ul>
                        {/* )} */}
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      </div>
    );
  }
}

export default Election;
