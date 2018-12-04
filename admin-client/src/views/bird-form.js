import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button, Row, Col } from 'react-bootstrap';

class BirdForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleRfidChange = this.handleRfidChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      birdName: '',
      birdRfid: ''
    };
  }

  // Handle form changes
  handleRfidChange(e) {
    this.setState({ birdRfid: e.target.value });
  }
  handleNameChange(e) {
    this.setState({ birdName: e.target.value });
  }

  // Handle submit
  handleSubmit(e) {
    e.preventDefault();

    this.props.addBird(this.state.birdName, this.state.birdRfid, (error) => {
      if (error) {
        console.log("ERROR: Could not add bird.");
        return;
      }

      this.setState({
        birdName: '',
        birdRfid: ''
      });
    });
  }

  render() {
    return(
      <form>
        <Row>
          <Col sm={6}>
            <FormGroup controlId="birdName">
              <ControlLabel>Bird name</ControlLabel>
              <FormControl
                type="text"
                value={this.state.birdName}
                placeholder="Apollo"
                onChange={this.handleNameChange}
                />
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup controlId="birdRfid">
              <ControlLabel>RFID tag</ControlLabel>
              <FormControl
                type="text"
                value={this.state.birdRfid}
                placeholder="123456789"
                onChange={this.handleRfidChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <div className="form-row">
          <Button type="submit" onClick={this.handleSubmit}>Add New Bird</Button>
        </div>
      </form>
    );
  }

}

export default BirdForm;
