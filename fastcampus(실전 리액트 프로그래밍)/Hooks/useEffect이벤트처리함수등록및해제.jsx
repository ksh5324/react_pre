import React, { useState } from "react";
import useEffect from "./useEffect";

const USEEFFECTEVENT = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize); // 1
    return () => {
      window.removeEventListener("resize", onResize); // 2
    };
  }, []); // 3
  return <div>{`width is ${width}`}</div>;
};

export default USEEFFECTEVENT;

// 1에서 창 크기가 변경될 때마다 onResize 이벤트 처리 함수가 호출되도록 등록한다.
// 2에서 부수 효과 함수는 함수를 반환할 수 있다. 반환된 함수는 부수 효과 함수가 호출되기 직전에 호출되고, 컴포넌트가 사라지기 직전에 마지막으로 호출된다.
// 3에서 의존성 배열로 빈 배열을 입력하면 ㅓㅁ포넌트가 생성될 때만 부수 효과함수가 호출되고, 컴포넌트가 사라질 때만 반환된 함수가 호출된다.
