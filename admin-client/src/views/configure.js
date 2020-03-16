import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button, Col, Row} from 'react-bootstrap';
import axios from 'axios';
import image_connections from '../images/Programming_Diagram_Visuals_1500_1000_01.jpg';
import image_prog from '../images/programming-mode-1000h.gif';
import image_reset from '../images/Programming_Diagram_Visuals_1500_1000_10.jpg';
import image_name from '../images/Programming_Diagram_Visuals_1500_1000_12.jpg';
import image_programming from '../images/Programming_Diagram_Visuals_1500_1000_13.jpg';
import image_registering from '../images/Programming_Diagram_Visuals_1500_1000_14.jpg';
import image_complete from '../images/Programming_Diagram_Visuals_1500_1000_15.jpg';
import image_error from '../images/Programming_Diagram_Visuals_1500_1000_16.jpg';

const text_idle = "To register a feeder, make sure your feeder is plugged in as pictured. When ready, click Start.";
const text_name = "Please type a name for your feeder. Make sure it's a unique name. You can change it later.";
const text_prog = "Whilst holding down the GPIO0 button, press and release the RESET button. Then release the GPIO0 button. The red light on the circuit board should remain on.";
const text_programming = "Programming board... Please do not unplug the feeder.";
const text_configuring = "Press and release the RESET button.";
const text_registering = "Registering board...";

class Configure extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.renderFormInput = this.renderFormInput.bind(this);

    // States:
    // idle - waiting for user to start process
    // name - waiting for user to give the freader a name
    // prog - waiting for user to put feeder in programming mode
    // programming - waiting for server to program device
    // configuring - waiting for server to configure device
    // registering - waiting for server to register device
    // complete - process complete

    this.state = {
      registrationState: "idle",
      instructionText: text_idle,
      instructionImage: image_connections,
      buttonText: "Start",
      isButtonDisabled: false,
      feederName: "",
    };
  }

  handleButtonClick() {
    if (this.state.registrationState === "idle") {
      this.setState({
        instructionText: text_name,
        buttonText: "Next",
        registrationState: "name",
        instructionImage: image_name
      });
    } else if (this.state.registrationState === "name") {
      // Show user how to put device into programming mode
      this.setState({
        instructionText: text_prog,
        buttonText: "Next",
        registrationState: "prog",
        instructionImage: image_prog
      });
    } else if (this.state.registrationState === "prog") {
      // User has reset board. let's move onto programming.
      this.setState({
        instructionText: text_programming,
        registrationState: "programming",
        isButtonDisabled: true,
        instructionImage: image_programming
      }, () => {
        this.beginProgramming();
      });
    } else if (this.state.registrationState === "complete" || this.state.registrationState === "err") {
      // Let's start from prog again.
      this.setState({
        instructionText: text_name,
        buttonText: "Next",
        registrationState: "name",
        instructionImage: image_name
      });
    }
  }

  beginProgramming() {
    // Program
    axios.post('/api/program')
      .then(res => {
        console.log(res);
        this.setState({
          instructionText: text_configuring,
          registrationState: "configuring",
          buttonText: "Next",
          isButtonDisabled: true,
          instructionImage: image_reset
        }, () => {
          this.beginConfiguring();
        });
      })
      .catch((err) => {
        console.log("ERROR: Programming failed.");
        console.log(err);
        this.displayError("Error: Failed to configure device. Please check that the feeder is connected to the Raspberry Pi and try again.");
      });
  }

  beginConfiguring() {
    // Configure
    axios.post('/api/configure')
      .then(_res => {
        console.log(_res);
        this.setState({
          instructionText: text_registering,
          registrationState: "registering",
          instructionImage: image_registering
        }, () => {
          // Register
          let postData;
          if (this.state.feederName !== "") {
            postData = {
              feederName: this.state.feederName
            };
            console.log("Feeder name: " + this.state.feederName);
          }
          axios.post('/api/register', postData)
            .then(__res => {
              console.log(__res);
              this.setState({
                instructionText: "Success! Feeder registered successfuly.",
                registrationState: "complete",
                isButtonDisabled: false,
                buttonText: "Register Another Feeder",
                instructionImage: image_complete
              });
            })
            .catch((__err) => {
              console.error("ERROR: Register failed.");
              console.error(__err);
              this.displayError("Error: Failed to register device. Please try again.");
            });
        });
      })
      .catch((_err) => {
        console.log("ERROR: Configure failed.");
        console.log(_err);
        this.displayError("Error: Failed to configure device. Please try again. ");
      });
  }

  displayError(err) {
    this.setState({
      instructionText: err,
      registrationState: "err",
      isButtonDisabled: false,
      buttonText: "Retry",
      instructionImage: image_error
    });
  }

  handleNameChange(e) {
    this.setState({
      feederName: e.target.value
    });
  }

  renderFormInput() {
    if (this.state.registrationState === "name") {
      return(
        <FormGroup controlId="feederNameForm">
          <ControlLabel>Feeder name</ControlLabel>
          <FormControl
            type="text"
            value={this.state.feederName}
            placeholder="Type new feeder name here"
            onChange={this.handleNameChange}
            />
        </FormGroup>
      );
    }
    else {
      return null;
    }
  }

  render() {
    return (
      <>
        <br/>
        <Row>
          <Col md={6}>
            <img src={this.state.instructionImage} width="100%"/>
          </Col>
          <Col md={6}>
            {this.renderFormInput()}
            <p>{this.state.instructionText}</p>
            <Button
              variant="primary"
              onClick={this.handleButtonClick}
              disabled={this.state.isButtonDisabled}
            >
              {this.state.buttonText}
            </Button>
          </Col>
        </Row>
      </>
    );
  }
}

export default Configure;
