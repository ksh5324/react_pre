import React, { Component } from "react";
import propTypes from "prop-types";

class ChildComponent extends Component {
  render() {
    const { boolValue, numValue, arrayValue, objValue, nodeValue, funcValue } =
      this.props;
    return (
      <div>
        <span>불리언값: {boolValue}</span>
        <br />
        <span>숫자값: {numValue}</span>
        <br />
        <span>배열값: {arrayValue}</span>
        <br />
        <span>객체값: {String(objValue)}</span>
        <br />
        <span>노드값: {nodeValue}</span>
        <br />
        <span>함수값: {String(funcValue)}</span>
      </div>
    );
  }
}

ChildComponent.propTypes = {
  boolValue: propTypes.bool,
  numValue: propTypes.number,
  arrayValue: propTypes.arrayOf(propTypes.number),
  objValue: propTypes.object,
  nodeValue: propTypes.node,
  funcValue: propTypes.func,
};

export default ChildComponent;
