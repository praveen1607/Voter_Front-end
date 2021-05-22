import React from "react";
import { Link } from "react-router-dom";
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import  SIGNUP_IMG  from "../../helpers/election_login.png";
import "./Login.css";
import Loader from "../../components/Loader/Loader";

class Login extends React.Component {
  state = {
    collegeID: "",
    password: "",
    isLoading: false,
    hidePassword:true,
  };

  checkInput = (inputName) => {
    return inputName.length > 0;
  };

  loginUser = (e) => {
    e.preventDefault();
    const { collegeID, password } = this.state;
    if (this.checkInput(collegeID) && this.checkInput(password)) {
      this.setState({ isLoading: true });
      const data = { collegeID, password: password };
      fetch("http://localhost:8080/api/v1/login", {
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
            localStorage.setItem("userDetails", JSON.stringify(data.user));
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
              this.props.history.push("/dashboard");
            }, 2500);
          } else {
            toast.error(data.message, {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.setState({ isLoading: false });
        });
    } else {
      M.toast({ html: "Please enter all the required fields" });
    }
  };

  render() {
    return (
      <div className="login">
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
                    <form id="loginForm" onSubmit={this.loginUser}>
                      {/* <img src={SIGNUP_IMG} /> */}
                      <div className="row">
                        <div className="input-field col s12">
                          <input
                            // autoComplete="off"
                            placeholder="12341234"
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
                      <div className="row">
                        <div className="input-field col s12">
                          <div style={{display:'flex',alignItems:"center"}}>
                          <input
                            autoComplete="off"
                            placeholder="*******"
                            id="password"
                            type={this.state.hidePassword?"password":"text"}
                            className="validate"
                            value={this.state.password}
                            onChange={({ target: { value } }) =>
                              this.setState({ password: value })
                            }
                          />
                          <i className="material-icons" onClick={()=>{
                            this.setState({hidePassword:!this.state.hidePassword})
                          }}>{this.state.hidePassword?"visibility":"visibility_off"}</i>
                          </div>
                          <label className="active" htmlFor="password">
                            {" "}
                            Password <span className="required">*</span>
                          </label>
                        </div>
                      </div>
                      <button className="btn waves-effect" type="submit">
                        Login
                        <i className="medium material-icons">person</i>
                      </button>
                    </form>
                    <p>
                      Don't have an account ? <Link to="/signup">Signup</Link>
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

export default Login;
