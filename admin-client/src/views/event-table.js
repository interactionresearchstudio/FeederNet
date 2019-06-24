import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Glyphicon } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';

class EventTable extends Component {
  constructor(props) {
    super(props);

    this.deleteItem = this.deleteItem.bind(this);
    this.getEvents = this.getEvents.bind(this);

    this.state = {
      events: [],
      offset: 0,
      pageCount: 0,
    };
  }

  componentDidMount() {
    this.getEvents();
  }

  // GET birds
  getEvents() {
    var limit = this.props.perPage;
    var offset = this.state.offset;
    axios.get('/api/events/' + offset + '/' + limit)
      .then(response => {
        this.setState({
          events: response.data.docs,
          pageCount: Math.ceil(response.data.total / response.data.limit),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Build table rows
  buildRows() {
    return this.state.events.map((object, i) => {
      if (object.feeder == null) {
        object.feeder = {
          name: "Unknown"
        };
      }
      return(
        <tr key={i}>
          <td>{object.type}</td>
          <td>{object.feeder.name}</td>
          <td>{object.ip}</td>
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
    axios.delete('/api/event/' + itemId)
      .then(res => {
        this.getEvents();
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
      this.getEvents();
    });
  };


  render() {
    return(
      <div>
        <br/>
        <Button
          onClick={() => this.getEvents()}
          bsSize="small"
          >
          <Glyphicon glyph="refresh"/>
        </Button>
        <br/>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>Event Type</th>
              <th>Feeder</th>
              <th>IP Address</th>
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

export default EventTable;
