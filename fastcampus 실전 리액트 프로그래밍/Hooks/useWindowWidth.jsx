import React, { useState } from "react";
import useEffect from "./useEffect";

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return window.removeEventListener("resize", onResize);
  }, []);
  return width; // 1
};

const WidthPrinter = () => {
  const width = useWindowWidth(); // 2
  return <div>{`width is ${width}`}</div>;
};

// 1 useWindowWidth 훅은 창의 너비를 저장해 두고 필요할 때마다 값을 제공한다.
// 2 창의 너비가 변경되면 새로운 창의 너비로 다시 렌더링된다
