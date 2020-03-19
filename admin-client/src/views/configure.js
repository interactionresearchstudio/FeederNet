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
import progress_1 from '../images/BirdStatusBar_1.jpg';
import progress_2 from '../images/BirdStatusBar_2.jpg';
import progress_3 from '../images/BirdStatusBar_3.jpg';
import progress_4 from '../images/BirdStatusBar_4.jpg';
import progress_5 from '../images/BirdStatusBar_5.jpg';
import progress_6 from '../images/BirdStatusBar_6.jpg';
import progress_7 from '../images/BirdStatusBar_7.jpg';
import progress_8 from '../images/BirdStatusBar_8.jpg';
import progress_9 from '../images/BirdStatusBar_9.jpg';

const text_idle = "To register a freader, make sure your freader is plugged in as pictured. When ready, click Start.";
const text_name = "Please type a name for your freader. Make sure it's a unique name. You can change it later.";
const text_prog = "Whilst holding down the GPIO0 button, press and release the RESET button. Then release the GPIO0 button. The red light on the circuit board should remain on.";
const text_programming = "Programming board... Please do not unplug the freader.";
const text_configuring = "Press and release the RESET button.";
const text_registering = "Registering board...";

const progress_images = [
  progress_1,
  progress_2,
  progress_3,
  progress_4,
  progress_5,
  progress_6,
  progress_7,
  progress_8,
  progress_9
];

class Configure extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.renderFormInput = this.renderFormInput.bind(this);

    // States:
    // 0 idle - waiting for user to start process
    // 1 name - waiting for user to give the freader a name
    // 2 prog - waiting for user to put feeder in programming mode
    // 3 programming - waiting for server to program device
    // 4 configuring - waiting for server to configure device
    // 6 registering - waiting for server to register device
    // 7 complete - process complete
    // 8 err - erorred out before finishing

    this.state = {
      registrationState: "idle",
      registrationIndex: 0,
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
        registrationIndex: 1,
        instructionImage: image_name
      });
    } else if (this.state.registrationState === "name") {
      // Show user how to put device into programming mode
      this.setState({
        instructionText: text_prog,
        buttonText: "Next",
        registrationState: "prog",
        registrationIndex: 2,
        instructionImage: image_prog
      });
    } else if (this.state.registrationState === "prog") {
      // User has reset board. let's move onto programming.
      this.setState({
        instructionText: text_programming,
        registrationState: "programming",
        registrationIndex: 3,
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
        registrationIndex: 1,
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
          registrationIndex: 4,
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
        this.displayError("Error: Failed to configure device. Please check that the freader is connected to the Raspberry Pi and try again.");
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
          registrationIndex: 6,
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
                instructionText: "Success! Freader registered successfuly.",
                registrationState: "complete",
                registrationIndex: 7,
                isButtonDisabled: false,
                buttonText: "Register Another Freader",
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
      registrationIndex: 8,
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
          <ControlLabel>Freader name</ControlLabel>
          <FormControl
            type="text"
            value={this.state.feederName}
            placeholder="Type new freader name here"
            onChange={this.handleNameChange}
            />
        </FormGroup>
      );
    }
    else {
      return null;
    }
  }

  renderProgressBar() {
    return(
      <img src={progress_images[this.state.registrationIndex]} width="100%"/>
    );
  }

  render() {
    return (
      <>
        <br/>
        <Row>
          <Col md={12}>
            {this.renderProgressBar()}
          </Col>
        </Row>
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
