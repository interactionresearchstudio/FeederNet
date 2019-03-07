import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Birds from './birds';
import Feeders from './feeders';
import EventTable from './event-table';
import WaypointTable from './waypoint-table';

class Index extends Component {
  constructor(props, context) {
    super(props, context);

    // Catch 401 and intercept
    axios.interceptors.response.use(response => {
      return response;
    }, error => {
      if (error.response.status === 401) {
        console.log("INFO: CAUGHT 401");
        this.setState({redirect: true});
      }
    });

    this.handleSelect = this.handleSelect.bind(this);
    this.updateFilter = this.updateFilter.bind(this);

    this.state = {
      key: 1,
      redirect: false,
      locationFilter: {
        latitude: "0",
        longitude: "0"
      }
    };
  }

  handleSelect(key) {
    this.setState({key});
  }

  handleRedirect() {
    if (this.state.redirect) {
      return <Redirect to="/login/"/>
    }
  }

  updateFilter(location) {
    this.setState({locationFilter: location});
    console.log(location);
  }

  render() {
    return(
      <div id="index">
        {this.handleRedirect()}
        <br/>
        <Tabs
          activeKey={this.state.key}
          onSelect={this.handleSelect}
          id="main-tabs"
        >
          <Tab eventKey={1} title="Birds">
            <Birds/>
          </Tab>
          <Tab eventKey={2} title="Feeders">
            <Feeders locationFilter={this.state.locationFilter}/>
          </Tab>
          <Tab eventKey={3} title="Events">
            <EventTable locationFilter={this.state.locationFilter}/>
          </Tab>
          <Tab eventKey={4} title="Waypoints">
            <WaypointTable locationFilter={this.state.locationFilter}/>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default Index;
