import React from "react";

import "./Stats.css";

class Stats extends React.Component{

    state={
        isLoading:false,
        elections:[],
        votes:[],
        voteInfo:[],
    }

    render(){
        return (
            <div className="Stats">
            </div>
        )
    }
}

export default Stats;