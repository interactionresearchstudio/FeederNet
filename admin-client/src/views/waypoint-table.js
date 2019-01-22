import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Glyphicon } from 'react-bootstrap';

class WaypointTable extends Component {
  constructor(props) {
    super(props);

    this.deleteItem = this.deleteItem.bind(this);
    this.getWaypoints = this.getWaypoints.bind(this);

    this.state = {
      waypoints: []
    };
  }

  componentDidMount() {
    this.getWaypoints();
  }

  // GET birds
  getWaypoints() {
    axios.get('/api/waypoints')
      .then(response => {
        response.data.sort((a, b) => parseFloat(b.datetime) - parseFloat(a.datetime));
        this.setState({
          waypoints: response.data
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Build table rows
  buildRows() {
    return this.state.waypoints.map((object, i) => {
      if (object.bird == null) {
        object.bird = {name: "Deleted", rfid: "Deleted"};
      }
      if (object.feeder == null) {
        object.feeder = {name: "Deleted", stub: "Deleted"};
      }
      return(
        <tr key={i}>
          <td>{object.bird.name}</td>
          <td>{object.bird.rfid}</td>
          <td>{object.feeder.name}</td>
          <td>{this.convertTime(object.datetime)}</td>
          <td>
            <Button
              onClick={() => this.deleteItem(object._id)}
              bsSize="xsmall"
              >
              <Glyphicon glyph="remove"/>
            </Button>
          </td>
        </tr>
      );
    });
  }

  deleteItem(itemId) {
    console.log("Delete item with ID " + itemId);
    axios.delete('/api/waypoint/' + itemId)
      .then(res => {
        this.getWaypoints();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  convertTime(UNIX_timestamp){
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

  render() {
    return(
      <div>
        <br/>
        <Button
          onClick={() => this.getWaypoints()}
          bsSize="small"
          >
          <Glyphicon glyph="refresh"/>
        </Button>
        <br/>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>Bird Name</th>
              <th>RFID</th>
              <th>Feeder Name</th>
              <th>Date and Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.buildRows()}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default WaypointTable;
