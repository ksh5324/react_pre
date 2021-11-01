import React, { memo, useEffect, useRef } from "react";
import Greeting from "./Greeting";

const Profile = () => {
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  return (
    <div>
      <Greeting ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>텍스트로 이동</button>
    </div>
  );
};

export default Profile;
