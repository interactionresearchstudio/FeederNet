import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Birds from './birds';
import Feeders from './feeders';
import EventTable from './event-table';
import WaypointTable from './waypoint-table';

class Index extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSelect = this.handleSelect.bind(this);

    this.state = {
      key: 1
    };
  }

  handleSelect(key) {
    this.setState({key});
  }

  render() {
    return(
      <div id="index">
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
