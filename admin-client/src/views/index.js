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

    this.state = {
      key: 1,
      redirect: false
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

  render() {
    return(
      <div id="index">
        {this.handleRedirect()}
        <Tabs
          activeKey={this.state.key}
          onSelect={this.handleSelect}
          id="main-tabs"
        >
          <Tab eventKey={1} title="Birds">
            <Birds/>
          </Tab>
          <Tab eventKey={2} title="Feeders">
            <Feeders/>
          </Tab>
          <Tab eventKey={3} title="Events">
            <EventTable/>
          </Tab>
          <Tab eventKey={4} title="Waypoints">
            <WaypointTable/>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default Index;
