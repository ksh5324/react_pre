import React, { useEffect, useState } from "react";

const UseEffect = () => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  //   useEffect(() => {
  //     console.log("렌더링이 되었습니다.");
  //     console.log({
  //       name,
  //       nickname,
  //     });
  //   });

  //   useEffect(() => {
  //     console.log(name);
  //   }, [name]);

  useEffect(() => {
    console.log("effect");
    console.log(name);
    return () => {
      console.log("cleanup");
      console.log(name);
    };
  }, [name]);

  const onChangeName = (e) => {
    setName(e.target.value);
  };
  const onChangeNick = (e) => {
    setNickname(e.target.value);
  };
  return (
    <div>
      <input type="text" value={name} onChange={onChangeName}></input>
      <input type="text" value={nickname} onChange={onChangeNick}></input>
      <p>이름: {name}</p>
      <p>별명: {nickname}</p>
    </div>
  );
};
export default UseEffect;
