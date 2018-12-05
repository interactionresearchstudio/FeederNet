import React, { Component } from 'react';
import { Table, Button, Glyphicon } from 'react-bootstrap';

class FeederTable extends Component {

  // Build table rows
  buildRows() {
    return this.props.feeders.map((object, i) => {
      return(
        <tr key={i}>
          <td>{object.name}</td>
          <td>{object.stub}</td>
          <td>{object.location.latitude}</td>
          <td>{object.location.longitude}</td>
          <td>{object.lastPing}</td>
          <td>
            <Button
              onClick={() => this.props.deleteFeeder(object._id)}
              bsSize="xsmall"
              >
              <Glyphicon glyph="remove"/>
            </Button>
          </td>
        </tr>
      );
    });
  }


  render() {
    return(
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Feeder Name</th>
            <th>Feeder Stub</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Last Ping</th>
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
