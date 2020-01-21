import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

class Configure extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleButtonClick = this.handleButtonClick.bind(this);

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
    };
  }

  handleButtonClick() {
    if (this.state.registrationState === "idle") {
      // Show user how to put device into programming mode
      this.setState({
        instructionText: "Whilst holding down the prog0 button, press and release the RESET button.",
        buttonText: "Next",
        registrationState: "prog"
      });
    } else if (this.state.registrationState === "prog") {
      // User has reset board. let's move onto programming.
      this.setState({
        instructionText: "Programming feeder...",
        registrationState: "programming",
        isButtonDisabled: true
      });
      this.beginSetup();
    } else if (this.state.registrationState === "complete" || this.state.registrationState === "err") {
      // Let's start from prog again.
      this.setState({
        instructionText: "Whilst holding down the prog0 button, press and release the RESET button.",
        buttonText: "Next",
        registrationState: "prog"
      });
    }
  }

  beginSetup() {
    // Program
    axios.post('/api/program')
      .then(res => {
        console.log(res);
        this.setState({ instructionText: "Configuring feeder..." }, () => {
          // Configure
          axios.post('/api/configure')
            .then(_res => {
              console.log(_res);
              this.setState({ instructionText: "Registering feeder..."}, () => {
                // Register
                axios.post('/api/register')
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
                    console.log(__err);
                    this.displayError(__err);
                  });
              });
            })
            .catch((_err) => {
              console.log(_err);
              this.displayError(_err);
            });
        });
      })
      .catch((err) => {
        console.log(err);
        this.displayError(err);
      });
  }

  displayError(err) {
    this.setState({
      instructionText: "ERROR: " + err,
      registrationState: "err",
      isButtonDisabled: false,
      buttonText: "Retry"
    });
  }

  render() {
    return (
      <>
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
