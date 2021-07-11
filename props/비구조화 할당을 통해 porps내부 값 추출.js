import React from "react";

const Mycomponent = (props) => {
  const { name, children } = props;
  return (
    <div>
      안녕하세요, 제 이름은 {name}입니다. children 값은 {children}
      입니다.
    </div>
  );
};

Mycomponent.defaultProps = {
  name: "기본 이름",
};

export default Mycomponent;
