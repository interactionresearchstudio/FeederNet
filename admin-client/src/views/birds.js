import React, { Component } from 'react';
import BirdForm from './bird-form';
import BirdTable from './bird-table';
import axios from 'axios';

class Birds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      birds: []
    };

    this.addBird = this.addBird.bind(this);
    this.deleteBird = this.deleteBird.bind(this);
  }

  componentDidMount() {
    this.getBirds();
  }

  getBirds() {
    axios.get('/api/birds')
    .then(response => {
      this.setState({
        birds: response.data
      });
    })
    .catch((error) => {
      console.log(error);
      this.setState({
        birds: null
      });
    });
  }

  addBird(name, rfid, callback) {
    const postData = {
      name: name,
      rfid: rfid
    }

    axios.post('/api/birds', postData)
    .then(res => {
      console.log(res.data);
      this.getBirds();
      callback(null);
    })
    .catch((error) => {
      console.log(error);
      callback(error);
    });
  }

  deleteBird(itemId) {
    console.log("Delete item with ID " + itemId);
    axios.delete('/api/bird/' + itemId)
    .then(res => {
      this.getBirds();
    })
    .catch((error) => {
      console.log(error);
    });
  }

  render() {
    return(
      <div>
        <br/>
        <BirdForm
          addBird = { this.addBird }
          />
        <br/>
        <BirdTable
          birds={ this.state.birds }
          deleteBird={ this.deleteBird }
          />
      </div>
    );
  }
}

export default Birds;
