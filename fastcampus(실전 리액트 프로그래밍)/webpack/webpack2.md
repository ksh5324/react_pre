# webpack (출처: 실전 리액트 프로그래밍 개정판)

## 웹팩 초급편

웹팩은 모듈(module) 번들러(bundler)다. 여기서 모듈은 각 리소스 파일을 말하고, 번들은 웹팩 실행 후에 나오는 결과 파일이다. 하나의 번들 파일은 여러 모듈로 만들어진다. 웹팩을 이용하면 우리가 제작한 여러 가지 리소스를 사용자에게 전달하기 좋은 형태로 만들 수 있다.

### 웹팩이 필요한 이유

2000년대 초반의 웹 페이지는 페이지가 바뀔 때마다 새로운 HTML을 요청해서 화면을 매번 그리는 방식이었다. 자바스크립트는 돔을 조작하는 간단한 역할만 했기 때문에 HTML의 script 태그에 넣는 것으로도 충분했다. Ajax가 유행했을때는 자바스크립트의 비중이 조금 더 커졌지만 그래 봐야 페이지당 자바스크립트 파일 몇 개면 충분했다. 그러나 단일 페이지 애플리케이션은 하나의 HTML에 수십, 수백 개의 자바스크립트 파일을 포함하기 때문에 더는 기존 방식이 통할 리 없었다.

다음은 모든 자바스크립트 파일을 script 태그로 가져오는 코드다.

```html
<html>
  <head>
    <script src="javascript_file_1.js" />
    <script src="javascript_file_2.js" />
    // ...
    <script src="javascript_file_999.js" />
  </head>
  // ...
</html>
```

다음 방식으로는 계속 늘어나는 자바스크립트 파일을 관리하기 힘들다. 또한 실행되는 순서도 신경 써야 하고, 기존에 생성된 전역 변수를 덮어쓰는 위험도 존재한다.

다음은 웹팩을 사용하지 않고 script 태그를 이용해서 외부 모듈을 가져오는 코드다.

```jsx
// index.html
<html>
  <head>
    <script src="https://unpkg.com.lodash@4.17.11"></script> {/* 2 */}
  </head>
  <body>
    <script src="./index.js"></script>
  </body>
</html>;

// index.js
const element = document.createElement("div");
element.innerHTML = _.join(["hello", "world"], " ");
{
  /* 1 */
}
document.body.appendChild(element);
```

1 index.js 파일에서는 로다시를 사용하는데, 로다시가 전역 변수로 등록되어 있다고 가정하고 코드를 작서한다.  
2 index.html 파일에서 script 태그를 이용해서 로다시를 가져온다. 사실 이방식은 여러가지 문제를 안고 있다. 2의 주솟값에 오타가 있다면 로다시를 가져오는 데 실패한다. 주솟값을 제대로 입력했더라도 unpkg 사이트에 장애가 있는 경우에는 마찬가지로 로다시를 가져오는 데 실패한다. 로다시가 필요 없어져 모든 자바스크르립트 코드에서 로다시를 제거할 때도 문제가 생길 수 있다. script 태그를 지우는 것을 깜빡하면 불필요한 리소스의 다운로드가 발생하고 초기 렌더링 속도를 느리게 하는 원인이 된다. 그러나 웹팩을 이용하면 앞에서 나열한 문제들을 해결할 수 있다.

## 웹팩 실행하기

먼저 실습을 위한 프로젝트를 만든다.

    mkdir webpack-init -> webpack-init이라는 폴더 생성
    cd webpack-init -> 폴더 이동
    npm init -y -> package.json 만들기
    npm i webpack webpack-cli -> webpack, webpack-cli 설치

webpack-cli를 이용하면 CLI에서 웹팩을 실행할 수 있다.
프로젝트 루트에 src폴더를 만들고 그 및에 util.js 파일을 만들자

```js
// util.js
export function sayHello(name) {
  console.log("hello", name);
}
```

그 다음 src 폴더 및에 index.js 파일을 만들고 util.js 모듈의 sayHello 함수를 사용하는 코드를 작성한다.

```js
// index.js
import { sayHello } from "./util";

function myFunc() {
  sayHello("mike");
  console.log("myFunc");
}
myFunc();
```

    npx webpack

웹팩을 실행하면 dist 폴더가 만들어지고 그 밑에 main.js 번들 파일이 생성된다. index.js 모듈과 main.js 번들 파일로 합쳐졌다. 별다른 설정 없이 웹팩을 실행하면 ./src/index.js 모듈을 입력으로 받아서 ./dist/main.js 번들 파일을 만든다.

### 설정 파일 이용하기

webpack.config.js 파일을 만들고 입력한다.

```js
// webpack.config.js
const path = require("path");

module.exports = {
  entry: "./src/index.js", // 1
  output: {
    // 2
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "production", // 3
  optimization: { minimizer: [] }, // 4
};
```

1 index.js 모듈을 입력 파일로 사용한다.  
2 dist 폴더 밑에 main.js 번들 파일을 생성한다.  
3 프로덕션 모드로 설정하면 자바스크립트 코드 압축을 포함한 여러 가지 최적화 기능이 기본으로 들어간다.  
4 번들 파일의 내용을 쉽게 확인하기 위해 압푹하지 않도록 설정한다.

    npx webpack

```js
/******/ (() => {
  // webpackBootstrap
  /******/ var __webpack_modules__ = {
    /***/ 891: /***/ (module) => {
      // export function sayHello(name) {
      //   console.log("hello", name);
      // }

      module.exports = function sayHello(name) {
        console.log("hello", name);
      };

      /***/
    },

    /******/
  };
  /************************************************************************/
  /******/ // The module cache
  /******/ var __webpack_module_cache__ = {};
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ var cachedModule = __webpack_module_cache__[moduleId];
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ var module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {},
      /******/
    });
    /******/
    /******/ // Execute the module function
    /******/ __webpack_modules__[moduleId](
      module,
      module.exports,
      __webpack_require__
    );
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports;
    /******/
  }
  /******/
  /************************************************************************/
  var __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
  (() => {
    const sayHello = __webpack_require__(891);

    function myFunc() {
      sayHello("mike");
      console.log("myFunc");
    }
    myFunc();
  })();

  /******/
})();
```

## 로더 사용하기

로더는 모듈을 입력으로 받아서 원하는 형태로 변환한 후 새로운 모듈을 출력해 주는 함수다. 자바스크립트 파일뿐만 아니라 이미지 파일, css 파일, csv 파일 등 모든 파일은 모듈이 될 수 있다.

### 자바스크립트 파일 처리하기

가장 먼저 자바스크립트 파일을 처리하는 babel-loader를 알아보자. babel-loader를 사용하기 위해 다음과 같이 필요한 패키지를 설치한다.

    npm i babel-loader @babel/core @babel/preset-react react react-dom

이는 자바스크립트 코드에서 jsx 문법으로 작성된 리액트 코드를 처리히기 위해 필요한 패키지들이다.
src폴더에 index.js에다가 다음과 같이 코드를 입력한다.

```js
import React from "react";
import ReactDOM from "react-dom";

const App = () => {
  return (
    <div className="container">
      <h3 className="title">webpack example</h3>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
```

그 후 프로젝트 루트에 babel.config.js 파일을 만들고 @babel/preset-react 프리셋을 사용하도록 설정한다.

```js
const presets = ["@babel/preset-react"];
module.exports = { presets };
```

webpack.config.js에 다음과 같이 작성한다.

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    // 1
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/, // 조건과 일치하는 모든 모듈을 제외합니다.
        use: "babel-loader",
      },
    ],
  },
  mode: "production",
};
```

1 js 확장자를 갖는 모듈은 babel-loader가 처리하도록 설정한다. 웹팩을 실행해 보면 dist 폴더 밑에 main.js 파일이 생성된다. 잘 동작하는지 확인하기 위해 dist 폴더 밑에 index.html 파일을 만들고 다음 코드를 입력한다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
  </head>
  <body>
    <id id="root" />
    <script src="./main.js"></script>
  </body>
</html>
```

index.html 파일을 브라우저에서 실행해 보면 의도한 대로 잘 동작하는 것을 확인할 수 있다. 만약 babel-loader를 설정하지 않고 웹팩을 실행하면 웹팩이 jsx 문법을 이해하지 못하기 때문에 에러가 발생한다.
