import React, { useState } from "react";

const USESTATE = () => {
  const [state, setState] = useState({ name: "", age: 0 }); // 1

  return (
    <div>
      <p>{`name is ${state.name}`}</p>
      <p>{`age is ${state.age}`}</p>
      <input
        type="text"
        value={state.name}
        onChange={(e) => setState({ ...state, name: e.target.value })} // 2
      />
      <input
        type="number"
        value={state.number}
        onChange={(e) => setState({ ...state, number: e.target.value })}
      />
    </div>
  );
};

export default USESTATE;

// 1에서 두 상탯값을 하나의 객체로 관리한다.
// 2에서 useState 훅은 이전 상탯값을 덮어쓰기 때문에 ...state와 같은 코드가 필요하다. 이렇게 상탯값을 하나의 객체로 관리할 때는 useReducer 훅을 사용하는것이 좋다
