import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

class LoginForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      password: ''
    };
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  };

  handleSubmit(e) {
    e.preventDefault();
    console.log(this.state.password);
  }

  render() {
    return(
      <form id="login-form">
        <FormGroup controlId="password">
          <ControlLabel>Password</ControlLabel>
          <FormControl
            type="password"
            value={this.state.password}
            placeholder=""
            onChange={this.handlePasswordChange}
          />
        </FormGroup>
        <Button type="submit" onClick={this.handleSubmit}>Log In</Button>
      </form>
    );
  }
}

export default LoginForm;
