import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import Index from './views/index';
import LoginForm from './views/login-form';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component {

  render() {
    return (
      <Router basename="/admin">
        <div id="App" className="container">
          <h1>Freader Hub</h1>
          <br/>
          <Route path="/" exact component={Index}/>
          <Route path="/login/" component={LoginForm}/>
        </div>
      </Router>
    );
  }
}

export default App;
