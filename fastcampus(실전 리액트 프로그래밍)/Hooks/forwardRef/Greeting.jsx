import React, { forwardRef } from "react";

const Greeting = forwardRef((props, ref) => {
  return (
    <div>
      <input type="text" ref={ref} />
      <button>저장</button>
    </div>
  );
});

export default Greeting;
