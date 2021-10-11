import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Detail from "../routes/Detail";
import Home from "../routes/Home";

const App = () => {
  return (
    <Router>
      <Route path="/" component={Home} exact></Route>
      <Route path="/:id" component={Detail}></Route>
    </Router>
  );
};

export default App;
