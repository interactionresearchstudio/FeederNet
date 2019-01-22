import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button, Alert } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class LoginForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      username: '',
      password: '',
      showAlert: false,
      redirect: false
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

    const postData = {
      username: this.state.username,
      password: this.state.password
    }

    axios.post('/api/login', postData)
      .then(res => {
        console.log(res);
        console.log("Login successful.");
        this.setState({redirect: true});
      })
      .catch((error) => {
        console.log("Authentication failed!");
        console.log(error);
        this.setState({showAlert: true});
      });
  }

  handleRedirect() {
    if (this.state.redirect) {
      return <Redirect to="/"/>
    }
  }

  renderAlert() {
    if(this.state.showAlert) {
      return(
        <Alert bsStyle="danger">
          Username / password not found.
        </Alert>
      );
    }
  }

  render() {
    return(
      <div>
        {this.renderAlert()}
        {this.handleRedirect()}
        <form id="login-form">
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
          <Button type="submit" onClick={this.handleSubmit}>Log In</Button>
        </form>
      </div>
    );
  }
}

export default LoginForm;
