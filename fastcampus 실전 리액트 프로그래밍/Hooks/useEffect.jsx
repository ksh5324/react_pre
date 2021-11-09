import React, { useState } from "react";

const useEffect = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `업데이트 횟수: ${count}`; // 1
  });
  return <button onClick={() => setCount(count + 1)}>increase</button>; // 2
};

export default useEffect;

// 특별한 이유가 없다면 모든 부수 효과는 useEffect 훅에서 처리하는게 좋다
// api를 호출하는 것과 이벤트 처리 함수를 등록하고 해제하는 것 등이 부수 효과의 구체적인 예다

// 1에서 useEffect 훅에 입력하는 함수를 부수 효과 함수라고 한다. 부수 효과 함수는 렌더링 결과가 실제 돔에 반영된 후 호출된다.
// 2에서 버튼을 클릭할 때마다 다시 렌더링되고 렌더링이 끝나면 부수 효과 함수가 호출된다.
