import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import About from './About';
import HistorySample from './HistorySample';
import Home from './Home';
import Profiles from './Profiles';

const App = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">홈</Link>
        </li>
        <li>
          <Link to="/about">소개</Link>
        </li>
        <li>
          <Link to="/profiles">프로필 목록</Link>
        </li>
        <li>
          <Link to="/history">예제</Link>
        </li>
      </ul>
      <hr />
      <Switch>
        <Route path="/" exact={true} component={Home} />
        <Route path="/about" component={About} />
        <Route path="/profiles" component={Profiles} />
        <Route path="/history" component={HistorySample} />
        <Route render={({location}) => <div>
          <h2>이 페이지는 존재하지 않습니다.</h2>
          <p>
            {location.pathname}
          </p>
        </div>} />
      </Switch>
    </div>
  );
};

export default App;