# prop-types

prop-types는 속성값의 타입 정보를 정의할 때 사용하는 리액트 공식 패키지다. 속성값의 타입 정보는 컴포넌트 코드의 가독성을 위해서 필수로 작성하는 게 좋다.

속성값에 타입 정보가 없는 경우

```jsx
function User({ type, age, male, onChangeName, onChangeTitle }) {
  function onClick1() {
    const msg = `type: ${type}, age: ${age ? age : "알 수 없음"}`;
    log(msg, { color: type === "gold" ? "red" : "black" });
  }
}

function onClick2(name, title) {
  if (onChangeName) {
    onChange(name);
  }
  onChangeTitle(title);
  male ? goMalePage() : goFemalePage();
}
```

prop-types를 이용한 속성값의 타입 정보 입력

```jsx
User.propTypes = {
  male: PropTypes.bool.isRequired,
  age: PropTypes.number,
  type: PropTypes.oneOf(["gold", "silver", "bronze"]),
  onChangeName: PropTypes.func,
  onChangeTitle: PropTypes.func.isRequired,
};
```

함수를 이용한 커스텀 속성값 타입 정의

```jsx
MyComponent.propTypes = {
    age: function(props, propName, componentName){
        const = props[propName];
        if(value < 10 || value > 20){
            return new Error(
                `Invalid prop ${propName} supplied to ${componentName},
                It must be 10 <= value <= 20.`
            );
        }
    }
};
```
