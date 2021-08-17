import React, { Component } from "react";

//导入路由
import { Route } from "react-router-dom";
import News from "../News";
import Index from "../Index";
import HouseList from "../HouseList";
import Profile from "../Profile";

import { TabBar } from "antd-mobile";
import './index.css'

 //Tabbar数据
 const tabItem = [
    {
        title:'首页',
        icon:'icon-ind',
        path:'/home'
    },
    {
        title:'找房',
        icon:'icon-findHouse',
        path:'/home/list'
    },
    {
        title:'资讯',
        icon:'icon-infom',
        path:'/home/news'
    },
    {
        title:'我的',
        icon:'icon-my',
        path:'/home/profile'
    },
]

export default class Home extends Component {
  state = {
    //默认选中的Tabbar菜单项
    selectedTab: this.props.location.pathname
  };
  //修复路由切换没高亮bug
  componentDidUpdate(prevProps){
    if(prevProps.location.pathname !== this.props.location.pathname){
        this.setState({
            selectedTab:this.props.location.pathname
        })
    }
  }
 
  //渲染TabBar.item
  renderTabBarItem(){
      return tabItem.map((item)=><TabBar.Item
      title={item.title}
      key={item.title}
      icon={
       <i className={`iconfont ${item.icon}`}></i>
      }
      selectedIcon={
        <i className={`iconfont ${item.icon}`}></i>

      }
      selected={this.state.selectedTab === item.path}
      onPress={() => {
        this.setState({
          selectedTab: item.path,
        });

        //路由切换
        this.props.history.push(item.path)
      }}
      data-seed="logId"
    >
    </TabBar.Item>)
  }

  render() {
    return (
      <div className="home">
        {/* 渲染子路由 */}
        <Route path="/home/news" component={News}></Route>
        <Route exact path="/home" component={Index}></Route>
        <Route path="/home/list" component={HouseList}></Route>
        <Route path="/home/profile" component={Profile}></Route>

        {/* Tabbar */}
          <TabBar
            tintColor="#21b97a"
            barTintColor="white"
            noRenderContent={true}
          >
            {this.renderTabBarItem()}
          </TabBar>
        </div>
    );
  }
}
