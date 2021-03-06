import React, { Component } from 'react';
import { Table, Button, Glyphicon } from 'react-bootstrap';

class FeederTable extends Component {

  // Build table rows
  buildRows() {
    return this.props.feeders.map((object, i) => {
      if (object.location == null) {
        object.location = {
          latitude: "Undefined",
          longitude: "Undefined"
        };
      }
      return(
        <tr key={i}>
          <td>{object.name}</td>
          <td>{object.stub}</td>
          <td>{object.location.latitude}</td>
          <td>{object.location.longitude}</td>
          <td>{this.convertTime(object.lastPing)}</td>
          <td>{this.convertRssi(object.lastReportedRssi)}</td>
          <td>
            <Button
              onClick={() => this.props.deleteFeeder(object._id)}
              bsSize="xsmall"
              >
              <Glyphicon glyph="remove"/>
            </Button>
            <Button
              onClick={() => this.props.updateFeeder(object._id)}
              bsSize="xsmall"
              >
              <Glyphicon glyph="pencil"/>
            </Button>
          </td>
        </tr>
      );
    });
  }

  isFeederWithinFilter(locationFilter, feederLocation) {
    if (locationFilter.latitude === "0" && locationFilter.longitude === "0") {
      return true;
    }
  }

  convertTime(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }

  convertRssi(rssi) {
    if (rssi <= -90) return "Poor";
    if (rssi <= -70) return "Fair";
    if (rssi <= -60) return "Good";
    if (rssi <= -50) return "Excellent";
    else return "Excellent";
  }

  render() {
    return(
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Freader Name</th>
            <th>Freader Stub</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Last Ping</th>
            <th>Signal Strength</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {this.buildRows()}
        </tbody>
      </Table>
    );
  }
}

export default FeederTable;
