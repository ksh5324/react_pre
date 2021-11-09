# 메모제이션 훅: useMemo useCallback

useMemo와 useCallback은 이전 값을 기억해서 성능을 최적화 하는 용도로 사용된다.

## 메모제이션

```txt
메모이제이션(memoization)은 컴퓨터 프로그램이 동일한 계산을 반복해야 할 때, 이전에 계산한 값을 메모리에 저장함으로써 동일한 계산의 반복 수행을 제거하여 프로그램 실행 속도를 빠르게 하는 기술이다. 동적 계획법의 핵심이 되는 기술이다. 메모아이제이션이라고도 한다.
```

## useMemo

useMemo 훅은 계산량이 많은 함수의 반환값을 재활용하는 용도로 사용된다.

```jsx
import React, { useMemo } from "react";
import { runExpensiveJob } from "./util";

function MyComponent({ v1, v2 }) {
  const value = useMemo(() => runExpensiveJob(v1, v2), [v1, v2]); // 1
  return <p>{`value is ${value}`}</p>;
}
```

1 useMemo 훅의 첫 번째 매개변수로 함수를 입력한다. useMemo 훅은 이 함수가 반환한 값을 기억한다. useMemo 훅의 두 번째 매개변수는 의존성 배열이다. 의존성 배열이 변경되지 않으면 이전에 반환된 값을 재사용한다. 만약 배열의 값이 배경됐으면 첫 번째 매개변수로 입력된 함수를 실행하고 그 반환값을 기억한다.

## useCallback

useMemo 훅은 로다시 같은 라이브러리에서 제공해 주는 메모이제이션과 비슷하다. 반면에 useCallback은 리액트의 렌더링 성능을 위해 제공되는 훅이다.
컴포넌트가 렌더링될 때마다 새로운 함수를 생성해서 자식 컴포넌트의 속성 값으로 입력되는 경우가 많다.
리액트 팀에서는 최근의 브라우저에서 함수 생성이 성능에 미치는 영향은 작다고 주장한다. 그보다 속성값이 매번 변경되기 때문에 자식 컴포넌트에서 React.memo를 사용해도 불필요한 레더링이 발생한다는 문제점이 있다. 리액트에서는 이 문제를 해결하기 위해 useCallback 훅을 제공한다.

```js
import React, { useState } from "react";
import { saveToServer } from "./api";
import UserEdit from "./UserEdit";
function Profile() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const onSave = useCallback(() => saveToServer(name, age), [name, age]);
  return (
    <div>
      <p>{`name is ${name}`}</p>
      <p>{`age is ${age}`}</p>
      <UserEdit onSave={onSave} setName={setName} setAge={setAge} />
    </div>
  );
}
```
