import React from "react";
import { withRouter } from "react-router-dom";
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import moment from "moment";
import * as _ from "lodash";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import "./List.css";
import Loader from "../../components/Loader/Loader";
// import VoterListStats from "../../components/VoterListStats/VoterListStats";
import ListCollection from "../../components/ListCollection/ListCollection";

let instance;
class Voters extends React.Component {
  state = { 
    isLoading: false,
    users:[],
    toBeDeletedUser:null,
    usersBranches:[],
    candidatesBranches:[],
    selectedBranch:'ALL',
    filteredUsers:[],
    showUserInfo:false,
  };

  componentDidMount() {
    this.getList();
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
  }

  getList=()=>{
    if(window.location.href.includes("voters")){
      this.getVoters();
    }else{
      this.getCandidates();
    }
  }

  getVoters = () => {
    this.setState({ isLoading: true });
    fetch("http://localhost:8080/api/v1/voter/getAll")
      .then((res) => res.json())
      .then((data) => {
        // console.log(data.voters);
        const uniqueBranches=_.map(_.uniqBy([...data.voters],"branch"),"branch");
        this.setState({ users: data.voters, isLoading: false, usersBranches:["ALL",...uniqueBranches] });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  getCandidates = () => {
    this.setState({ isLoading: true });
    fetch("http://localhost:8080/api/v1/candidate/getAll")
      .then((res) => res.json())
      .then((data) => {
        const uniqueBranches=_.map(_.uniqBy([...data.candidates],"branch"),"branch");
        this.setState({ users: data.candidates, isLoading: false , usersBranches:["ALL",...uniqueBranches] });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  changeRole=(collegeID,currentRole)=>{
    this.setState({isLoading:true});
    const data={collegeID,role:currentRole==="candidate"?"voter":"candidate"};
    fetch("http://localhost:8080/api/v1/update",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => {          
      this.setState({isLoading:false});
      toast.success(data.message, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      this.getList();
    })
    .catch((err) => {
      console.log(err);
      this.setState({isLoading:false});
    });
  }

  deleteUserHelper=(user)=>{
    this.setState({toBeDeletedUser:user},()=>{
      instance.open();
    });
  }

  deleteUser = () => {
    const data = { collegeID: this.state.toBeDeletedUser.collegeID };
    this.setState({ isLoading: true });
    fetch(`http://localhost:8080/api/v1/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.isError) {
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
          this.setState({ deletedUser:null,showUserInfo:false,isLoading: false }, () => {
            this.getList();
          });
        } else {
          console.log(data);
          this.setState({ isLoading: false });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  viewUser=(userInfo)=>{
    this.setState({selectedUser:userInfo,showUserInfo:true});
  }

  render() {
    return (
      <div className="List">
        {this.state.isLoading ? (
          <>
            <Loader />
          </>
        ) : (
          <>
            <div className="row">
              <div className="col s6 ">
                <div className="row">
                  <div className="col s7">
                    <h5>
                    <u>{window.location.href.includes("voters")?"Voters":"Candidates"} List</u>
                      <span
                        class="new badge"
                        data-badge-caption={`${this.state.selectedBranch==='ALL'?this.state.users.length:this.state.filteredUsers.length} ${window.location.href.includes("voters")?"voters":"candidates"}`}
                      ></span>
                    </h5>
                  </div>
                  <div className="col s5" style={{margin:"1rem auto"}}>
                   
                  </div>
                </div>
                <div className="input-field">
                  {
                    this.state.usersBranches && this.state.usersBranches.length && this.state.users.length ? (
                      <>
                      <select
                        className="browser-default"
                        onChange={({ target: { value } }) =>{
                          this.setState({ selectedBranch: value })
                          if(value!='ALL'){
                            const filteredUsers=[...this.state.users].filter((user)=>user.branch===value);
                            this.setState({filteredUsers});
                          }
                        }
                        }
                        value={this.state.selectedBranch}
                      >
                        {
                          this.state.usersBranches.map((branch)=>{
                            return <option value={branch} key={branch}>{branch}</option>
                          })
                        }
                      </select>
                      <label className="active" htmlFor="branch">
                        <b>Branches</b>
                      </label>
                      </>
                    ):<></>
                  }
                </div>
                <div className="ListCollection">
                  {
                    this.state.users.length ? (
                      <>
                        <ListCollection
                        users={this.state.selectedBranch==='ALL'?this.state.users:this.state.filteredUsers}
                        deleteUserHelper={this.deleteUserHelper}
                        changeRole={this.changeRole}
                        viewUser={this.viewUser}
                      />  
                      </>
                    ):<></>
                  }
                </div>
              </div>
              <div className="col s6">
                {
                  this.state.showUserInfo ? (
                    <>
                      <div className="userInfo">
                        <p className="username">{this.state.selectedUser.name}{" , "}{this.state.selectedUser.branch}</p>
                        <p className="dob">Age : {moment(this.state.selectedUser.dob).fromNow().slice(0,moment(this.state.selectedUser.dob).fromNow().length-4)}</p>
                        <p className="collegeID">ID : {this.state.selectedUser.collegeID}</p>
                        <p>{this.state.selectedUser.role==="voter"?"":`${this.state.selectedUser.nominations.length} nominations`}</p>                        
                        <button className="btn userInfo_btn" onClick={()=>this.deleteUserHelper(this.state.selectedUser)}>
                          DELETE
                        </button>
                        <button className="btn userInfo_btn" onClick={()=>this.makeAdminHelper(this.state.selectedUser)}>
                          MAKE ADMIN
                        </button>
                      </div>
                    </>
                  ):<></>
                }
              </div>
            </div>
          </>
        )}
                <div
          ref={(Modal) => {
            this.Modal = Modal;
          }}
          id="modal1"
          className="modal"
        >
          <div className="modal-content">
            {this.state.toBeDeletedUser && this.state.toBeDeletedUser.name ? (
              <p>
                Are you sure you want to delete {this.state.toBeDeletedUser.name}?
              </p>
            ) : (
              <></>
            )}
          </div>
          <div className="modal-footer">
            <a
              className="modal-close red btn-flat"
              onClick={this.deleteUser}
              style={{ color: "white" }}
            >
              Yes
            </a>
            <a
              className="modal-close green btn-flat"
              style={{ color: "white" }}
            >
              No
            </a>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }
}

export default withRouter(Voters);
