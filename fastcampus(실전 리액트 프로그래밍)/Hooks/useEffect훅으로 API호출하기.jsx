import React, { useState } from "react";
import useEffect from "./useEffect";

const USEEFFECTAPI = () => {
  const [user, setUser] = useState(null); // 1
  useEffect(() => {
    getUserApi(userId).then((data) => setUser(data)); // 2
  }, [userId]); // 3
  return (
    <div>
      {!user && <p>사용자 정보를 가져오는 중...</p>}
      {user && (
        <>
          <p>{`name is ${user.name}`}</p>
          <p>{`age is ${user.age}`}</p>
        </>
      )}
    </div>
  );
};

export default USEEFFECTAPI;

// 1에서 API 결괏값을 저장할 상탯값이다.
// 2에서 부수 효과 함수에서 API 통신을 하며, 받아온 데이터는 user 상탯값에 저장한다.
// 3에서 부수 효과 함수는 렌더링할 때마다 호출되기 때문에 API 통신을 불필요하게 많이 하게된다. 이를 방지하기 위해 두 번째 매개변수로 배열을 입력하면 배열의 값이 볒ㄴ경되는 경우에만 함수가 호출된다.
// 이 배열을 의존성 배열이라고 한다.
