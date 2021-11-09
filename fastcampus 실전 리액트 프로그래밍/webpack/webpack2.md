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

## css 파일 처리하기

이제 css 파일을 처리하는 로더를 알아보자

    npm i css-loader

src 폴더 밑에 App.css 파일을 만들고 다음 내용을 입력한다.

```css
.container {
  border: 1px solid blue;
}

.title {
  color: red;
}
```

index.js 파일에는 App.css 파일을 사용하는 코드를 추가한다.

```js
// ...
import Style from "./App.css"; // 1
console.log({ Style });
// ...
```

1 자바스크립트 모듈에서 css 모듈을 불러온다. 현재는 css 모듈을 처리하는 로더가 없기 때문에 웹팩을 실행하면 에러가 발생한다. webpack.config.js 파일에 다음 코드를 추가해 보자

```js
// ...
module: {
  rules: [
    // ...
    {
      test: /\.css$/, //1
      use: 'css-loader',
    },
    // ...
```

css 확장자를 갖는 모듈은 css-loader가 처리하도록 설정한다.
웹팩 실행후 index.html을 브라우저에서 확인해 보자. 콘솔에 출력된 내용을 확인해 보면 css 모듈의 내용이 보인다. 하지만 화면에 보이는 돔 요소의 스타일은 변경되지 않았다. 스타일을 실제로 적용하기 위해서는 style-loader가 필요하다.

    npm i style-loader

style-loader를 사용하기 위해 webpack.config.js 파일의 내용을 다음과 같이 수정한다.

```js
{
  test: /\.css$/,
  use: ['style-loader', 'css-loader'] // 1
}
```

1 로더를 배열로 입력하면 오른쪽 로더부터 실행된다. style-loader는 css-loader가 생성한 css 데이터를 style 태그로 만들어서 HTML head에 삽입한다. style-loader는 번들 파일이 브라우저에서 실행될 때 style 태그를 삽입한다. 따라서 번들 파일이 실행되다가 에러가 발생하면 style 태그가 삽입되지 않을 수 있다. css-module 기능을 이용하면 스타일 코드를 지역화할 수 있다는 것을 배웠다. 사실 css-module은 css-loader가 제공해 주는 기능이다. css-loader는 이 외에도 css 코드에서 사용된 @import, url() 등의 처리를 도와준다.
이제 웹팩을 실행해서 브라우저로 결과를 확인해보자

## 기타 파일 처리하기

다른 종류의 파일도 처리해 보자, 먼저 임의의 PNG 파일을 src 폴더 밑에 icon.png 파일로 저장한다. src 폴더 밑에 data.txt 파일을 만들고 아무 내용이나 입력 해 보자. 마찬가지로 src 폴더 밑에 data.json 파일을 만든 다음 내용을 입력한다.

```json
// data.json
{
  "name": "mike",
  "age": 23
}
```

index.js 파일에서 지금까지 추가한 파일을 사용하도록 다음과 같이 수정해보자.

```js
// ...
import "./App.css";
import Icon from "./icon.png";
import Json from "./data.json";
import Text from "./data.txt";

const App = () => {
  return (
    <div className="container">
      <h3 className="title">webpack example</h3>
      <div>{`name: ${Json.name}, age: ${Json.age}`}</div>
      <div>{`text: ${Text}`}</div>
      <img src={Icon} />
    </div>
  );
};
// ...
```

JSON, TXT, PNG 모듈을 사용한다.  
json 모듈은 웹팩에서 기본적으로 처리해 주기 때문에 별도의 로더를 설치하지 않아도 된다. TXT 모듈과 PNG 모듈을 처리하기 위해 다음 패키지를 설치한다.

    npm i file-loader raw-loader

file-loader는 모듈의 내용을 그대로 복사해서 dist 폴더 밑에 복사본을 만든다. 그리고 모듈을 사용하는 쪽에는 해당 모듈의 경로를 넘겨준다. raw-loader는 모듈의 내용을 그대로 자바스크립트 코드로 가져온다.

webpack.config.js 파일에 file-loader와 raw-loader를 설정하는 코드를 추가하자

```js
module: {
  rules: [
    // ...
    {
      test: /\.(png|jpg|gif)$/, // 1
      use: "file-loader",
    },
    {
      test: /\.txt$/, // 2
      use: "raw-loader",
    },
  ];
}
```

1 PNG 모듈은 file-loader가 처리하도록 설정한다.  
2 TXT 모듈은 raw-loader가 처리하도록 설정한다.

웹팩 실행 후 dist 폴더에 생성된 이미지 파일의 이름에는 해시값이 포함되어 있다. 이 해시값은 이미지 파일을 수정하는 경우에만 변경되기 때문에 사용자에게 전달된 이미지 파일은 브라우저의 캐싱 효과를 최대한 활용할 수 있다. 브라우저에서 결과를 보면 의도한 대로 잘 나오는 것을 확인할 수 있다.

## 이미지 파일의 요청 횟수 줄이기

이미지 파일을 번들 파일에 포함시키면 브라우저의 파일 요청 횟수를 줄일 수 있다. 이때 번들 파일 크기가 너무 커지면 자바스크립트가 늦게 실행되므로 작은 이미지 파일만 포함시키는 게 좋다. url-loader를 사용해서 크기가 작은 이미지 파일만 번들 파일에 포함시켜 보자.

    npm i url-loader

webpack.config.js 파일에서 이전에 작성했던 file-loader 설정을 지우고 다음과 같이 url-loader 설정으로 변경하자

```js
// ...
module: {
  rules: [
    // ...
    {
      test: /\.(png|jpg|gif)$/,
      use: [
        {
          loader: "url-loader",
          options: {
            limit: 8192, // 1
            fallback: {
              loader: "file-loader",
            },
          },
        },
      ],
    },
  ];
}
```

1 url-loadersms 파일 크기가 이 값보다 작은 경우에는 번들 파일에 파일의 내용을 포함시킨다. 만약 파일 크기가 이 값보다 큰 경우에는 다른 로더가 처리할 수 있도록 fallback 옵션을 제공한다. fallback 옵션을 입력하지 않으면 기본적으로 file-loader가 처리하게 되어있다.

limit 옵션에 icon.png 파일보다 큰 값을 입력하고 웹팩을 실행해 보자.
브라우저에서 img 태그의 src 속성값을 확인해 보면 파일의 경로가 아니라 데이터가 입력된 것을 확인할 수 있다.

## 플러그인 사용하기

플러그인은 로더보다 강력한 기능을 갖는다. 로더는 특정 모듈에 대한 처리만 담당하지만 플러그인은 웹팩이 실행되는 전체 과정에 개입할 수 있다. 몇 가지 유용한 플러그인을 살펴보자.

먼저 실습을 하기위한 새로운 프로젝트를 생성한다.

    mkdir webpack-plugin
    cd webpack-plugin
    npm init -y
    npm i webpack webpack-cli

똑같이 루트에 src 폴더를 만들고 그 밑에 index.js 파일을 만든다. index.js 파일에 간단한 리액트 프로그램의 코드를 작성해 보자.

```js
import React from "react";
import ReactDOM from "react-dom";

const App = () => {
  return (
    <div>
      <h3>안녕하세요, 웹팩 플러그인 예제입니다.</h3>
      <p>html-webpack-plugin 플러그인을 사용합니다.</p>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
```

이 코드를 실행하기 위해서 필요한 패키지를 설치해보자

    npm i @babel/core @babel/preset-react babel-loader react react-dom

프로젝트 루트에 webpack.config.js 파일을 만들고 다음과 같이 babel-loader를 사용하도록 설정한다.

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "[name].[chunkhash].js", // 1
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      // 2
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
          },
        },
      },
    ],
  },
  mode: "production",
};
```

1 chunkhash를 사용하면 파일의 내용이 수정될 때마다 파일 이름이 변경되도록 할 수 있다.  
2 자바스크립트 모듈을 처리하도록 babel-loader를 설정한다. babel-loader에서 직접 바벨 설정을 할 수도 있다.

## html-webpack-plugin

웹팩을 실행해서 나오는 결과물을 확인하기 위해서는 이전처럼 HTML 파일을 수동으로 작성해야한다. 여기서는 번들 파일 이름에 chunckhash옵션을 설정했기 때문에 내용이 변경될 때마다 HTML 파일의 내용도 수정해야 한다. 이 작업을 자동으로 하는 플러그인이 html-webpack-plugin이다. 다음과 같이 필요한 플러그인을 설치하자.

웹팩을 실해해서 나오는 결과물을 확인하기 위해서는 이전처럼 HTML 파일을 수동으로 작성해야 한다. 여기서는 번들 파일 이름에 chunkhash 옵션을 설정했기 때문에 파일의 내용이 변경될 때마다 HTML 파일의 내용도 수정해야 한다. 이 작업을 자동으로 하는 플러그인이 html-webpack-plugin이다. 다음과 같이 필요한 플러그인을 설치하자.

    npm i clean-webpack-plugin html-webpack-plugin

clean-webpack-plugin은 웹팩을 실행할 때마다 dist 폴더를 정리한다. 여기서는 번들 파일의 내용이 변경될 때마다 파일 이름도 변경되기 때문에 이전에 생성된 번들 파일을 정리하는 용도로 사용한다.

설치함 플러그인을 사용하기 위해 webpack.config.js 파일에 다음 설정을 추가해 보자.

```js
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // ...
  plugins: [
    new CleanWebpackPlugin(), // 1
    new HtmlWebpackPlugin({
      // 2
      template: "./template/index.html",
    }),
  ],
  // ...
};
```

1 웹팩이 실행될 때마다 dist 폴더를 정리하도록 clean-webpack-plugin을 설정한다.
2 index.html 파일이 자동으로 생성되도록 html-webpack-plugin을 설장한다. 이때 우리가 원하는 형태를 기반으로 index.html 파일이 생성되도록 template 옵션을 설정한다.

프로젝트 루트에 template 폴더를 만들고 그 밑에 index.html 파일을 만들어 보자. html-webpack-plugin이 생성하는 html에 포함시킬 내용을 index.html 파일에 추가한다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>웹팩 플러그인 예제</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

head 태그 안에 제목을 입력한다. 리액트에서 사용될 div 요소를 정의한다. 기타 필요한 태그를 이 파일에 추가하면 html-webpack-plugin이 생성하는 새로운 html 파일에 같이 포함한다.

웹팩을 실행하면 dist 폴더 밑에 index.html 파일이 생성된다. dist/index.html 파일의 내용은 다음과 같다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>웹팩 플러그인 예제</title>
    <script defer="defer" src="main.707a25d56767558519d9.js"></script>
    <!-- 1 -->
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

1 번들 파일이 script 태그로 등록된다. 이 파일을 브라우저에서 실행하면 제대로 동작하는 것을 확인할 수 있다.

## DefinePlugin

이번에는 모듈 내부에 있는 문자열을 대체해 주는 DefinePlugin을 사용해 보자. 이 플러그인은 웹팩에 내장된 플러그인이기 때문에 별도로 설치할 필요는 없다. 먼저 다음과 같이 DefinePlugin으로 대체할 문자열을 index.js 파일에 추가 한다.

```js
// ...
<div>
  {/*...*/}
  <p>{`웹 버전은 ${APP_VERSION}입니다.`}</p>
  <p>{`10 * 10 = ${TEN * TEN}입니다.`}</p>
</div>
```

APP_VERSION, TEN 문자열을 우리가 원하는 문자열로 대체한다. webpack.config.js 파일에 다음 코드를 추가해 보자

```js
module.exports = {
  // ...
  plugins: [
    // ...
    new webpack.DefinePlugin({
      APP_VERSION: "1.2.3",
      TEN: 10,
    }),
  ],
  // ...
};
```

DefinePlugin은 웹팩 모듈에 포함되어 있다. APP_VERSION 문자열을 '1.2.3'으로 대체한다. TEN 문자열을 10으로 대체한다.

웹팩 실행 후 번들 파일의 내용을 확인해 보자. 코드가 압축된 상태라서 확인이 쉽지는 않지만 대략 다음과 같은 코드를 확인할 수 있다.

```js
e.createElement(
  "div",
  null,
  e.createElement("h3", null, "안녕하세요, 웹팩 플러그인 예제입니다."),
  e.createElement("p", null, "html-webpack-plugin 플러그인을 사용합니다."),
  e.createElement("p", null, "웹 버전은 1.2.3입니다."),
  e.createElement("p", null, "10 * 10 = 100입니다.")
);
```

1 APP_VERSION 문자열이 의도대로 대체된 것을 확인할 수 있다.
2 TEN 문자열은 10으로 대체된 후 곱하기 연산의 결과인 100이 번들 파일에 들어간다. 두 경우 모두 프로덕션 모드로 웹팩을 실행했기 때문에 미리 계산된 결과가 번들 파일에 포함됐다.
