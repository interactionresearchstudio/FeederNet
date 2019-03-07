import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button, Row, Col } from 'react-bootstrap';

class BirdForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleRfidChange = this.handleRfidChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);

    this.state = {
      birdName: '',
      birdRfid: '',
      birdId: '',
      updating: false
    };
  }

  // Handle form changes
  handleRfidChange(e) {
    this.setState({ birdRfid: e.target.value });
  }
  handleNameChange(e) {
    this.setState({ birdName: e.target.value });
  }

  placeData(birdData) {
    this.setState({
      birdName: birdData.name,
      birdRfid: birdData.rfid,
      birdId: birdData._id,
      updating: true
    });
  }

  // Handle submit
  handleSubmit(e) {
    e.preventDefault();

    this.props.addBird(this.state.birdName, this.state.birdRfid, (error) => {
      if (error) {
        console.log(error);
        return;
      }

      this.setState({
        birdName: '',
        birdRfid: '',
        birdId: '',
        updating: false
      });
    });
  }

  handleUpdate(e) {
    e.preventDefault();

    this.props.updateBird(
      this.state.birdId,
      {
        name: this.state.birdName,
        rfid: this.state.birdRfid
      }, (error) => {
        if (error) {
          console.log(error);
          return;
        }
        this.setState({
          birdName: '',
          birdRfid: '',
          birdId: '',
          updating: false
        });
      });
  }

  renderButton() {
    if(this.state.updating) {
      return(
        <Button type="submit" onClick={this.handleUpdate}>Update Bird</Button>
      );
    }
    else {
      return(
        <Button type="submit" onClick={this.handleSubmit}>Add New Bird</Button>
      );
    }
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
          { this.renderButton() }
        </div>
      </form>
    );
  }

}

export default BirdForm;
