import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button, Row, Col } from 'react-bootstrap';

class FeederForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleStubChange = this.handleStubChange.bind(this);
    this.handleLatitudeChange = this.handleLatitudeChange.bind(this);
    this.handleLongitudeChange = this.handleLongitudeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);

    this.state = {
      feederName: '',
      feederStub: '',
      feederLatitude: '',
      feederLongitude: '',
      feederId: '',
      updating: false
    };
  }

  placeData(feederData) {
    console.log(feederData);
    this.setState({
      feederName: feederData.name,
      feederStub: feederData.stub,
      feederLatitude: feederData.location.latitude,
      feederLongitude: feederData.location.longitude,
      feederId: feederData._id,
      updating: true
    });
  }

  // Handle form changes
  handleNameChange(e) {
    this.setState({
      feederName: e.target.value
    });
  }
  handleStubChange(e) {
    this.setState({ feederStub: e.target.value });
  }
  handleLatitudeChange(e) {
    console.log("Change latitude");
    this.setState({ feederLatitude: e.target.value} );
  }
  handleLongitudeChange(e) {
    this.setState({ feederLongitude: e.target.value} );
  }

  handleUpdate(e) {
    e.preventDefault();

    this.props.updateFeeder(
      this.state.feederId,
      {
        stub: this.state.feederStub,
        name: this.state.feederName,
        location: {
          latitude: this.state.feederLatitude,
          longitude: this.state.feederLongitude,
        }
      }, (error) => {
        if (error) {
          console.log(error);
          return;
        }
        this.setState({
          feederName: '',
          feederStub: '',
          feederLatitude: '',
          feederLongitude: '',
          updating: false
        });
      });
  }

  // Handle submit
  handleSubmit(e) {
    e.preventDefault();

    this.props.addFeeder(
      this.state.feederStub,
      this.state.feederName,
      this.state.feederLatitude,
      this.state.feederLongitude,
      (error) => {
        if (error) {
          console.log("ERROR: Could not add feeder.");
          return;
        }
        this.setState({
          feederName: '',
          feederStub: '',
          feederLatitude: '',
          feederLongitude: '',
          update: false
        });
      });
  }

  renderButton() {
    if(this.state.updating) {
      return(
        <Button type="submit" onClick={this.handleUpdate}>Update Freader</Button>
      );
    }
    else {
      return(
        <Button type="submit" onClick={this.handleSubmit}>Add New Freader</Button>
      );
    }
  }


  render() {
    return(
      <form>
        <Row>
          <Col sm={6}>
            <FormGroup controlId="feederName">
              <ControlLabel>Freader name</ControlLabel>
              <FormControl
                type="text"
                value={this.state.feederName}
                placeholder="Freader 1"
                onChange={this.handleNameChange}
                />
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup controlId="feederStub">
              <ControlLabel>Freader stub</ControlLabel>
              <FormControl
                type="text"
                value={this.state.feederStub}
                placeholder="00:00:00:00:00"
                onChange={this.handleStubChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <FormGroup controlId="latitude">
              <ControlLabel>Latitude</ControlLabel>
              <FormControl
                type="text"
                value={this.state.feederLatitude}
                placeholder="50.0000"
                onChange={this.handleLatitudeChange}
                />
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup controlId="longitude">
              <ControlLabel>Longitude</ControlLabel>
              <FormControl
                type="text"
                value={this.state.feederLongitude}
                placeholder="-1.0000"
                onChange={this.handleLongitudeChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <div className="form-row">
          { this.renderButton() }
        </div>
      </form>
    );
  }

}

export default FeederForm;
