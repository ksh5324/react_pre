const { observable, autorun, runInAction, reaction } = require("mobx");

const state = observable({
  compA: "a",
  comB: 12,
  compC: null,
});

const userState = observable({
  isLoggingIn: true,
  data: null,
});

const postState = observable([]);

postState.push({ id: 1, content: "안녕하세요" });
userState.data = {
  id: 1,
  nickname: "zero",
};

autorun(() => {
  console.log("changed");
}); // 바뀔 때마다 실행

reaction(
  () => {
    return state.compB; // name이 바꼈을 때만 실행
  },
  () => {
    console.log(state.compB);
  }
);

state.compA = "b";
state.compB = "b";
state.compC = "b"; // mobx는 붙어있으면 하나의 action으로 취급

const change = action(() => {
  state.compA = "b";
  state.compB = "b";
  state.compC = "b";
}); // 즉시 실행하고 싶지 않을 때

change();
change();

runInAction(() => {
  state.compA = "c";
}); // 하나의 액션 정확히 명시 // 즉시 실행
