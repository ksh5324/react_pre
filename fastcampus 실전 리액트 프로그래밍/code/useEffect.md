# useEffect

의존성 배열을 잘 관리하지 못해서 발생한 버그는 디버깅이 쉽지 않으므로 제대로 이해하고 사용해야 한다.

## 의존성 배열을 관리하는 방법

의존성 배열은 useEffect 훅에 입력하는 두 번째 매개변수다. 의존성 배열의 내용이 변경됐을 때 부수 효과 함수가 실행된다.
의존성 배열은 잘못 관리하면 쉽게 버그로 이어지므로 가능하면 입력하지 않는게 좋다. 다행히 의존성 배열은 대부분의 경우에 입력하지 않아도 되는데, 꼭 필요한 경우가 생기기도 한다.

### 부수 효과 함수에서 API를 호출하는 경우

부수 효과 함수에서 API를 호출한다면 불필요한 API 호출이 발생하지 않도록 주의해야 한다.

```jsx
function Profile({ userId }) {
  const [user, setUser] = useState();
  useEffect(() => {
    fetchUser(userId).then((data) => setUser(data));
  });
}

// fetchUser 함수는 렌더링을 할 때마다 호출되므로 비효율적이다.
// 이 문제를 해결하기 위해 의존성 배열에 빈 배열을 넣을 수도 있다. 하지만 이는 userId가 변경돼도 새로운 사용자 정보를 가져오지 못하기 때문에 올바른 해결책이 야니다.
```

```jsx
const [needDetail, setNeedDetail] = useState(false);
useEffect(() => {
  fetchUser(userId, needDetail).then((data) => setUser(data));
}, [userId]);
```

## useEffect 훅에서 async await 함수 사용하기

useEffect 훅에서 async await 함수를 사용하기 위해 부수 효과 함수를 async await 함수로 만들면 에러가 난다.
부수 효과 함수의 반환값은 항상 함수 타입이어야 하기 때문이다.

부수 효과 함수를 async await으로 만든 예

```jsx
useEffect(async () => {
  const data = await fetchUser(userId);
  setUser(data);
}, [userId]);

// async await 함수는 프로미스 객체를 반환하므로 부수 효과 함수가 될 수 없다.
// 부수 효과 함수는 함수만 반환할 수 있으며, 반환된 함수는 부수 효과 함수가 호출되기 직전과 컴포넌트가 사라지기 직전에 호출된다.
// useEffect 훅에서 async await 함수를 사용하는 한 가지 방법은 부수 효과 함수 내에서 async await 함수를 만들어서 호출하는 것이다.
```

```jsx
useEffect(() => {
  async function fetchAndSetUser() {
    const data = await fetchUser(userId);
    setUser(data);
  }
  fetchAndSetUser();
}, [userId]);
```

## fetchAndSetUser 함수 재사용하기

useEffect 훅 밖에서 fetchAndSetUser 함수가 필요한 경우

```jsx
function Profile({ userId }) {
  const [user, setUser] = useState();
  userEffect(() => {
    async function fetchAndSetUser(needDetail) {
      const data = await fetchUser(userId, needDetail);
      setUesr(data);
    }
    fetchAndSetUser(false);
  }, [userId]);

  if (!user) {
    return <h1>로딩...</h1>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{`캐시: ${user.cash}`}</p>
      <p>{`계정 생성일: ${user.createdAt}`}</p>
      <button onClick={() => fetchAndSetUser(true)}>더보기</button>
      <UserDetail user={user} />
    </div>
  );
}
```

다음과 같은 상황에서 간단하게 훅 밖으로 빼보면

```jsx
function Profile({ uesrId }) {
  const [user, setUesr] = useState();
  async function fetchAndSetUser(needDetail) {
    const data = await fetchUser(userId, needDetail);
    setUer(data);
  }
  useEffect(() => {
    fetchAndSetUser(false);
  }, [fetchAndSetUser]);
  // ...
}
```

훅 내부에서 fetchAndSetUser 함수를 사용하므로 해당 함수를 의존성 배열에 넣는다.
fetchAndSetUser 함수는 렌더링을 할 때마다 갱신되므로 결과적으로 fetchAndSetUser 함수는 렌더링을 할 때마다 호출된다.

해결:

```jsx
function Profile({ userId }) {
  const [user, setUser] = useState();
  const fetchAndSetUser = useCallback(
    async (needDetail) => {
      const data = await fetchUser(userId, needDetail);
      setUser(data);
    },
    [userId]
  );
  useEffect(() => {
    fetchAndSetUser(false);
  }, [fetchAndSetUser]);
}
```

useCallback 훅을 이용해서 fetchAndSetUser 함수가 필요할 때만 갱신되도록 개선했다.
fetchAndSetUser 함수는 userId가 변경될 때만 호출 된다.

## 의존성 배열을 없애는 방법

앞에서도 언급했지만 가능하다면 의존성 배열을 사용하지 않는 게 좋다. 의존성 배열을 관리하는데 생각보다 많은 시간과 노력이 들어가기 때문이다.
특히 속성 값으로 전달되는 함수를 의존성 배열에 넣는 순간, 그 함수는 useCallback 등을 사용해서 자주 변경되지 않도록 관리해야 한다.

부수 효과 함수 내에서 분기 처리하기

```jsx
function Profile({ userId }) {
  const [user, setUser] = useState();
  async function fetchAndSetUser(needDetail) {
    const data = await fetchUser(userId, needDetail);
    setUser(data);
  }
  useEffect(() => {
    if (!user || user.id !== userId) {
      fetchAndSetUSer(false);
    }
  });
}
// ...
```

## useState의 상탯값 변경 함수에 함수 입력하기

이전 상탯값을 기반으로 다음 상탯값을 계산하기 위해 상탯값을 의존성 배열에 추가하는 경우가 있다.
이런 경우 상탯값 변경 함수에 함수를 입력하면 상탯값을 의존성 배열에서 제거할 수 있다.

```jsx
function MyComponent() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    function onClick() {
      setCount(count + 1);
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [count]);
}

// 이전 상탯값을 기반으로 다음 상탯값을 계산한다.
// 이전 상탯값을 사용하기 위해 상탯값을 의존성 배열에 추가한다.
```

```jsx
function MyComponent() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    function onClick() {
      setCount((prev) => prev + 1); // 1
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }); // 2
}

// 이전 상탯값을 매개변수로 받는다.
// 이제 상탯값을 의존성 배열에서 제거 할 수 있다.
```

```jsx
function MyComponent() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    function onClick() {
      setCount((prev) => prev + 1);
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  });
}

// 이전 상탯값을 매개변수로 받는다.
// 이제 상탯값을 의존성 배열에서 제거 할 수 있다.
```

## useReducer 활용하기

여러 상탯값을 참조하면서 값을 변경할 때는 useReducer 훅을 사용하는 게 좋다.

```jsx
function Timer({ initialTotalSeconds }) {
  const [hour, setHour] = useState(Math.floor(initialTotalSeconds / 3600));
  const [minute, setMinute] = uesState(
    Math.floor((initalTotalSeconds % 3600) / 60)
  );
  const [second, setSecond] = useState(initialTotalSeconds % 60);
  useEffect(() => {
    const id = setInterval(() => {
      if (second) {
        setSecond(second - 1);
      } else if (minute) {
        setMinute(minute - 1);
        setSecond(59);
      } else if (hour) {
        setHour(hour - 1);
        setMinute(59);
        setSecond(59);
      }
    }, 1000);
  }, [hour, minute, second]);
  // ...
}
```

세 가지 상탯값을 사용한다.
1초마다 타이머의 시간을 차감한다.
세가지 상탯값을 모두 의존성 배열에 추가한다. setInterval을 사용한 것이 무색하게도 1초마다 clearInterval, setInterval을 반복해서 호출한다.

```jsx
function Timer({ initialTotalSeconds }) {
  const [state, dispatch] = useReducer(reducer, {
    hour: Math.floor(initialTotalSeconds / 3600),
    minute: Math.floor((initialTotalSeconds % 3600) / 60),
    second: initialTotalSeconds % 60,
  });
  const { hour, minute, second } = state;
  useEffect(() => {
    const id = setInterval(dispatch, 1000);
    return () => clearInterval(id);
  });
  // ...
}

function reducer(state) {
  const { hour, minute, second } = state;
  if (second) {
    return { ...state, second: second - 1 };
  } else if (minute) {
    return { ...state, minute: minute - 1, second: 59 };
  } else if (hour) {
    return { hour: hour - 1, minute: 59, second: 59 };
  } else {
    return state;
  }
}
```

## useRef

의존성 배열이 자주 변경되는 문제를 해결하는 방법은 여러 가지 있지만, 상황에 따라 마땅한 방법이 보이지 않을 수 있다.
특히 속성 값으로 전달되는 함수는 자주 변경되는 경우기 많다. 해당 속성값이 렌더링 결과에 영향을 주는 값이 아니라면 useRef 훅을 이용해서 의존성 배열을 제거 할 수 있다.

```jsx
function MyComponent({ onClick }) {
  useEffect(() => {
    window.addEventListener("click", () => {
      onClick();
      // ...
    });
    // 연산량이 많은 코드
  }, [onClick]);
  // ...
}
// 속성값으로 전달된 함수 내용은 그대로인데 렌더링할 때마다 변경되는 경우가 많다. 이로 인해 부수 효과 함수가 불필요하게 자주 호출된다.
// 이를 해결하는 마땅한 방법이 떠오르지 않는다면 useRef 훅이 손쉬운 해결책이 될 수 있다.
```

```jsx
function MyComponent({ onClick }) {
  const onClickRef = useRef();
  useEffect(() => {
    onClickRef.current = onClick;
  });
  useEffect(() => {
    window.addEventListener("click", () => {
      onClickRef.current();
      // ...
    });
    // ...
  });
  // ...
}
// onClick을 useRef에 저장한다. useRef에는 렌더링 결과와 무관한 값만 저장.
// 이는 useRef에 저장된 값이 변경돼도 컴포넌트가 다시 렌더링되지 않기 때문이다.

// 부수 효과 함수에서 사용된 useRef 값은 의존성 배열에 추가할 필요가 없다.
```
