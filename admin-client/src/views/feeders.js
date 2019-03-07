import React, { Component } from 'react';
import FeederForm from './feeder-form';
import FeederTable from './feeder-table';
import axios from 'axios';

class Feeders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feeders: []
    };

    this.addFeeder = this.addFeeder.bind(this);
    this.deleteFeeder = this.deleteFeeder.bind(this);
  }

  componentDidMount() {
    this.getFeeders();
  }

  getFeeders() {
    axios.get('/api/feeders')
      .then(response => {
        this.setState({
          feeders: response.data
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  deleteFeeder(itemId) {
    console.log("Delete item with ID " + itemId);
    axios.delete('/api/feeder/' + itemId)
      .then(res => {
        this.getFeeders();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  addFeeder(feederStub, feederName, feederLatitude, feederLongitude, callback) {
    const postData = {
      stub: feederStub,
      name: feederName,
      location: {
        latitude: feederLatitude,
        longitude: feederLongitude
      },
      lastPing: 'never'
    }
    axios.post('/api/feeders', postData)
      .then(res => {
        console.log(res.data);
        this.getFeeders();
        callback(null);
      })
      .catch((error) => {
        console.log(error);
        callback(error);
      });
  }

  render() {
    return(
      <div>
        <br/>
        <FeederForm
          addFeeder = { this.addFeeder }
        />
        <br/>
        <FeederTable
          feeders = { this.state.feeders }
          deleteFeeder = { this.deleteFeeder }
          locationFilter = {this.props.locationFilter}
        />
      </div>
    );
  }
}

export default Feeders;
