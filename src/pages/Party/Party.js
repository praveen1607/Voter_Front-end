import React, { Component } from "react";
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import CLUB_IMG from "../../helpers/Party.png"
import STUDENT_CLUB_IMG from "../../helpers/student_club.png"
import "./Party.css";
import axios from "axios";

class Party extends Component {
  state = {
    parties: [],
    isLoading: false,
    newPartyName: "",
    newPartyShortForm: "",
    editParty:false,
    showInfo:false,
    editPartyInfo:null,
    candidateList:null,
  };

  componentDidMount() {
    this.getParties();
  }

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

  addParty = (e) => {
    e.preventDefault();
    this.setState({ isLoading: true });
    const data = {
      name: this.state.newPartyName,
      shortForm: this.state.newPartyShortForm,
    };
    fetch("http://localhost:8080/api/v1/party/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => {          
        this.setState({isLoading:false});
        if (data.isError ===true) {
            // M.toast({ html: data.error });
            toast.error(data.error, {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
        } else {
            // M.toast({ html: data.message });
            toast.success(data.message, {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });

            this.setState({newPartyName:"",newPartyShortForm:""})
            this.getParties();
        }
    })
    .catch((err) => {
        console.log(err);
        this.setState({isLoading:false});
    });
  };

  editParty= (partyInfo)=>{
    this.setState({editParty:true,editPartyInfo:partyInfo});
  }

  editPartyRequest=async(e)=>{
    e.preventDefault();
    console.log(this.state.editPartyInfo);
    const {name,shortForm}=this.state.editPartyInfo;
    const data={name,shortForm};
    try{
      const url=`http://localhost:8080/api/v1/party/update/${this.state.editPartyInfo._id}`;
      this.setState({isLoading:true});
      const response=await axios.post(url,data);
      if(!response.data.isError){
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        this.setState({editParty:false,editPartyInfo:null});
        this.getParties();
      }
      this.setState({isLoading:false});
    }catch(err){
      console.log(err);
      this.setState({isLoading:false});
    }
    
  }

  viewPartyCandidates=async(partyID)=>{
    const url=`http://localhost:8080/api/v1/candidate/get/party/${partyID}`;
    try{
      this.setState({isLoading:true});
      const response=await axios.get(url);
      if(!response.data.isError){
        console.log(response.data.candidates);
        if(!response.data.candidates.length){
          toast.warning("No candidates for the selected party", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
          this.setState({showInfo:false})
        }else{
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });  
          this.setState({showInfo:true,candidateList:response.data.candidates});
        }
      }
      this.setState({isLoading:false});
    }catch(err){
      console.log(err);
      this.setState({isLoading:false});
    }
  }

  deleteParty = (partyInfo) => {
    this.setState({ isLoading: true });
    const data = {
      name: partyInfo.name,
    };
    fetch("http://localhost:8080/api/v1/party/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      .then((response) => response.json())
      .then((data) => {          
          this.setState({isLoading:false});
          if (data.isError ===true) {
              M.toast({ html: data.error });
          } else {
              M.toast({ html: data.message });
              this.setState({newPartyName:"",newPartyShortForm:""})
              this.getParties();
          }
      })
      .catch((err) => {
          console.log(err);
          this.setState({isLoading:false});
      });
  };

  render() {
    return (
      <div className="Party">
        <>
          {this.state.isLoading ? (
            <>Loading...</>
          ) : (
            <div className="row">
              <div className="col s4">
                <h5>
                  <u>Parties List</u>
                  <span
                    class="new badge"
                    data-badge-caption={`${this.state.parties.length} parties`}
                  ></span>
                </h5>
                <div className="PartyCollection">
                  {/* <ul class="collection"> */}
                    {this.state.parties.map((party) => {
                      return (
                        <div className="partyInfo" key={party._id}>
                          <span className="title"><b>
                            {party.name}
                            {" ( "}
                            {party.shortForm}
                            {" ) "}
                            </b>
                            <i
                              className="material-icons"
                              style={{  float: "right" }}
                              onClick={() => {
                                this.deleteParty(party);
                              }}
                            >
                              delete
                            </i>
                            <i className="material-icons" onClick={()=>this.editParty(party)} style={{float:"right",margin:"0 1rem"}}>
                              edit
                            </i>
                            <i className="material-icons" style={{float:"right"}} onClick={()=>this.viewPartyCandidates(party._id)}>
                              remove_red_eye
                            </i>
                          </span>
                        </div>
                      );
                    })}
                  {/* </ul> */}
                </div>
                {
                  (this.state.editParty || this.state.showInfo) ? (
                  <button className="btn waves-effect" onClick={()=>this.setState({editParty:false,showInfo:false})}>
                    ADD PARTY
                  </button>):<></>
                }    
              </div>
              <div className="col s2"></div>
              <div className="col s5">
                {
                  this.state.showInfo ? (
                    <>
                      <div style={{textAlign:"center"}}>
                      <h5><u>Candidates' List</u></h5>
                      <img src={STUDENT_CLUB_IMG}  className="partyImg" />
                      <div className="CandidateCollection">
                        {
                          this.state.candidateList.map((candidate)=>{
                            return (<div className="candidateInfo" key={candidate._id}>
                             <h5><b>{candidate.name}</b></h5>
                              <h6><b>{candidate.branch}{" , "}{candidate.collegeID}</b></h6>
                            </div>)
                          })
                        }
                      </div>
                      </div>
                    </>
                  ):(
                    <form onSubmit={this.state.editParty?this.editPartyRequest:this.addParty} className="partyAdd">
                    <img src={CLUB_IMG} className="partyImg"/>
                    <div className="row">
                      <label className="active" htmlFor="partyName"><b>
                        Party Name <span className="required">*</span></b>
                      </label>
                      <input
                        placeholder="Some Name"
                        autoComplete="off"
                        id="partyName"
                        type="text"
                        className="validate"
                        value={this.state.editParty?this.state.editPartyInfo.name:this.state.newPartyName}
                        onChange={({ target: { value } }) =>{
                          if(this.state.editParty){
                            this.setState((prevState)=>{
                              let editPartyInfo={...this.state.editPartyInfo};
                              editPartyInfo["name"]=value;
                              return {...prevState,editPartyInfo:editPartyInfo}
                            })
                          }else{
                            this.setState({ newPartyName: value })
                          }
                        }
                        }
                      />
                    </div>
                    <div className="row">
                      <label className="active" htmlFor="partyName"><b>
                        Short Form <span className="required">*</span></b>
                      </label>
                      <input
                        placeholder="SN"
                        autoComplete="off"
                        id="partyName"
                        type="text"
                        className="validate"
                        value={this.state.editParty?this.state.editPartyInfo.shortForm:this.state.newPartyShortForm}
                        onChange={({ target: { value } }) =>{
                          if(this.state.editParty){
                            this.setState((prevState)=>{
                              let editPartyInfo={...this.state.editPartyInfo};
                              editPartyInfo["shortForm"]=value;
                              return {...prevState,editPartyInfo:editPartyInfo}
                            })
                          }else{
                            this.setState({ newPartyShortForm: value })
                          }
                        }
                        }
                      />
                    </div>
                    <button className="btn waves-effect" type="submit">
                      {this.state.editParty?"Edit Party":"Add Party"}
                      {/* <i className="medium material-icons">person</i> */}
                    </button>
                  </form>  
                  )
                }
              </div>
              <div className="col s1"></div>
            </div>
          )}
        </>
        <ToastContainer />
      </div>
    );
  }
}

export default Party;
