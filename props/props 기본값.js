import React from "react";

const Mycomponent = (props) => {
  return <div>{props.name}</div>;
};

Mycomponent.defaultProps = {
  name: "기본 이름",
};

export default Mycomponent;


//---------------------------------

import React from "react";
import MyComponent from "./MyComponents";
import "./App.css";

function App() {
  return <MyComponent name="react" />;
}
export default App;
