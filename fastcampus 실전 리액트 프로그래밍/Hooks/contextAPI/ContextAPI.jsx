export const UserContext = createContext("");

function App() {
  return (
    <div>
      <UserContext.Provider value="mike">
        <div>상단 메뉴</div>
        <Profile /> {/* 1 */}
        <div>하단 메뉴</div>
      </UserContext.Provider>
    </div>
  );
}

function Profile() {
  return (
    <div>
      <Greeting /> {/* 2 */}
      {/* ... */}
    </div>
  );
}

const Greeting = () => {
  return (
    <UserContext.Consumer>
      {(username) => <p>{`${username}님 안녕하세요`}</p>}
    </UserContext.Consumer>
  );
};
