# 웹팩 고급편 (tree shaking, 코드 분할)

지금까지 웹팩의 기본적인 사용법을 알아봤다. 이제 웹팩을 이용해서 애플리케이션의 번들 파일을 최적화하는 몇 가지 방법을 살펴보자. 그리고 로더와 플러그인을 직접 제작해 보면서 웹팩이 내부적으로 어떻게 동작하는지 이해해 보자.

## 나무 흔들기

나무 흔들기(tree shaking)는 불필요한 코드를 제러해 주는 기능이다. 나무를 흔들어서 말라 죽은 잎을 떨어뜨리는 것을 비유해서 지은 이름이다. 웹팩은 기본 적으로 나무 흔들기 기능을 제공한다. 단, 웹팩이 알아서 모든 경우를 잘 처리해주면 좋겠지만 제대로 동작하지 않는 경우가 있다. 따라서 나무 흔들기를 잘 이해하고 있어야 번들 파일 크기를 최소로 유지할 수 있다.

먼저 나무 흔들기를 실습할 프로젝트를 생성해 보자.

    mkdir webpack-tree-shaking
    cd webpack-tree-shaking
    npm init -y
    npm i webpack webpack-cli

프로젝트 루트에 src 폴더를 만들고 그 밑에 util_esm.js 파일을 만든다. util_esm.js 파일에는 다음과 같이 두 개의 함수를 내보내는 코드를 입력한다.

```js
export function func1() {
  console.log("func1");
}
export function func2() {
  console.log("func2");
}
```

ESM 문법을 사용하는 코드다. ESM은 자바스크립트 표준 모듈 시스템이다. ESM에서는 import, export 등의 키워드를 사용한다. 이번에는 코드를 commonJS 문법으로 작성해 보자. src 폴더 밑에 util_commonjs.js 파일을 만들고 다음 코드를 입력한다.

```js
function func1() {
  console.log("func1");
}
function func2() {
  console.log("func2");
}
module.exports = { func1, func2 };
```

commonJS에서는 module.exports, require 등의 키워드를 사용한다. commonJS 문법은 노드에서 많이 사용된다. src 폴더 밑에 index.js 파일을 만들고 util_esm.js 모듈로부터 함수를 가져오는 코드를 입력해 보자.

```js
import { func1 } from "./util_esm";
func1();
```

ESM 문법으로 작성된 모듈을 ESM 문법으로 가져오고 있다. func1 함수만 사용하고 func2 함수가 제거된 것을 확인할 수 있다.
웹팩 실행 후 번들 파일을 열어 보면 func2 함수가 보이지 않는다. 나무 흔들기 덕분에 func2 함수가 제거된 것을 확인할 수 있다.

### 나무 흔들기가 실패하는 경우

이번에는 index.js 파일에서 util_commonjs 모듈을 사용하도록 수정해 보자.

```js

```

commonJS 문법으로 작성된 모듈을 ESM 문법으로 가져오고 있다. 웹팩 실행 후 번들 파일을 열어 보면 func2 함수가 보인다. 무엇이 문제일까? 나무 흔들기는 다음과 같은 경우에 동작하지 않는다.

- 사용되는 모듈이 ESM이 아닌 경우
- 사용하는 쪽에서 ESM이 아닌 다른 모듈 시스템을 사용하는 경우
- 동적 임포트를 사용하는 경우

코드에서는 사용되는 util_commonjs.js 모듈이 ESM이 아니기 때문에 나무 흔들기가 동작하지 않았다. ESM 문법을 사용하면 나무 흔들기가 제대로 동작한다. 이번에는 동적 임포트를 사용하도록 index.js 파일을 수정해 보자.

동적 임포트를 사용하는 코드

```js
import("./util_esm").then((util) => util.func1());
```

동적 임포트를 사용하면 동적으로 모듈을 가져올 수 있다. 하지만 동적 임포트를 사용하면 나무 흔들기가 동작하지 않는다. 동적 임포트에 대해서는 뒤에서 자세히 설명한다.

util_esm.js 모듈의 func2 함수를 사용하지 않는다고 무조건 코드를 제거하면 문제가 될 수 있다. 예를 들어, 다음과 같이 모듈 내부에서 자신의 함수를 호출하는 경우에는 웹팩이 해당 함수를 제거하지 않는다.

```js
const arr = [];
export function func1() {
  console.log("func1", arr.length);
}
export function func2() {
  arr.push(10); // 1
  console.log("func2");
}
func2(); // 2
```

1 func2 함수는 전역 변수를 변경한다.  
2 모듈이 평가 될 때 func2 함수가 실행된다. 모듈은 최초 한번 평가되는데, 이때 전역 변수 arr이 변경된다. 만약 나무 흔들기 단계에서 func2 함수가 제거되면 func1 함수는 의도한 대로 동작하지 않는다. 다행히 웹팩은 2와 같이 모듈이 평가되는 시점에 호출되는 함수를 제거하지 않는다.

## 외부 패키지의 나무 흔들기

외부 패키지에 대해서도 나무 흔들기가 적용된다. 하지만 외부 패키지는 저마다 다양한 바아식의 모듈 시스템을 사용하기 때문에 나무 흔들기가 제대로 동작하지 않을 수 있다. 예들 들어, 로다시 패키지는 ESM으로 되어 있지 않기 때문에 나무 흔들기로 코드가 제거되지 않는다. 다음은 로다시 모률을 사용하는 코드다.

```js
import { fill } from "lodash";
const arr = [1, 2, 3];
fill(arr, "a");
```

여기서는 로다시의 fill 함수만 사용하지만 웹팩으로 만들어진 번들 파일에는 로다시의 모든 코드가 포함되어 있다.
로다시는 각 함수를 별도의 파일로 만들어서 제공해 준다. 따라서 다음과 같이 특정 함수의 모듈을 가져올 수 있다.

```js
import fill from "lodash/fill";
// ...
```

이와 같이 웹팩을 실행하면 파일에는 fill 함수의 코드만 포함된다. 로다시에는 ESM 모듈 시스템을 사용하는 lodash-es 패키지를 별도로 제공한다.

```js
import { fill } from "lodash-es";
// ...
```

lodash-es 모듈을 가져오는 경우에는 나무 흔들기가 제대로 적용된다.

이처럼 본인이 사용하는 패키지에 적용된 모듈 시스템이 무엇인지, ESM이 아니라면 각 기능을 별도의 파일로 제공하는지 여부를 파악해야 번들 크기를 줄일 수 있다.

## 바벨 사용시 주의할 점

또 하나 주의할 점은 우리가 작성한 코드를 바벨로 컴파일한 이후에도 ESM 문법으로 남아 있어야 한다는 것이다. 만약 @babel/preset-env 플러그인을 사용한다면 babel.config.js 파일에서 다음과 같이 설정해야한다.

```js
// ESM 모듈을 유지하도록 설정하기
const presets = [
  [
    "@babel/preset-env",
    {
      // ...
      modules: false, // 1
    },
  ],
  // ...
];
// ...
```

1 모듈 시스템을 변경하지 않도록 설정한다. ESM 문법으로 컴파일된 코드는 웹팩에서 자체적으로 사용후 제거되기 때문에 오래된 브라우저에 대한 걱정은 하지 않아도 된다.

## 코드 분할

애플리케이션의 전체 코드를 하나의 번들 파일로 만드는 것은 좋은 생각이 아닐 수 있다. 불필요한 코드까지 전송되어 사용자의 요청으로부터 페이지가 렌더링 되기까지 오랜 시간이 걸릴 수 있기 때문이다.(번들 파일을 하나만 만들면 관리 부담이 적어지므로 회사 내부 직원용 애플리케이션을 만들 때는 좋은 선택이 될 수 있다.) 많은 수의 사용자를 대상으로 하는 서비스라면 응답 시간을 최소화하기 위해 코드를 분할하는 게 좋다.

먼저 코드 분할을 실습하기위한 프로젝트 만들자

    mkdir webpack-split
    cd webpack-split
    npm init -y
    npm i webpack webpack-cli react lodash

코드를 분할하는 가장 직관적인 방법은 웹팩의 entry 설정값에 페이지별로 파일을 입력하는 것이다. 두 개의 페이지를 가진 간단한 프로그램을 만들어보자 먼저 src 폴더를 만들고 index1.js, index2.js 파일을 만든다. 다음 두 파일의 코드를 살펴보자

```js
// index1.js
import { Component } from "react";
import { fill } from "lodash";
import { add } from "./util";
const result = fill([1, 2, 3], add(10, 20));
console.log("this is index1", { result, Component });

// index2.js
import { Component } from "react";
import { fill } from "lodash";
import { add } from "./util";
const result = fill([1, 2, 3], add(10, 20));
console.log("this is index2", { result, Component });
```

두 파일 모두 같은 종류의 모듈을 사용하고 있다. src 폴더 밑에 util.js 파일을 만들고 add 함수를 정의해보자

```js
export function add(a, b) {
  console.log("this is add function");
  return a + b;
}
```

프로젝트 루트에 webpack.config.js 파일을 만들고 페이지별로 entry를 설정해보자

```js
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    // 1
    page1: "./src/index1.js",
    page2: "./src/index2.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "production",
  plugins: [new CleanWebpackPlugin()], // 2
  module: {
    rules: [],
  },
};
```

1 각 페이지의 자바스크립트 파일을 entry로 입력한다.  
2 dist 폴더를 정리하기 위해 clean-webpack-plugin을 사용한다.

    npm i clean-webpack-plugin

웹팩을 실행해 보면 page1.js, page2.js 두 파일이 생성된다. 하지만 두 파일 모두 같은 모듈의 내용을 포함하고 있기 때문에 비효율 적이다.

### SplitChunkPlugin

웹팩에서는 코드 분할을 위해 기본적으로 SplitChunkPlugin을 내장하고 있다. 별도의 패키지를 설치하지 않고 설정 파일을 조금 수정하는 것만으로 코드 분할을 할 수 있다.

SplitChunkPlugin을 사용하도록 webpack.config.js 파일을 다음과 같이 수정해 보자

```js
// ...
module.exports = {
  entry: {
    page1: "./src/index1.js", // 1
  },
  // ...
  optimization: {
    splitChunks: {
      // 2
      chunks: "all", // 3
      name: "vendor",
    },
  },
  // ...
};
```

1 이해를 돕기 위해 하나의 페이지만 생성한다.  
2 optimization splitChunks 속성을 이용하면 코드를 분할할 수 있다.  
3 chunks 속성의 기본값은 동적 임포트만 분할하는 async다. 우리는 동적 임포트가 아니더라도 코드가 분할되도록 all로 설정한다.

이 상태로 웹팩을 빌드하면 로다시와 리액트 모듈은 vendor.js 파일로 만들어진다. util.js 모듈은 파일의 크기가 작기 때문에 page1.js 파일에 포함된다.

splitChunks 속성을 제대로 이해하기 위해서는 먼저 기본값의 형태를 이해해야한다.

```js
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      chunks: "async", // 1
      minSize: 30000, // 2
      minChunks: 1, // 3
      // ...
      cacheGroups: {
        // 4
        default: {
          minChunks: 2, // 5
          priority: 2,
          reuseExistingChunk: true,
        },
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: 2,
        },
      },
    },
  },
};
```

1 동적 임포트만 코드를 분할하도록 설정되어 있다.  
2 파일 크기가 30kb 이상인 모듈만 분할 대상으로 한다.  
3 한 개 이상의 청크(chunk)에 포함되어 있어야 한다. 청크는 웹팩에서 내부적으로 사용되는 용어인데 대개 번들 파일이라고 이해해도 괜찮다.  
4 파일 분할은 그룹별로 이뤄진다. 기본적으로 외부 모듈(vendors)과 내부 모듈(default) 두 그룹으로 이뤄진다. 외부모듈은 내부 모듈보다 비교적 낮은 비율로 코드가 변경되기 때문에 브라우저에 오래 캐싱될 수 있다는 장점이 있다.  
5 내부 모듈은 두 개 이상의 번들 파일에 포함되어야 분할된다.

util.js 모듈을 내부 모듈 그룹으로 분할하기 위해서 다음과 같이 설정한다.

```js
// ...
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 10,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: 2,
          name: "venders",
        },
        defaultVendors: {
          minChunks: 1,
          priority: 1,
          name: "default",
        },
      },
    },
  },
};
```

1 파일 크기 제한에 걸리지 않도록 낮은 값을 설정한다.  
2 청크 개수 제한을 최소 한 개로 설정한다.

이 상태로 웹팩을 실행하면 page1.js vendors.js, default.js 세 개의 번들 파일이 생성된다. util.js 모듈은 default.js 번들 파일에 포함한다.

새로운 그룹을 추가해서 리액트 패키지만 별도의 버들 파일로 분할해 보자. 다음과 같이 설정하면 리액트 패키지는 react.bundle.js 파일로 분할된다.

```js
// ...
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 10,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: 1,
          name: "venders",
        },
        reactBundle: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          minChunks: 1,
          priority: 2, // 1
          name: "react.bundle",
          minSize: 100,
        },
      },
    },
  },
};
```

1 우선순위가 높아야 리액트 모듈이 vendors 그룹에 들어가지 않는다.

### 동적 임포트

동적 임포트(dynamic import)는 동적으로 모듈을 가져올 수 있는 기능이다. 웹팩에서 동적 임포트를 사용하면 해당 모듈의 코드는 자동으로 분할되며, 오래된 브라우저에서도 잘 동작한다. 참고로 동적 임포트는 자바스크립트 표준이 될 것이 거의 확실한 상황이다.

src 폴더 밑에 index3.js 파일을 만들고, 동적 임포트를 사용하는 코드를 입력해 보자.

동적 임포트를 사용하는 코드

```js
function myFunc() {
  import("./util").then(({ add }) =>
    import("lodash").then(({ default: _ }) =>
      console.log("value", _.fill([1, 2, 3], add(10, 20)))
    )
  );
}
myFunc();
```

import 함수를 사용하면 동적으로 모듈을 가져올 수 있다. import 함수는 프로미스 객체를 반환하기 때문에 then 메서드로 연결할 수 있다.
