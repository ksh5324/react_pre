const path = require("path");

module.exports = {
  name: "word-relay-setting", // 이름
  mode: "development", // 개발용
  devtool: "eval", // 빠르게 하겠다는 것
  resolve: {
    extensions: [".js", ".jsx"],
  },

  module: {
    rules: [
      {
        test: /\.jsx?/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
          plugins: ["@babel/plugin-proposal-class-properties"],
        },
      },
    ],
  },

  entry: {
    app: ["./client"],
  }, // 입력
  output: {
    path: path.join(__dirname, "dist"),
    filename: "app.js",
  }, // 출력
};
