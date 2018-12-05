import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Glyphicon } from 'react-bootstrap';

class EventTable extends Component {
  constructor(props) {
    super(props);

    this.deleteItem = this.deleteItem.bind(this);
    this.getEvents = this.getEvents.bind(this);

    this.state = {
      events: []
    };
  }

  componentDidMount() {
    this.getEvents();
  }

  // GET birds
  getEvents() {
    axios.get('/api/events')
      .then(response => {
        this.setState({
          events: response.data
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Build table rows
  buildRows() {
    return this.state.events.map((object, i) => {
      return(
        <tr key={i}>
          <td>{object.type}</td>
          <td>{object.ip}</td>
          <td>{object.datetime}</td>
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
              <th>IP Address</th>
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

export default EventTable;
