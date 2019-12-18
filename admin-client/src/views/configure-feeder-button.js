import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

class ConfigureFeederButton extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleButtonClick = this.handleButtonClick.bind(this);

    this.state = {
      buttonText: "Configure Feeder",
      isDisabled: false
    };
  }

  handleButtonClick() {
    this.setState({
      buttonText: "Please wait...",
      isDisabled: true
    }, () => {
      axios.post('/api/configure')
        .then(response => {
          console.log(response);
          this.setState({buttonText: "Success!"}, () => {
            setTimeout(() => {
              this.setState({buttonText: "Configure Feeder", isDisabled: false});
            }, 2000);
          });
        })
        .catch((err) => {
          this.setState({buttonText: "Error!"}, () => {
            setTimeout(() => {
              this.setState({buttonText: "Configure Feeder", isDisabled: false});
            }, 2000);
          });
          console.log(err);
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

export default ConfigureFeederButton;
