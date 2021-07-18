import React, { Component } from "react";

class EventPractice3 extends Component {
  state = {
    message: "",
    username: "",
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleClick = (e) => {
    alert(this.state.message);
    this.setState({
      message: "",
      username: "",
    });
  };

  render() {
    return (
      <div>
        <h1>이벤트 연습</h1>
        <input
          type="text"
          name="message"
          placeholder="아무거나 입력해 보세요"
          value={this.state.message}
          onChange={this.handleChange}
        />
        <input
          type="text"
          name="message"
          placeholder="아무거나 입력해 보세요"
          value={this.state.username}
          onChange={this.handleChange}
        />

        <button onClick={this.handleClick}>확인</button>
      </div>
    );
  }
}

export default EventPractice3;
