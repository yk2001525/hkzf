import React from 'react'

import {BrowserRouter as Router,Route,Link,Redirect} from 'react-router-dom'
//导入页面组件
import Home from './pages/Home';
import CityList from './pages/CityList';

import Map from './pages/Map/index';

function App() {
  return (
    <Router>
    <div className="App">
      {/* 默认路由匹配时，跳转到/home */}
      <Route path="/" exact render={()=><Redirect to="/home"></Redirect>}></Route>
      {/* 配置路由 */}
      <Route path="/home" component={Home}></Route>
      <Route path="/citylist" component={CityList}></Route>
      <Route path="/map" component={Map}></Route>

    </div>
    </Router>
  );
}

export default App;
