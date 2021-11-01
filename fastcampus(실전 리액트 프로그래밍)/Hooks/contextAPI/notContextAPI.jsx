function App() {
  return (
    <div>
      <div>상단 메뉴</div>
      <Profile username="mike" /> {/* 1 */}
      <div>하단 메뉴</div>
    </div>
  );
}

function Profile({ username }) {
  return (
    <div>
      <Greeting username={username} /> {/* 2 */}
      {/* ... */}
    </div>
  );
}

function Greeting({ username }) {
  return <p>{`${username}님 안녕하세요`}</p>;
}

// 1 부모 컴포넌트에서 중간에 있는 Profiile 컴포넌트로 속성값을 전달한다.
// 2 Profile 컴포넌트는 username 속성값을 사용하지 않고 기계적으로 전달한다
