import React from "react";
import moment from "moment";
import {withRouter} from "react-router-dom";
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";

import "./ListCollection.css";

let instance;

class ListCollection extends React.Component {
  state = {
    selectedUser: null,
  };
  

  render() {
    return (
      <div className="ListCollection">
        <ul class="collection">
          {this.props.users.map((user) => {
            return (
              <li className="collection-item avatar" key={user._id}>
                <i className="material-icons circle green">insert_chart</i>
                <span className="title">
                  {user.name}
                  {/* {" , "} */}
                  </span>
                <p>
                  {moment(user.dob).format("MMM Do YYYY")}              
                </p>
                {/* <p>
                  {user.college}
                  {" , "}
                  {user.branch} <br />
                  {user.email}
                </p> */}
                <div className="actions">
                  <i className="material-icons" onClick={()=>this.props.viewUser(user)}>
                  remove_red_eye
                  </i>
                  {/* <i
                    className="material-icons"
                    onClick={() => {
                      this.props.history.push(`/edit/${user.role}/${user.collegeID}`)
                    }}
                  >
                    edit
                  </i>
                  <i
                    className="material-icons"

                    onClick={() => {
                      this.props.changeRole(user.collegeID,user.role);
                    }}
                  >
                    swap_horiz
                  </i>
                  

                  <i
                    className="material-icons"
                    onClick={() => {
                      this.props.deleteUserHelper(user);
                    }}
                  >
                    delete
                  </i> */}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default withRouter(ListCollection);
