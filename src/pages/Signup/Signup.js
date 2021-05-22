import React from "react";
import { Link } from "react-router-dom";
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import SIGNUP_IMG from "../../helpers/Signup.png";
import "./Signup.css";
import Loader from "../../components/Loader/Loader";

class Signup extends React.Component {
  state = {
    role: null,
    name: "",
    date: "",
    college: "Presidency University",
    branch: "Computer Science",
    collegeID: "",
    password: "",
    email: "",
    isLoading: false,
    showPasswordField: true,
    role: "Voter",
    hidePassword: true,
    gender:"Male",
  };

  componentDidMount() {
    if (this.props) {
      if (this.props.match.path.includes("edit")) {
        //load data of the user
        this.setState({ isLoading: true });
        const data = { collegeID: this.props.match.params.collegeID };
        fetch("http://localhost:8080/api/v1/view", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => {
            this.setState({ isLoading: false });
            if (data.isError === false) {
              const {
                user: { name, dob, college, branch, collegeID, email },
              } = data;
              // console.log(name,moment(dob).format("MM-DD-YYYY"),college,branch,collegeID,email);
              this.setState({
                name,
                date: moment(dob).format("YYYY-MM-DD"),
                college,
                branch,
                collegeID,
                email,
                showPasswordField: false,
              });
            } else {
              M.toast({ html: data.error });
            }
          })
          .catch((err) => {
            console.log(err);
            this.setState({ isLoading: false });
          });
      }
    }
  }

  checkInput = (inputName) => {
    return inputName.length > 0;
  };

  signUpUser = (e) => {
    e.preventDefault();
    const {
      name,
      date,
      college,
      branch,
      collegeID,
      password,
      email,
      gender
    } = this.state;
    if (
      this.checkInput(name) &&
      this.checkInput(date) &&
      this.checkInput(college) &&
      this.checkInput(branch) &&
      this.checkInput(collegeID) &&
      this.checkInput(password) &&
      this.checkInput(gender)
    ) {
      if(!new RegExp(/^[a-zA-Z ]+$/).test(name)){
        toast.error("Only alphabets are allowed for the name ", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }else{
        //check 18+
        if(2021-new Date(date).getFullYear()<18){
           toast.error("The person trying to register is not above 18 years ", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
        }else{
          this.setState({ isLoading: true });
          const data = {
            name,
            dob: date,
            college,
            branch,
            collegeID,
            password,
            email,
            gender
          };
          fetch(`http://localhost:8080/api/v1/${this.state.role.toLowerCase()}/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.isError) {
                this.setState({ isLoading: false });
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
                this.setState({ isLoading: false });
                // localStorage.setItem("userDetails", JSON.stringify(data.user));
                toast.success(data.message, {
                  position: "top-right",
                  autoClose: 1500,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
                setTimeout(() => {
                  this.props.history.push("/");
                }, 2000);
              }
            })
            .catch((err) => {
              console.log(err);
              this.setState({ isLoading: false });
            });  
        }
      }
 
    } else {
      toast.error("Please enter all the required fields", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // M.toast({ html: "Please enter all the required fields" });
    }
  };

  updateUser = (e) => {
    e.preventDefault();
    const { name, date, college, branch, collegeID, email } = this.state;
    const data = { name, dob: date, college, branch, collegeID, email };
    if (
      this.checkInput(name) &&
      this.checkInput(college) &&
      this.checkInput(branch) &&
      this.checkInput(JSON.stringify(collegeID))
    ) {
      fetch(`http://localhost:8080/api/v1/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.isError) {
            this.setState({ isLoading: false });
            // console.log(data);
            M.toast({ html: data.error });
          } else {
            this.setState({ isLoading: false });
            // localStorage.setItem("userDetails", JSON.stringify(data.user));
            M.toast({ html: data.message });
            setTimeout(() => {
              this.props.history.push("/list");
            }, 2000);
          }
        })
        .catch((err) => {
          console.log(err);
          this.setState({ isLoading: false });
        });
    } else {
      // console.log(name, this.checkInput(name));
      // console.log(college, this.checkInput(college));
      // console.log(branch, this.checkInput(branch));
      // console.log(collegeID, this.checkInput(JSON.stringify(collegeID)));
      // M.toast({ html: "Please enter all the required fields" });
      toast.error("Please enter all the required fields", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  render() {
    return (
      <div className="signup">
        <>
          {this.state.isLoading ? (
            <>
              <Loader />
            </>
          ) : (
            <div>
              <div className="formContainer">
                <div className="row">
                  <div className="col s6">
                    <form
                      onSubmit={
                        this.state.showPasswordField
                          ? this.signUpUser
                          : this.updateUser
                      }
                    >
                      <div id="signupForm">
                        <div className="row">
                          <div className="input-field col s12">
                            <input
                              id="name"
                              type="text"
                              className="validate"
                              value={this.state.name}
                              onChange={({ target: { value } }) =>
                                this.setState({ name: value })
                              }
                            />
                            <label className="active" htmlFor="name">
                              {" "}
                              Name <span className="required">*</span>
                            </label>
                          </div>
                        </div>
                        <div className="row">
                          <div className="input-field col s12">
                            <input
                              id="date"
                              type="date"
                              className="validate"
                              value={this.state.date}
                              onChange={({ target: { value } }) => {
                                console.log(value);
                                this.setState({ date: value });
                              }}
                            />
                            <label className="active" htmlFor="date">
                              {" "}
                              Date of Birth<span className="required">*</span>
                            </label>
                          </div>
                        </div>
                        <div className="row">
                          <div className="input-field col s12">
                          <p>
                            <label>
                              <input name="group1" type="radio" checked={this.state.gender==="Male"} value="Male" onChange={({target:{value}})=>this.setState({gender:value})} />
                              <span>Male</span>
                            </label>
                          </p>
                          <p>
                            <label>
                              <input name="group1" type="radio"  checked={this.state.gender==="Female"} value="Female" onChange={({target:{value}})=>this.setState({gender:value})}/>
                              <span>Female</span>
                            </label>
                          </p>
                          <label className="active" htmlFor="gender">
                              {" "}
                              Gender <span className="required">*</span>
                            </label>

                          </div>      
                        </div>
                        <div className="row">
                          <div className="input-field col s12">
                            <input
                              id="college"
                              disabled="true"
                              type="text"
                              className="validate"
                              value={this.state.college}
                              onChange={({ target: { value } }) =>
                                this.setState({ college: value })
                              }
                            />
                            <label className="active" htmlFor="college">
                              {" "}
                              College <span className="required">*</span>
                            </label>
                          </div>
                        </div>
                        <div className="row">
                          <div className="input-field col s12">
                            <select
                              className="browser-default"
                              onChange={({ target: { value } }) =>
                                this.setState({ branch: value })
                              }
                              value={this.state.branch}
                            >
                              <option value="Computer Science">
                                Computer Science
                              </option>
                              <option value="Electrical and Electronics Engineering">
                                Electrical and Electronics Engineering
                              </option>
                              <option value="Electronics and Communication Engineering">
                                Electronics and Communication Engineering
                              </option>
                              <option value="Mechanical Engineering">
                                Mechanical Engineering
                              </option>
                              <option value="Civil Engineering">
                                Civil Engineering
                              </option>
                              <option value="Petroleum Engineering">
                                Petroleum Engineering
                              </option>
                              <option value="Information Technology">
                                Information Technology
                              </option>
                            </select>
                            <label className="active" htmlFor="branch">
                              Branch<span className="required">*</span>
                            </label>
                          </div>
                        </div>
                        <div className="row">
                          <div className="input-field col s12">
                            <input
                              id="collegeid"
                              type="text"
                              className="validate"
                              value={this.state.collegeID}
                              onChange={({ target: { value } }) =>
                                this.setState({ collegeID: value })
                              }
                            />
                            <label className="active" htmlFor="collegeid">
                              {" "}
                              CollegeID <span className="required">*</span>
                            </label>
                          </div>
                        </div>
                        {this.state.showPasswordField && (
                          <div className="row">
                            <div className="input-field col s12">
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <input
                                  autoComplete="off"
                                  placeholder="*******"
                                  id="password"
                                  type={
                                    this.state.hidePassword
                                      ? "password"
                                      : "text"
                                  }
                                  className="validate"
                                  value={this.state.password}
                                  onChange={({ target: { value } }) =>
                                    this.setState({ password: value })
                                  }
                                />
                                <i
                                  className="material-icons"
                                  onClick={() => {
                                    this.setState({
                                      hidePassword: !this.state.hidePassword,
                                    });
                                  }}
                                >
                                  {this.state.hidePassword
                                    ? "visibility"
                                    : "visibility_off"}
                                </i>
                              </div>
                              <label className="active" htmlFor="password">
                                {" "}
                                Password <span className="required">*</span>
                              </label>
                            </div>
                          </div>
                        )}
                        <div className="row">
                          <div className="input-field col s12">
                            <input
                              id="email"
                              type="email"
                              className="validate"
                              value={this.state.email}
                              onChange={({ target: { value } }) =>
                                this.setState({ email: value })
                              }
                            />
                            <label className="active" htmlFor="email">
                              {" "}
                              Email
                            </label>
                          </div>
                        </div>
                      </div>
                      <br />
                      <br />
                      {this.state.showPasswordField ? (
                        <button
                          className="btn waves-effect"
                          type="submit"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          Signup
                          <i className="medium material-icons">person</i>
                        </button>
                      ) : (
                        <button className="btn waves-effect" type="submit">
                          Edit User
                          <i className="medium material-icons">person</i>
                        </button>
                      )}
                    </form>
                    <br />
                    <br />
                    <p>
                      Already have an account? <Link to="/">Login</Link>
                    </p>
                  </div>
                  <div className="col s6">
                    <img src={SIGNUP_IMG} className="loginImg" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
        <ToastContainer />
      </div>
    );
  }
}

export default Signup;
