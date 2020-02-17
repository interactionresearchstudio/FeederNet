import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import axios from 'axios';

class Configure extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.renderFormInput = this.renderFormInput.bind(this);

    // States:
    // idle - waiting for user to start process
    // prog - waiting for user to put feeder in programming mode
    // programming - waiting for server to program device
    // configuring - waiting for server to configure device
    // registering - waiting for server to register device
    // complete - process complete

    this.state = {
      registrationState: "idle",
      instructionText: "Register a new feeder.",
      buttonText: "Start",
      isButtonDisabled: false,
      feederName: null,
    };
  }

  handleButtonClick() {
    if (this.state.registrationState === "idle") {
      // Show user how to put device into programming mode
      this.setState({
        instructionText: "Whilst holding down the GPIO0 button, press and release the RESET button. Then, release the GPIO0 button. When you're ready, click Next.",
        buttonText: "Next",
        registrationState: "prog"
      });
    } else if (this.state.registrationState === "prog") {
      // User has reset board. let's move onto programming.
      this.setState({
        instructionText: "Programming feeder...",
        registrationState: "programming",
        isButtonDisabled: true
      }, () => {
        this.beginProgramming();
      });
    } else if (this.state.registrationState === "complete" || this.state.registrationState === "err") {
      // Let's start from prog again.
      this.setState({
        instructionText: "Whilst holding down the prog0 button, press and release the RESET button.",
        buttonText: "Next",
        registrationState: "prog"
      });
    }
  }

  beginProgramming() {
    // Program
    axios.post('/api/program')
      .then(res => {
        console.log(res);
        this.setState({
          instructionText: "Please press RESET button once.",
          registrationState: "configuring",
          buttonText: "Next",
          isButtonDisabled: true
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
        this.setState({ instructionText: "Registering feeder..."}, () => {
          // Register
          let postData;
          if (this.state.feederName !== null) {
            postData = {
              feederName: this.state.feederName
            };
          }
          axios.post('/api/register', postData)
            .then(__res => {
              console.log(__res);
              this.setState({
                instructionText: "Success! Feeder registered successfuly.",
                registrationState: "complete",
                isButtonDisabled: false,
                buttonText: "Register Another Feeder"
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
      buttonText: "Retry"
    });
  }

  handleNameChange(e) {
    this.setState({
      feederName: e.target.value
    });
  }

  renderFormInput() {
    if (this.state.registrationState === "idle") {
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
        {this.renderFormInput()}
        <p>{this.state.instructionText}</p>
        <Button
          variant="primary"
          onClick={this.handleButtonClick}
          disabled={this.state.isButtonDisabled}
        >
          {this.state.buttonText}
        </Button>
      </>
    );
  }
}

export default Configure;
