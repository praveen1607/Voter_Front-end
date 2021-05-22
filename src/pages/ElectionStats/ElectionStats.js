import React from "react";
import { withRouter } from "react-router-dom";
import Chart from "react-google-charts";

import axios from "axios";
import "./ElectionStats.css";

class ElectionStats extends React.Component {
  state = {
    isLoading: false,
    stats: null,
    // candidateInfo:[],
  };

  componentDidMount() {
    this.getStats();
    // console.log(this.props.match.params);
  }

  generateStats=(stats)=>{
    console.log(stats);
    let statsObj={};
    stats.forEach((stat)=>{
        if(!statsObj[stat["party"]["name"]]){
            statsObj[stat["party"]["name"]]={count:1,candidate:stat["candidate"]};            
        }else{
          statsObj[stat["party"]["name"]]["count"]++;
        }
    })
    const candidates=['Candidates'];
    const votes=['May 3,2021'];
    Object.values(statsObj).forEach((stat)=>{
      candidates.push(stat.candidate.name);
      votes.push(stat.count);
    })
    const cData=[];
    cData.push(candidates);
    cData.push(votes);
    this.setState({stats:statsObj,chartData:cData});
  }

  getStats = async () => {
    try {
      this.setState({ isLoading: true });
      const response = await axios.post(
        "http://localhost:8080/api/v1/vote/getStats",{electionID:this.props.match.params.electionID}
      );
      this.setState({ isLoading: false });
      this.generateStats(response.data.stats);
    } catch (err) {
      console.error(err);
      this.setState({ isLoading: false });
    }
  };

  showStatsInfo=()=>{
    return (
      <div className="row">
        <div className="col s5">
          {this.showStats()}
        </div>
        <div className="col s7">
          <Chart
            width={'500px'}
            height={'300px'}
            chartType="Bar"
            loader={<div>Loading Chart</div>}
            data={
              this.state.chartData
           }
            options={{
              // Material design options
              chart: {
                title: 'Election Results',
              },
            }}
            // For tests
            rootProps={{ 'data-testid': '2' }}
          />
        </div>
      </div>
    )
  }

  showStats=()=>{
    let partyNames=Object.keys(this.state.stats);
    let voteCountInfo=Object.values(this.state.stats);
    return partyNames.map((party,index)=>{
        return (
            <div className="voteInfo">
                <div className="row">
                    <div className="col s5">
                        <b>{party}</b>
                    </div>
                    <div className="col s7">
                        <div><b>Votes Count : <span style={{fontWeight:"bold"}}>{voteCountInfo[index]["count"]}</span></b></div>
                        <div className="candidateInfo">
                            <h6><b>{voteCountInfo[index]["candidate"]["name"]}</b></h6>
                            <p><b>{voteCountInfo[index]["candidate"]["collegeID"]}{","}{voteCountInfo[index]["candidate"]["branch"]}</b></p>
                        </div>
                    </div>
                </div>
            </div>
        )
    })
  }

  render() {
    return (
      <div className="ElectionStats">
        <>
          {this.state.isLoading ? (
            <>Loading..</>
          ) : (
            <>
              <h3><u>Election Stats</u></h3>
              {this.state.stats?this.showStatsInfo():<>No votes yet</>}
            </>
          )}
        </>
      </div>
    );
  }
}

export default withRouter(ElectionStats);
