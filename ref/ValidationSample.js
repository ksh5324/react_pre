import React, { Component } from "react";

class ValidationSample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      clicked: false,
      validated: false,
    };
  }
  handleClick = () => {
    this.setState({
      clicked: true,
      validated: this.state.password === "0000",
    });
    this.input.focus();
  };
  handleChange = (e) => {
    this.setState({ password: e.target.value });
  };
  kkk = (e) => {
    if (e.key === "Enter") {
      this.handleClick();
    }
  };

  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.password}
          onChange={this.handleChange}
          className={
            this.state.clicked
              ? this.state.validated
                ? "success"
                : "failure"
              : ""
          }
          ref={(ref) => (this.input = ref)}
          onKeyPress={this.kkk}
        ></input>
        <button onClick={this.handleClick}>Vaildate</button>
      </div>
    );
  }
}

export default ValidationSample;
