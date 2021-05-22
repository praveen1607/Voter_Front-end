import React from "react";
import axios from "axios";
import moment from "moment";
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import college from "../../helpers/college.jfif";
import vote from "../../helpers/Vote.jpg";
import "./Dashboard.css";

let instance;
class Dashboard extends React.Component {
  state = {
    userInfo: null,
    elections: null,
    nominees: [],
    canVote: false,
    seeNomineesList: false,
    isLoading: false,
    selectedNominee: null,
    voteInfo: null,
    approvalCandidates: [],
    approvalNominations:[],
    partyList:null,
    candidateList:null,
    upcomingElectionsList:null,
    upcomingElectionsForContestingList:null,
    showElectionInModal:true,
    selectedPartyForNomination:false,
  };

  componentDidMount() {
    const options = {
      onOpenStart: () => {
        // this.setCurrentUser();
        console.log("Open Start");
      },
      onOpenEnd: () => {
        console.log("Open End");
      },
      onCloseStart: () => {
        console.log("Close Start");
      },
      onCloseEnd: () => {
        console.log("Close End");
      },
      inDuration: 250,
      outDuration: 250,
      opacity: 0.5,
      dismissible: false,
      startingTop: "4%",
      endingTop: "10%",
    };
    M.Modal.init(this.Modal, options);
    instance = M.Modal.getInstance(this.Modal);
    let userInfo = JSON.parse(localStorage.getItem("userDetails"));
    this.setState({ userInfo }, () => {
      this.fetchAllParties();
      this.fetchCandidates();
      this.findUpComingElections();
    if (this.state.userInfo.role !== "admin") {
        this.findElections();
      } else {
        this.fetchCandidatesForApproval();
        this.fetchNominationsForApproval();
      }

      if(this.state.userInfo["role"]==="candidate"){
        this.fetchUpcomingElectionsForContesting();
      }
    });
  }

  findElections = async () => {
    const data = {
      date: new Date(),
      location: this.state.userInfo.branch,
    };
    this.setState({ isLoading: false });
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/election/find",
        data
      );
      this.setState({ isLoading: false });
      if (response.data.isError) {
        M.toast({ html: response.data.error });
      } else {
        M.toast({ html: response.data.message });
        this.setState({ elections: response.data.elections });
      }
    } catch (err) {
      console.error(err);
      this.setState({ isLoading: false });
    }
  };

  fetchCandidatesForApproval = async () => {
    this.setState({ isLoading: false });
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/candidate/get/new"
      );
      this.setState({ isLoading: false });
      if (!response.data.isError) {
        if (response.data.newCandidates.length) {
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          this.setState({ approvalCandidates: response.data.newCandidates });
        } else {
          toast.warning("No more candidates for approval", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }
    } catch (err) {
      console.error(err);
      this.setState({ isLoading: false });
    }
  };

  fetchNominationsForApproval=async()=>{
    this.setState({ isLoading: false });
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/admin/get/nominees/new"
      );
      this.setState({ isLoading: false });
      if (!response.data.isError) {
        if (response.data.newNominees.length) {
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          this.setState({ approvalNominations: response.data.newNominees });
        } else {
          toast.warning("No new nominations for approval", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }
    } catch (err) {
      console.error(err);
      this.setState({ isLoading: false });
    }
  }

  viewElection = async (election) => {
    const data = {
      election: election._id,
    };
    this.setState({ isLoading: true });
    try {
      const statusCheck = {
        election: election._id,
        collegeId: this.state.userInfo.collegeID,
      };
      const voteStatus = await axios.post(
        "http://localhost:8080/api/v1/vote/checkStatus",
        statusCheck
      );
      this.setState({ isLoading: false });
      if (voteStatus.data.isError) {
        M.toast({ html: voteStatus.data.error });
      } else {
        this.setState({ isLoading: true });
        const response = await axios.post(
          "http://localhost:8080/api/v1/vote/getAll/candidates",
          data
        );
        // this.setState({ isLoading: false });

        M.toast({ html: response.data.message });
        this.setState({
          isLoading: false,
          nominees: response.data.nominees,
          seeNomineesList: true,
        });
      }
    } catch (err) {
      console.log(err);
      this.setState({ isLoading: false });
    }
  };

  castVote = async () => {
    const data = this.state.voteInfo;
    this.setState({ isLoading: true });
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/vote/cast",
        data
      );
      this.setState({ isLoading: false });
      if (response.data.isError) {
        M.toast({ html: response.data.error });
        this.setState({});
      } else {
        M.toast({ html: response.data.message });
        this.setState({ voteInfo: null, selectedNominee: null, nominees: [] });
      }
    } catch (err) {
      console.error(err);
      this.setState({ isLoading: false });
    }
  };

  approveCandidate = async (collegeID) => {
    this.setState({ isLoading: true });
    try {
      const response = await axios.post("http://localhost:8080/api/v1/update", {
        collegeID,
        approved: true,
      });
      this.setState({ isLoading: false });
      if (!response.data.isError) {
        toast.success("Candidate approval successfull", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        this.setState({
          approvalCandidates: this.state.approvalCandidates.filter(
            (candidate) => candidate.collegeID !== collegeID
          ),
        });
        // this.fetchCandidatesForApproval();
      }
    } catch (err) {
      console.error(err);
      this.setState({ isLoading: false });
    }
  };

  disapproveCandidate=async(collegeID)=>{
    this.setState({ isLoading: true });
    try {
      const response = await axios.post("http://localhost:8080/api/v1/update", {
        collegeID,
        approved: false,
        role:"voter"
      });
      this.setState({ isLoading: false });
      if (!response.data.isError) {
        toast.success("Candidate's disapproval successfull", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        this.setState({
          approvalCandidates: this.state.approvalCandidates.filter(
            (candidate) => candidate.collegeID !== collegeID
          ),
        });
        // this.fetchCandidatesForApproval();
      }
    } catch (err) {
      console.error(err);
      this.setState({ isLoading: false });
    }
  }

  applyForCandidatureHelper = async () => {
    this.setState({ isLoading: true });
    try {
      const url = `http://localhost:8080/api/v1/update`;
      const response = await axios.post(url, {
        collegeID: this.state.userInfo["collegeID"],
        role: "candidate",
        approved: false,
      });
      this.setState({ isLoading: false });
      if (!response.data.isError) {
        toast.success("Applied for candidature successfully", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        this.setState({
          userInfo: {
            ...this.state.userInfo,
            role: "candidate",
            approved: false,
          },
        });
      }
    } catch (err) {
      console.error(err);
      this.setState({ isLoading: false });
    }
  };

  //information for the dashbord view

  fetchAllParties=async ()=>{
    this.setState({isLoading:false});
    try{
      const url=`http://localhost:8080/api/v1/party/getAll`;
      const response=await axios.get(url);
      if(!response.data.isError && response.data.partyList.length){
        //set selectedPartyForNomination
        this.setState({partyList:response.data.partyList,selectedPartyForNomination:response.data.partyList[0]._id});
      }else{
        // 
        this.setState({partyList:response.data.partyList});
      }
      this.setState({isLoading:false});
    }catch(err){
      console.error(err);
      this.setState({isLoading:false});
    }
  }

  fetchCandidates=async ()=>{
    this.setState({isLoading:false});
    try{
      const response = await axios.get("http://localhost:8080/api/v1/candidate/get/approved");
      if(!response.data.isError){
        // console.log(response.data.message);
        this.setState({candidateList:response.data.approvedCandidates});
      }
      this.setState({isLoading:false});
    }catch(err){
      console.error(err);
      this.setState({isLoading:false});
    }
  }

  findUpComingElections=async()=>{
    this.setState({isLoading:true});
    try{
      const response=await axios.post("http://localhost:8080/api/v1/election/find/upcoming",{date:new Date()});
      if(!response.data.isError){
        this.setState({upcomingElectionsList:response.data.upcomingElections});
      }
      this.setState({isLoading:false});
    }catch(err){
      console.error(err);
      this.setState({isLoading:false});
    }
  }

  fetchUpcomingElectionsForContesting=async()=>{
    this.setState({isLoading:true});
    try{
      const response=await axios.post("http://localhost:8080/api/v1/election/find/upcoming/contest",{date:new Date(),location:this.state.userInfo["branch"]});
      if(!response.data.isError){
        this.setState({upcomingElectionsForContestingList:response.data.upcomingElections});
      }
      this.setState({isLoading:false});
    }catch(err){
      console.error(err);
      this.setState({isLoading:false});
    }
  }

  applyForNomination=async(electionID)=>{
    const data={
      party:this.state.selectedPartyForNomination,
      election:electionID,
      candidate:this.state.userInfo._id,
      approved:false
    }
    this.setState({isLoading:true});
    try{
      const response = await axios.post('http://localhost:8080/api/v1/admin/add/nominee',data);
      this.setState({isLoading:false});
      if(response.data.isError){
        toast.error(response.data.error, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }else{
        toast.success("Applied for contesting in election",{
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        setTimeout(()=>{
          window.location.reload()
        },2000)
      }
    }catch(err){
      console.error(err);
      this.setState({isLoading:false});
    }
    console.log(data);
  }

  approveNomination=async(nomineeID)=>{
    this.setState({isLoading:true});
    try{
      const url=`http://localhost:8080/api/v1/admin/nominee/approve/${nomineeID}`;
      const response=await axios.post(url,{approved:true});
      this.setState({isLoading:false});
      if(!response.data.isError){
        toast.success(response.data.message,{
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // this.setState({approvalNominations:this.state.approvalNominations.filter((nomination)=>nomination._id===nomineeID)});
        setTimeout(()=>{
          window.location.reload()
        },2000)
      }      
    }catch(err){
      console.error(err);
      this.setState({isLoading:false});
    }
  }

  disapproveNomination=async(nomineeID)=>{
    this.setState({isLoading:true});
    try{
      const url=`http://localhost:8080/api/v1/admin/nominee/disapprove`;
      const response=await axios.post(url,{approved:true});
      this.setState({isLoading:false});
      if(!response.data.isError){
        toast.success(response.data.message,{
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // this.setState({approvalNominations:this.state.approvalNominations.filter((nomination)=>nomination._id===nomineeID)});
        setTimeout(()=>{
          window.location.reload()
        },2000)
      }      
    }catch(err){
      console.error(err);
      this.setState({isLoading:false});
    }
  }

  render() {
    return (
      <div className="Dashboard">
        <>
          {
            this.state.isLoading ? <>Loading...</> :(
              <>
                <div className="row">   
                    {
                      this.state.userInfo && 2021-parseInt(new Date(this.state.userInfo["dob"]).getFullYear())>=18 ? (
                        <>
                          <div className="col s8">
                            {this.state.userInfo && (
                              <>
                                <h5>
                                  Welcome to the Dashboard{" "}
                                  {this.state.userInfo.name}
                                </h5>
                              </>
                            )}
                            {/* dashboard info starts */}
                            <div className="row">
                              <div className="col s8">
                                <img src={vote} style={{ width: "100%",height:"50vh" }} />
                              </div>
                              
                              <div className="col s4">
                                <h6 style={{color:"red",fontFamily:"timesnewroman"}}><u>UPCOMING ELECTIONS LIST</u></h6>
                                <marquee direction="down" style={{height:"100%"}}>
                                  <div style={{display:"flex",flexDirection:"column"}}>
                                  {
                                      this.state.upcomingElectionsList && this.state.upcomingElectionsList.length? (
                                        this.state.upcomingElectionsList.map((election,index)=>{
                                          return (
                                            <div className="candidateMarquee" key={index} style={{border:"2px solid #ccc",padding:"0.5rem 0.75rem",margin:"0.1rem 1rem",backgroundColor:"#0076ce"}}>
                                              <p><b>{election["location"]}{" ( "}{election["position"]}{" ) "}</b></p>
                                              <p style={{fontSize:"x-small"}}><b>{moment(election.startTime).format("MMMM Do YYYY, h:mm:ss a")}{" - "}{moment(election.endTime).format("MMMM Do YYYY, h:mm:ss a")}</b></p>
                                            </div>
                                          )
                                        })
                                      ):<b>No upcoming elections....</b>
                                    }
                                  </div>
                                </marquee>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col s8">
                                <h6 style={{color:"red",fontFamily:"timesnewroman"}}><u>PARTY LIST</u></h6>
                                <marquee>
                                  <div style={{display:"flex"}}>
                                    {
                                      this.state.partyList && this.state.partyList.length? (
                                        this.state.partyList.map((party,index)=>{
                                          return (
                                            <div className="partyMarquee" key={index} style={{border:"2px solid #ccc",padding:"0.5rem 0.75rem",margin:"0.1rem 1rem",backgroundColor:"rgba(226, 240, 203, 0.575)"}}>
                                              <p><b>{party["name"]}{" ( "}{party["shortForm"]}{" ) "}</b></p>
                                            </div>
                                          )
                                        })
                                      ):<>No parties available</>
                                    }
                                  </div>
                                </marquee>
                                <h6 style={{color:"red",fontFamily:"timesnewroman"}}><u>CANDIDATE LIST</u></h6>
                                <marquee>
                                  <div style={{display:"flex"}}>
                                    {
                                      this.state.candidateList && this.state.candidateList.length? (
                                        this.state.candidateList.map((candidate,index)=>{
                                          return (
                                            <div className="candidateMarquee" key={index} style={{border:"2px solid #ccc",padding:"0.5rem 0.75rem",margin:"0.1rem 1rem",backgroundColor:"rgba(226, 240, 203, 0.575)"}}>
                                              <p><b>{candidate["name"]}{" ( "}{candidate["collegeID"]}{" ) "}</b></p>
                                              <p><b>{candidate["branch"]}{" , "}{candidate["gender"]}</b></p>
                                            </div>
                                          )
                                        })
                                      ):<>No candidates available</>
                                    }
                                  </div>
                                </marquee>
                              </div>
                              <div className="col s4"></div>
                              <div className="col s4"></div>
                            </div>
                            {/* dashboard info ends */}
                          </div>
                          <div className="col s4">
                             {
                               this.state.userInfo["role"]==="admin" ? (
                                <>
                                  <div className="approvalCandidatesList">
                                    <h5 style={{color:"red",fontFamily:"timesnewroman"}}>
                                      <u>Approval Candidates List</u>
                                    </h5>
                                    {this.state.approvalCandidates.length ? (
                                      this.state.approvalCandidates.map(
                                        (candidate, index) => {
                                          return (
                                            <div
                                              className="approvalCandidateInfo"
                                              key={index}
                                            >
                                              <h6 style={{color:"white"}}><b>
                                                {candidate.name}
                                                {" , "}
                                                {candidate.branch}
                                                </b>
                                              </h6>
                                              <button
                                                className="btn standardbutton"
                                                onClick={() =>
                                                  this.approveCandidate(
                                                    candidate.collegeID
                                                  )
                                                }
                                              >
                                                APPROVE
                                              </button>
                                              <button
                                                className="btn standardbutton"
                                                onClick={() =>
                                                  this.disapproveCandidate(
                                                    candidate.collegeID
                                                  )
                                                }
                                              >
                                                DISAPPROVE
                                              </button>
                                            </div>
                                          );
                                        }
                                      )
                                    ) : (
                                      <>
                                        <h6><b>No new candidates registered...</b></h6>
                                      </>
                                    )}
                                  </div>
                                  <div className="approvalNominationsList">
                                    <h5 style={{color:"red",fontFamily:"timesnewroman"}}>
                                      <u>Approval Nominations List</u>
                                    </h5>
                                    {this.state.approvalNominations.length ? (
                                      this.state.approvalNominations.map(
                                        (nomination, index) => {
                                          return (
                                            <div
                                              className="approvalCandidateInfo"
                                              key={index}
                                            >
                                              <h6 style={{color:"white"}}><b>
                                                {nomination.candidate.name}
                                                {" , "}
                                                {nomination.candidate.branch}
                                                </b>
                                              </h6>
                                              <h6>
                                              <b>
                                                {nomination.election.position}{" , "}{nomination.party.name}
                                                </b>
                                              </h6>
                                              <button
                                                className="btn standardbutton"
                                                onClick={() =>
                                                  this.approveNomination(
                                                    nomination._id
                                                  )
                                                }
                                              >
                                                APPROVE
                                              </button>
                                              <button
                                                className="btn standardbutton"
                                                onClick={() =>
                                                  this.disapproveNomination(
                                                    nomination._id                                                 )
                                                }
                                              >
                                                DISAPPROVE
                                              </button>
                                            </div>
                                          );
                                        }
                                      )
                                    ) : (
                                      <>
                                        <h6><b>No new nominations available...</b></h6>
                                      </>
                                    )}
                                  </div>
                                </>
                               ):(
                                <>
                                  {this.state.userInfo &&
                                      this.state.userInfo["role"] === "voter" ? (
                                        <div>
                                          <h5>Would you like to be a Candidate? Click below</h5>
                                          <button
                                            className="btn waves-effect standardbutton1"
                                            onClick={this.applyForCandidatureHelper}
                                          >
                                            APPLY FOR CANDIDATURE
                                          </button>
                                          </div>
                                      ) : (
                                        <>
                                        <div>
                                          <h5><u>Candidature Status:</u></h5>
                                          {this.state.userInfo["role"] === "candidate" &&
                                          this.state.userInfo["approved"] === true ? (
                                      
                                                <h6  className="btn waves-effect standardbutton"><b> You are now a candidate</b></h6>
                                              ) : (
                                                <h6  className="btn waves-effect standardbutton"><b>Admin has not yet approved your request</b></h6>
                                            )}
                                        </div>
                                        </>
                                  )}
                                  <div className="electionsList">
                                    <h5 style={{color:"red",fontFamily:"timesnewroman"}}><u>Elections List</u></h5>
                                      {
                                        this.state.userInfo && this.state.elections && this.state.elections.length ?(
                                         this.state.elections.map((election,index)=>{
                                           return (
                                            <div className="electionInfo" key={index}><b>
                                              {election.location}
                                              {","}
                                              {election.position}
                                              </b>
                                              <i
                                                className="material-icons"
                                                style={{ float: "right" }}
                                                onClick={() => {
                                                  this.viewElection(election);
                                                  instance.open();
                                                }}
                                              >
                                                remove_red_eye
                                              </i>
                                            </div>
                                           )
                                         })
                                        ):<b><p>No Elections For Today...</p></b>
                                      }
                                  </div>
                                  {
                                    this.state.userInfo["role"]==="candidate"?(
                                      <div className="contestElectionsList">
                                      <h5 style={{color:"red",fontFamily:"timesnewroman"}}><u>Contest in Elections List</u></h5>
                                        {
                                          this.state.userInfo && this.state.upcomingElectionsForContestingList && this.state.upcomingElectionsForContestingList.length ?(
                                           this.state.upcomingElectionsForContestingList.map((election,index)=>{
                                             return (
                                              <div className="contestElectionInfo" key={index}>
                                                <p><b>
                                                {election.location}
                                                {","}
                                                {election.position}
                                                </b></p>
                                                {this.state.userInfo["nominations"].filter((nomination)=>nomination["election"]===election._id).length?(
                                                  <>
                                                    <button
                                                      className="btn waves-effect standardbutton"
                                                    >
                                                      ALREADY CONTESTING IN ELECTION
                                                    </button>
                                                  </>
                                                ):<>
                                                    {
                                                      this.state.partyList && this.state.partyList.length? (
                                                        <>
                                                          <div className="row" style={{marginTop:"1rem"}}>
                                                            <div className="col s2">
                                                              <label htmlFor="contestingParty" style={{color:"white",fontSize:"17px"}}>Party</label>
                                                            </div>
                                                            <div className="col s10">
                                                              <select className="browser-default" id="contestingParty" onClick={(e)=>this.setState({selectedPartyForNomination:e.target.value})}>
                                                                {
                                                                  this.state.partyList.map((party,index)=>{
                                                                    return <option key={index} value={party._id}>{party["name"]}</option>
                                                                  })
                                                                }
                                                              </select>
                                                            </div>
                                                          </div>
                                                          <button
                                                              className="btn waves-effect standardbutton"
                                                              onClick={()=>{
                                                                this.applyForNomination(election._id);
                                                                // this.setState({showElectionInModal:false});
                                                              }}
                                                          >
                                                            CONTEST IN ELECTION
                                                          </button>                                                      
                                                        </>
                                                      ):(
                                                        <></>
                                                      )
                                                    }
                                                </>}
                                              </div>
                                             )
                                           })
                                          ):<><p><b>No elections available for contesting...</b></p></>
                                        }
                                    </div>  
                                    ):<></>
                                  }
                                </>
                               )
                             }
                          </div>
                        </>
                      ):(
                        <>
                          <h6>
                            You are not eligible for voting...
                          </h6>
                        </>
                      )
                    }
                </div>
              </>
            )
          }
        </>
        <div
          ref={(Modal) => {
            this.Modal = Modal;
          }}
          id="modal1"
          className="modal"
        >
          <div className="modal-content">
            {
              this.state.showElectionInModal? (
                <>
                  <ul className="collection">
                  {this.state.nominees.length ? (
                    this.state.nominees.map((nominee, index) => {
                      return (
                        <li
                          className="collection-item avatar"
                          key={index}
                        >
                          {nominee.candidate.name}
                          {","}
                          {nominee.party.name}
                          <button
                            className="waves-effect btn"
                            onClick={() => {
                              const obj = {
                                voteTime: moment(new Date()).format(
                                  "MM-DD-YYYY"
                                ),
                                collegeID: this.state.userInfo
                                  .collegeID,
                                party: nominee.party._id,
                                candidate: nominee.candidate._id,
                                election: nominee.election._id,
                              };
                              this.setState({
                                selectedNominee: nominee.candidate.name,
                                voteInfo: obj,
                              });
                            }}
                          >
                            {this.state.selectedNominee ==
                            nominee.candidate.name
                              ? "SELECTED"
                              : "SELECT"}
                          </button>
                        </li>
                      );
                    })
                  ) : (
                    <></>
                  )}
                </ul>
                {this.state.voteInfo && (
                  <button
                    className="waves-effect btn"
                    onClick={this.castVote}
                  >
                    Vote
                  </button>
                )}

                </>
              ):(
                <>
                  Show the info for applying for nomination
                </>
              )
            }            
          </div>
          <div className="modal-footer">
            {/* <a
              className="modal-close red btn-flat"
              style={{ color: "white" }}
            >
              Yes
            </a> */}
            <a
              className="modal-close green btn-flat"
              style={{ color: "white" }}
            >
              CLOSE
            </a>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }
}

export default Dashboard;
