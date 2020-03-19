import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Glyphicon } from 'react-bootstrap';
import { CSVLink } from "react-csv";
import ReactPaginate from 'react-paginate';

class WaypointTable extends Component {
  constructor(props) {
    super(props);

    this.deleteItem = this.deleteItem.bind(this);
    this.getWaypoints = this.getWaypoints.bind(this);

    this.state = {
      waypoints: [],
      offset: 0,
      pageCount: 0,
      downloadableData: []
    };
  }

  componentDidMount() {
    this.getWaypoints();
    this.getDownloadableData();
  }

  // GET birds
  getWaypoints() {
    var limit = this.props.perPage;
    var offset = this.state.offset;
    axios.get('/api/waypoints/' + offset + '/' + limit)
      .then(response => {
        this.setState({
          waypoints: response.data.docs,
          pageCount: Math.ceil(response.data.total / response.data.limit),
        });
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getDownloadableData() {
    var data = [];
    axios.get('/api/waypoints')
      .then(response => {
        response.data.forEach((waypoint) => {
          if (waypoint.bird == null) {
            waypoint.bird = {name: "Deleted", rfid: "Deleted"};
          }
          if (waypoint.feeder == null) {
            waypoint.feeder = {name: "Deleted", stub: "Deleted"};
          }
          data.push({
            name: waypoint.bird.name,
            rfid: waypoint.bird.rfid,
            feeder: waypoint.feeder.name,
            datetime: this.convertTime(waypoint.datetime)
          });
        });
        this.setState({
          downloadableData: data
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

  handlePageClick = data => {
    var selected = data.selected;
    var offset = Math.ceil(selected * this.props.perPage);

    this.setState({ offset: offset }, () => {
      this.getWaypoints();
    });
  };

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
        <Button
          bsSize="small"
          >
          <CSVLink
            data={this.state.downloadableData}
            filename={"FeederNet " + this.convertTime(new Date()/1000)}
            >
            Download CSV
          </CSVLink>
        </Button>
        <br/>
        <br/>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>Bird Name</th>
              <th>RFID</th>
              <th>Freader Name</th>
              <th>Date and Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.buildRows()}
          </tbody>
        </Table>
        <ReactPaginate
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={this.state.pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.handlePageClick}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
        />
      </div>
    );
  }
}

export default WaypointTable;
