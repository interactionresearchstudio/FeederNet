import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

class RegisterFeederButton extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleButtonClick = this.handleButtonClick.bind(this);

    this.state = {
      buttonText: "Register Feeder",
      isDisabled: false
    };
  }

  handleButtonClick() {
    this.setState({
      buttonText: "Please wait...",
      isDisabled: true
    }, () => {
      axios.post('/api/register')
        .then(res => {
          this.setState({buttonText: "Success!"}, () => {
            setTimeout(() => {
              this.setState({buttonText: "Register Feeder", isDisabled: false});
            }, 2000);
          });
        })
        .catch((err) => {
          console.log(err);
          this.setState({buttonText: "Error!"}, () => {
            setTimeout(() => {
              this.setState({buttonText: "Register Feeder", isDisabled: false});
            }, 2000);
          });
        });
    });
  }

  render() {
    return(
      <Button
        variant="primary"
        onClick={this.handleButtonClick}
        disabled={this.state.isDisabled}
      >
        {this.state.buttonText}
      </Button>
    );
  }
}

export default RegisterFeederButton;
