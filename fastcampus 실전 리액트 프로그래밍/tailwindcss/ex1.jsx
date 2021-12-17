import React from "react";

const Background = () => {
  return (
    <div style={{ height: 300 }}>
      <div
        style={{ height: 300 }}
        class="bg-purple-600 bg-opacity-100"
      ></div>
      <div
        style={{ height: 300 }}
        class="bg-purple-600 bg-opacity-75"
      ></div>
      <div
        style={{ height: 300 }}
        class="bg-purple-600 bg-opacity-50"
      ></div>
      <div
        style={{ height: 300 }}
        class="bg-purple-600 bg-opacity-25"
      ></div>
      <div
        style={{ height: 300 }}
        className="bg-green-200"
      ></div>
    </div>
  );
};

export default Background;
