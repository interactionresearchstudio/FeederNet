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

    this.state = {
      feederName: '',
      feederStub: '',
      feederLatitude: '',
      feederLongitude: ''
    };
  }

  // Handle form changes
  handleNameChange(e) {
    this.setState({
      feederName: e.target.value,
      feederStub: e.target.value.replace(/\s/g,'')
    });
  }
  handleStubChange(e) {
    this.setState({ feederStub: e.target.value });
  }
  handleLatitudeChange(e) {
    this.setState({ feederLatitude: e.target.value} );
  }
  handleLongitudeChange(e) {
    this.setState({ feederLongitude: e.target.value} );
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
          feederLongitude: ''
        });
      });
  }

  render() {
    return(
      <form>
        <Row>
          <Col sm={6}>
            <FormGroup controlId="feederName">
              <ControlLabel>Feeder name</ControlLabel>
              <FormControl
                type="text"
                value={this.state.feederName}
                placeholder="Feeder 1"
                onChange={this.handleNameChange}
                />
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup controlId="feederStub">
              <ControlLabel>Feeder stub</ControlLabel>
              <FormControl
                type="text"
                value={this.state.feederStub}
                placeholder="123456789"
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
          <Button type="submit" onClick={this.handleSubmit}>Add New Feeder</Button>
        </div>
      </form>
    );
  }

}

export default FeederForm;
