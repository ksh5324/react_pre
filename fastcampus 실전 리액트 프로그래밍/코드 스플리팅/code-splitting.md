```js
import React, { Component } from "react";

class App extends Component {
  state = {
    SplitMe: null,
  };
  handleClick = async () => {
    const loadedModule = await import("./SplitMe"); // 동적 임포트 -> webapck 기본값으로 코드 분할
    this.setState({
      SplitMe: loadedModule.default,
    });
  };
  render() {
    const { SplitMe } = this.state;
    return (
      <div>
        <p onClick={this.handleClick}>Hello React!</p>
        {SplitMe && <SplitMe />}
      </div>
    );
  }
}

export default App;
```

lazy

```js
import React, { lazy, Suspense } from "react";

const App = () => {
  const SplitMe = lazy(() => import("./SplitMe"));

  return (
    <Suspense fallback={<div>loading...</div>}>
      <SplitMe />
    </Suspense>
  );
};

export default App;

// fallback: 로딩시에 보여줌
```

```js
import React, { lazy, Suspense, useState } from "react";

const SplitMe = lazy(() => import("./SplitMe"));

const App = () => {
  const [visible, setVisible] = useState(false);
  const onClick = () => {
    setVisible(true);
  };
  return (
    <>
      <p onClick={onClick}>Hello React!</p>
      <Suspense fallback={<div>loading...</div>}>
        {visible && <SplitMe />}
      </Suspense>
    </>
  );
};

export default App;
```

```js
import React, { lazy, Suspense, useState } from "react";
import loadable from "@loadable/component";

// const SplitMe = lazy(() => import("./SplitMe"));
const SplitMe = loadable(() => import("./SplitMe"));

const App = () => {
  const [visible, setVisible] = useState(false);
  const onClick = () => {
    setVisible(true);
  };
  return (
    <>
      <p onClick={onClick}>Hello React!</p>
      {visible && <SplitMe />}
    </>
  );
};

export default App;
```

```js
import React, { lazy, Suspense, useState } from "react";
import loadable from "@loadable/component";

// const SplitMe = lazy(() => import("./SplitMe"));
const SplitMe = loadable(() => import("./SplitMe"), {
  fallback: <div>loading...</div>,
});

const App = () => {
  const [visible, setVisible] = useState(false);
  const onClick = () => {
    setVisible(true);
  };
  return (
    <>
      <p onClick={onClick}>Hello React!</p>
      {visible && <SplitMe />}
    </>
  );
};

export default App;
```

```js
import React, { lazy, Suspense, useState } from "react";
import loadable from "@loadable/component";

// const SplitMe = lazy(() => import("./SplitMe"));
const SplitMe = loadable(() => import("./SplitMe"), {
  fallback: <div>loading...</div>,
});

const App = () => {
  const [visible, setVisible] = useState(false);
  const onClick = () => {
    setVisible(true);
  };
  const onMouseOver = () => {
    SplitMe.preload();
  }; // 마우스만 올려도 로딩 시작
  return (
    <>
      <p onClick={onClick} onMouseOver={onMouseOver}>
        Hello React!
      </p>
      {visible && <SplitMe />}
    </>
  );
};

export default App;
```
