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

    this.feederFormElement = React.createRef();

    this.addFeeder = this.addFeeder.bind(this);
    this.deleteFeeder = this.deleteFeeder.bind(this);
    this.updateFeeder = this.updateFeeder.bind(this);
    this.editFeeder = this.editFeeder.bind(this);
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

  editFeeder(itemId) {
    axios.get('/api/feeder/' + itemId)
    .then(response => {
      this.feederFormElement.current.placeData(response.data);
      window.scrollTo(0, 0)
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

  updateFeeder(itemId, putData, callback) {
    console.log("Update item with ID " + itemId);
    axios.put('/api/feeder/' + itemId, putData)
    .then(res => {
      this.getFeeders();
      callback(null);
    })
    .catch((error) => {
      console.log(error);
    })
  }

  render() {
    return(
      <div>
        <br/>
        <FeederForm
          ref = { this.feederFormElement }
          addFeeder = { this.addFeeder }
          updateFeeder = { this.updateFeeder }
        />
        <br/>
        <FeederTable
          feeders = { this.state.feeders }
          deleteFeeder = { this.deleteFeeder }
          updateFeeder = { this.editFeeder }
          locationFilter = {this.props.locationFilter}
        />
      </div>
    );
  }
}

export default Feeders;
