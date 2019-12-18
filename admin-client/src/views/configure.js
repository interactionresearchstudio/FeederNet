import React, { Component } from 'react';
import ProgramFeederButton from './program-feeder-button';
import RegisterFeederButton from './register-feeder-button';
import ConfigureFeederButton from './configure-feeder-button';

class Configure extends Component {
  render() {
    return (
      <>
        <ProgramFeederButton/>
        <br/>
        <ConfigureFeederButton/>
        <br/>
        <RegisterFeederButton/>
      </>
    );
  }
}

export default Configure
