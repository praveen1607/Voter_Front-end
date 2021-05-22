import React from "react";
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import axios from "axios";

import "./AddElection.css";

class AddElection extends React.Component {
  state = {
    isLoading: false,
    location: "",
    position: "",
    startTime: "",
    endTime: "",
  };

  createElection = async () => {
    const { location, position, startTime, endTime } = this.state;
    if (
      location === "" ||
      position === "" ||
      startTime === "" ||
      endTime === ""
    ) {
      M.toast({ html: "Please enter all the fields" });
    } else {
      this.setState({ isLoading: true });
      try {
        const response = await axios.post(
          "http://localhost:8080/api/v1/election/create",
          { location, position, startTime, endTime }
        );
        M.toast({ html: response.data.message });
        this.setState({ isLoadingL: false });
        setTimeout(() => {
          this.props.history.push("/election");
        }, 3000);
      } catch (err) {
        this.setState({ isLoading: false });
        console.log(err);
      }
    }
  };

  render() {
    return (
      <div className="AddElection">
        <>
          {this.state.isLoading ? (
            <>Loading...</>
          ) : (
            <form onSubmit={this.createElection}>
              <div className="row">
                <div className="input-field col s12">
                  <input
                    placeholder="Some Branch"
                    id="location"
                    type="text"
                    className="validate"
                    value={this.state.location}
                    onChange={({ target: { value } }) =>
                      this.setState({ location: value })
                    }
                  />
                  <label className="active" htmlFor="location">
                    {" "}
                    <b>Branch</b> <span className="required">*</span>
                  </label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <input
                    placeholder="Some Post"
                    id="position"
                    type="text"
                    className="validate"
                    value={this.state.position}
                    onChange={({ target: { value } }) =>
                      this.setState({ position: value })
                    }
                  />
                  <label className="active" htmlFor="position">
                    {" "}
                    <b>Position</b> <span className="required">*</span>
                  </label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="sdate"
                    type="datetime-local"
                    className="validate"
                    value={this.state.startTime}
                    onChange={({ target: { value } }) => {
                      console.log(value);
                      this.setState({ startTime: value });
                    }}
                  />
                  <label className="active" htmlFor="sdate">
                    {" "}
                    <b>Start Date</b> <span className="required">*</span>
                  </label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="edate"
                    type="datetime-local"
                    className="validate"
                    value={this.state.endTime}
                    onChange={({ target: { value } }) => {
                      console.log(value);
                      this.setState({ endTime: value });
                    }}
                  />
                  <label className="active" htmlFor="date">
                    {" "}
                    <b>End Date</b> <span className="required">*</span>
                  </label>
                </div>
              </div>
              <button className="waves-effect btn" role="button">ADD ELECTION</button>
            </form>
          )}
        </>
      </div>
    );
  }
}

export default AddElection;
