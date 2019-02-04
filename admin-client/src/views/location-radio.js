import React, { Component } from 'react';
import { ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

class LocationRadio extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      value: [1, 4]
    };
  }

  handleChange(e) {
    this.setState({ value: e });
    console.log("Filter: " + e);

    if (e === 1) {
      this.props.updateFilter({latitude: "0", longitude: "0"});
    }
    else if (e === 2) {
      this.props.updateFilter({latitude: "53.038", longitude: "-1.162"});
    }
    else if (e === 3) {
      this.props.updateFilter({latitude: "51.474", longitude: "-0.037"});
    }
  }

  render() {
    return(
      <div>
        <ButtonToolbar>
          <ToggleButtonGroup
            type="radio"
            name="location"
            value = {this.state.value}
            onChange={this.handleChange}
          >
            <ToggleButton value={1}>All locations</ToggleButton>
            <ToggleButton value={2}>Hucknall</ToggleButton>
            <ToggleButton value={3}>London</ToggleButton>
          </ToggleButtonGroup>
        </ButtonToolbar>
      </div>
    );
  }

}

export default LocationRadio;
