# 부모 컴포넌트에서 접근 가능한 함수 구현하기: useImperativeHandle

부모 컴포넌트는 ref 객체를 통해 클래스형 컴포넌트인 자식 컴포넌트의 메서드를 호출할 수 있다. 이 방식은 자식 컴포넌트의 내부 구현에 대한 의존성이 생기므로 지양해야 하지만 꼭 필요한 경우가 종종 생긴다. useImperativeHandle 훅을 이용하면 마치 함수형 컴포넌트에도 메서도가 있는 것처럼 만들 수 있다.

부모 컴포넌트에서 접근 가능한 함수를 구현하기

```jsx
import React, { forwardRef, useState, useImperativeHandle } from "react";

function Profile(props, ref) {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);

  useImperativeHandle(ref, () => ({
    addAge: (value) => setAge(age + value),
    getNameLength: () => name.length,
  }));

  return (
    <div>
      <p>{`name is ${name}`}</p>
      <p>{`age is ${age}`}</p>
    </div>
  );
}

export default forwardRef(Profile);
```

부모 컴포넌트에서 자식 컴포넌트 함수 호출하기

```jsx
function Parent() {
    const ProfileRef = useRef();
    const onClick = () => {
        if(profileRef.current){
            console.log('current name length:',profileRef.current.getNameLength());
            profileRef.current.addAge(5);
        }
    };
    return (
        <div>
            <Profile ref={profileRef}>
            <button onClick={onClick}>add age 5</button>
        </div>
    );
}
```
