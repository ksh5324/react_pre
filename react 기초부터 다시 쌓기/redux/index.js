const { createStore } = require("redux");

const reducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_COMP_A":
      return {
        ...state,
        compA: action.data,
      };
    case "CHANGE_COMP_B":
      return {
        ...state,
        compB: action.data,
      };
    case "CHANGE_COMP_C":
      return {
        ...state,
        compC: action.data,
      };
    default:
      return state;
  }
};

const initialState = {
  compA: "a",
  compB: 12,
  compC: null,
};

const store = createStore(reducer, initialState);

store.subscribe(() => {
  // react-redux 안에 있음
  console.log("changed");
});

console.log(store.getState());

// action
const changeCompA = (data) => {
  return {
    type: "CHANGE_COMP_A",
    data,
  };
};

const changeCompB = (data) => {
  return {
    type: "CHANGE_COMP_B",
    data,
  };
};

const changeCompC = (data) => {
  return {
    type: "CHANGE_COMP_C",
    data,
  };
};

store.dispatch(changeCompA("b"));

console.log(store.getState());
