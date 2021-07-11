import React from "react";

const Mycomponent = (props) => {
  return (
    <div>
      {props.name}
      {props.id}
      <br />
      children 값은 {props.children} 입니다.
    </div>
  );
};

Mycomponent.defaultProps = {
  name: "기본 이름",
};

export default Mycomponent;

// ----------------------------

import React from "react";
import MyComponent from "./MyComponents";
import "./App.css";

function App() {
  return (
    <MyComponent id="a" name="react">
      리액트
      <h1>react App</h1>
    </MyComponent>
  );
}
export default App;

// -----------------------------

// reacta
// children 값은 리액트
// react App
// 입니다.