import React, { useState } from "react";
// useState
const hook1 = () => {
  const [count, setCount] = useState({ value: 0 });
  function onClick() {
    // setCount({ value: count.value + 1 });
    // setCount({ value: count.value + 1 });
    setCount((prev) => prev.value + 1);
    setCount((prev) => prev.value + 1);
  }
  console.log("render called");
  return (
    <div>
      <h2>{count.value}</h2>
      <button onClick={onClick}>증가</button>
    </div>
  );
};

export default hook1;

// 상탯값 변경 함수는 비동기로 처리되지만 그 순서가 보장된다.
