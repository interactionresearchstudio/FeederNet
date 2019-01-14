import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Index from './views/index';
import LoginForm from './views/login-form';
import './App.css';

class App extends Component {

  render() {
    return (
      <Router>
        <div id="App" className="container">
          <h1>FeederNet Admin</h1>
          <br/>
          <Route path="/" exact component={Index}/>
          <Route path="/login/" component={LoginForm}/>
        </div>
      </Router>
    );
  }
}

export default App;
