import React, { useState } from "react";

const UseState2 = () => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");

  const handleChange = (e) => {
    setName(e.target.value);
  };
  const handleChangeNick = (e) => {
    setNickname(e.target.value);
  };
  return (
    <div>
      <input type="text" value={name} onChange={handleChange}></input>
      <input type="text" value={nickname} onChange={handleChangeNick}></input>
      <p>이름: {name}</p>
      <p>별명: {nickname}</p>
    </div>
  );
};

export default UseState2;
