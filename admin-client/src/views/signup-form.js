import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

class SignupForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      username: '',
      password: ''
    };
  }

  handleUsernameChange(e) {
    this.setState({username: e.target.value});
  };

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  };

  handleSubmit(e) {
    e.preventDefault();
    console.log(this.state.username);
  }

  render() {
    return(
      <form id="signup-form">
        <FormGroup controlId="username">
          <ControlLabel>Username</ControlLabel>
          <FormControl
            type="text"
            value={this.state.username}
            placeholder=""
            onChange={this.handleUsernameChange}
          />
        </FormGroup>
        <FormGroup controlId="password">
          <ControlLabel>Password</ControlLabel>
          <FormControl
            type="password"
            value={this.state.password}
            placeholder=""
            onChange={this.handlePasswordChange}
          />
        </FormGroup>
        <Button type="submit" onClick={this.handleSubmit}>Sign up</Button>
      </form>
    );
  }
}

export default SignupForm;
