# webpack (출처: 조현영님 블로그 http://zerocho.com)

webpack을 사용하기위해선 webpack을 설치해야한다.

    npm i webpack webpack-cli

webpack은 webpack을 사용하기위해서 설치한 것이고, webpack-cli는 webpack이란 명령어를 사용하기위해서 설치한것이다.

먼저 webpack.config.js 파일을 생성 후 코드를 작성한다.

```js
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: {
    app: "",
  },
  output: {
    path: "",
    filename: "",
    publicPath: "",
  },
  module: {},
  plugins: [],
  optimization: {},
  resolve: {
    modules: ["node_modules"],
    extensions: [".js", ".jsx", ".json", ".css"],
  },
};
```

참고로 파일이름이 webpack.config.js여야지 webpack이 바로 인식합니다.
만약 타입스크립트라면

    npm i @types/webpack

현재 위 코드를 보면 핵심적인 부분은 entry, output, module, plugins 이렇게 네 개입니다

마지막 resolve만 먼저 설명드리자면 웹팩이 알아서 경로나 확장자를 처리할 수 있게 도와주는 옵션입니다. modules에 node_modules를 넣으셔야 디렉토리의 node_modules를 인식할 수 있습니다. 그리고 extensions에 넣은 확장자들은 웹팩에서 알아서 처리해주기 때문에 파일에 저 확장자들을 입력할 필요가 없어집니다.

## mode

웹팩4에서 추가된 것입니다. mode가 development면 개발용, production이면 배포용입니다. 배포용일 경우에는 알아서 최적화가 적용됩니다. 따라서 기존 최적화플러그인들이 대량으로 호환되지 않습니다.

## entry

entry 부분이 웹팩이 파일을 읽어들이기 시작하는 부분입니다. app이 객체의 키로 설정되어 있는데 이 부분 이름은 자유롭게 바꾸시면 됩니다. 저 키가 app이면 결과물이 app.js로 나오고, zero면 zero.js로 나옵니다.

```js
{
  entry: {
      app: '파일 경로',
      zero: '파일 경로',
  }
}
```

위와 같이 하면 app.js, zero.js 두 개가 생성됩니다. 결과물로 여러 JS를 만들고 싶을 때 저렇게 구분해주면 됩니다. 보통 멀티페이지 웹사이트에서 위와 같이 entry를 여러 개 넣어줍니다. 하나의 entry에 여러 파일들을 넣고 싶을 때는 아래처럼 배열을 사용하면 됩니다.

```js
{
  entry: {
    app: ['a.js', 'b.js'],
  },
}
```

위의 경우는 a.js랑 b.js가 한 파일로 엮여 app.js라는 결과물로 나옵니다. 이렇게 웹팩은 entry의 js 파일부터 시작해서 import, require 관계로 묶여진 다른 js, css, json까지 알아서 파악한 뒤 모두 entry에 기재된 키 개수만큼으로 묶어줍니다.

js 파일 대신 npm 모듈들을 넣어도 됩니다. 보통 @babel/polyfill이나 eventsource-polyfill같은 것들을 적용할 때 다음과 같이 합니다.

아래는 리액트에서 주로 사용하는 예시입니다. app.js와 vendor.js가 결과물로 나옵니다(웹팩4에서부터는 vendor를 자동으로 만들어줍니다. )

```js
{
  entry: {
    vendor: ['@babel/polyfill', 'eventsource-polyfill', 'react', 'react-dom'],
    app: ['@babel/polyfill', 'eventsource-polyfill', './client.js'],
  },
}
```

이렇게 하면 각각의 엔트리가 polyfill들이 적용된 상태로 output으로 나옵니다. IE 환경에서 최신 자바스크립트를 사용해 개발하고 싶다면 저 두 폴리필을 npm에서 다운 받은 후 저렇게 모든 엔트리에 넣어주셔야 합니다.

참고로 @babel/polyfill은 deprecated(더 이상 사용되지 않는)되었으니 core-js와 regenerator-runtime으로 대체하는 것이 좋습니다. 또한 entry에 넣기보다는 ./client.js같은 파일 최상단에 import나 require하는 것이 좋습니다.

    npm i core-js regenerator-runtime;

./client 최상

```js
import "core-js/stable";
import "regenerator-runtime/runtime";
```

밑에 loader에서 설명하겠지만 @babel/preset-env에서 useBuiltIns: 'entry'를 하면 import한 것들이 target 속성에 맞춰 자동으로 변환됩니다.

## output

output은 결과물이 나오늘 경로입니다.

```js
{
  output: {
    path: '/dist',
    filename: '[name].js',
    publicPath: '/',
  },
}
```

path랑 publicPath가 헷갈릴 수 있겠네요. path는 output으로 나올 파일이 저장될 경로입니다. publicPath는 파일들이 위치할 서버 상의 경로입니다. Express에 비유하면 express.static 경로와 비슷한 겁니다. filename을 보시면 좀 이상하게 생긴 게 있습니다. [name].js라고 되어 있는데요. 이렇게 써줘야 [name]에 entry의 app이나 vendor 문자열이 들어가 app.js, vendor.js로 결과물이 나옵니다. [name].js가 아니라 result.js라고 적으면 그대로 result.js로 결과물이 나옵니다.

다른 옵션으로는 [hash]나 [chunkhash]가 있습니다. filename에 [name].[hash].js처럼 쓸 수 있습니다.

[hash]는 매번 웹팩 컴파일 시 랜덤한 문자열을 붙여줍니다. 따라서 캐시 삭제 시 유용합니다. [hash]가 컴파일할 때마다 랜덤 문자열을 붙여준다면 [chunkhash]는 파일이 달라질 때에만 랜덤 값이 바뀝니다. 이것을 사용하면 변경되지 않은 파일들은 계속 캐싱하고 변경된 파일만 새로 불러올 수 있습니다.

## loader

이제부터 막강한 웹팩의 기능들이 나옵니다. 바로 로더(loader)입니다. 보통 웹팩을 사용하면 babel을 주로 같이 사용합니다. ES2015 이상의 문법이나 타입스크립트 그리고 리액트의 JSX같은 문법을 브라우저에서 사용하기 위함인데요. IE같은 구형 브라우저랑 호환시킬 수도 있습니다.

    npm i -D babel-loader @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript

일단 babel-loader와 @babel/core는 필수이고요. 나머지 preset들은 선택입니다. preset-react는 react 하시는 분만 설치하면 되고요. preset-env는 브라우저에 필요한 ecmascript 버전을 자동으로 파악해서 알아서 polyfill을 넣어줍니다. 정말 놀라운 기술입니다. preset-typescript는 타입스크립트를 사용하신다면 넣으세요.

    polyfill은 기본적으로 지원하지 않는 이전 브라우저에서 최신 기능을 제공하는 데 필요한 코드.

```js
{
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      options: {
        presets: [
          [
            '@babel/preset-env', {
              targets: { node: 'current' }, // 노드일 경우만
              modules: 'false',
              useBuiltIns: 'usage'
            }
          ],
          '@babel/preset-react', // 리액트를 쓴다면
          '@babel/preset-typescript' // 타입스크립트를 쓴다면
        ],
      },
      exclude: ['/node_modules'],
    }],
  },
}
```

env만 좀 독특하죠? 'env' 다음에 target과 modules: false, useBuiltIns: 'usage'라는 옵션이 들어 있습니다. option의 option인 셈이죠.

target은 지원하길 원하는 환경을 적는 곳입니다. 현재 최신 버전 노드로 되어있는데 구 버전 노드 버전을 적어주면 구 버전 문법을 지원하기 위해 폴리필들이 추가됩니다. 노드 대신 브라우저를 타겟으로 할 수도 있습니다.

modules를 false로 해야 최신모듈 시스템이 그대로 유지되어서 트리 쉐이킹이 됩니다. ES2015 모듈 시스템에서 import되지 않은 export들을 정리해주는 기능이죠. 용량이 많이 줄어들기 때문에 꼭 트리 쉐이킹을 사용하세요! 단, commonJS나 AMD, UMD같은 모듈 시스템을 사용해야하는 클라이언트에서는 쓰면 제대로 처리되지 않습니다.

useBuiltIns: 'entry'는 위에 core-js를 언급할 때 설명했습니다. entry 파일 최상단에 넣어둔 import 'core-js/stable'과 import 'regenerator-runtime/runtime'을 자신의 target에 맞게 바꾸어줍니다. 'entry' 외에 'usage'와 false도 있는데 개인적으로 'usage'를 제일 선호합니다. 'usage'는 알아서 사용코드를 파악하여 폴리필을 import해줍니다. entry 파일 최상단에 import문을 적을 필요가 없습니다. false는 entry 최상단에 넣은 import문을 그냥 그대로 사용합니다. 즉 환경에 따라 polyfill을 다르게 적용하지 않는 것입니다.

## plugins

플러그인은 약간 부가적인 기능입니다. 다양한 플러그인들이 나와있는데 이를 사용하면 효과적으로 번들링을 할 수 있습니다. 예를 들면 압축을 한다거나, 핫리로딩을 한다거나, 파일을 복사하는 등의 부수적인 작업을 할 수 있습니다. 다양한 플러그인들이 패키지로 존재하기 때문에 쇼핑하듯 골라보세요!

```js
{
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'), // 아래 EnvironmentPlugin처럼 할 수도 있습니다.
    }),
    new webpack.EnvironmentPlugin({ 'NODE_ENV': 'production' }), // 요즘은 DefinePlugin보다 이렇게 하는 추세입니다.
  ],
}
```

## optimization

웹팩4에서 최적화 관련 플러그인들이 모두 이쪽 속성으로 통합되었습니다. 나중에 나오는 CommonsChunkPlugin도 사라지고 여기에 병합되었습니다.

```js
{
  optimization: {
    minimize: true/false,
    splitChunks: {},
    concatenateModules: true,
  }
}
```

예를 들자면 minimize가 UglifyJsPlugin을 계승하고, splitChunks가 CommonsChunkPlugin을 계승합니다. 또한 mode가 production일 때는 자동으로 이 두 속성이 켜집니다. concatenateModules 옵션은 ModuleConcatenationPlugin을 계승합니다.

용량 관계로 다음 강좌에서 계속 이어집니다! 이번 시간에 주로 js를 번들링하는 방법을 살펴봤다면, 다음 시간에는 css랑 기타 파일들 번들링 방법을 알아보겠습니다.
