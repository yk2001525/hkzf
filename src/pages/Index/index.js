import React, { Component } from "react";

import { Carousel,Flex } from "antd-mobile";

import axios from "axios";

import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

import './index.scss'

const navs = [
    {
        id:1,
        img:Nav1,
        title:'整租',
        path:'/home/list'
    },
    {
        id:2,
        img:Nav2,
        title:'合租',
        path:'/home/list'
    },
    {
        id:3,
        img:Nav3,
        title:'地图找房',
        path:'/map'
    },
    {
        id:4,
        img:Nav4,
        title:'去出租',
        path:'/home/list'
    }
]

export default class Index extends Component {
  state = {
    //轮播图状态数据
    swipers: [],
    isSwiperLoaded:false
  };

  //获取轮播图数据的方法
  async getSwipers() {
    const res = await axios.get("http://localhost:8080/home/swiper");
    this.setState({
      swipers: res.data.body,
      isSwiperLoaded:true
    });
  }
  componentDidMount() {
    this.getSwipers();
  }

  //渲染轮播图
  renderSwipers() {
    return this.state.swipers.map((item) => (
      <a
        key={item.id}
        href="http://www.alipay.com"
        style={{ display: "inline-block", width: "100%", height: 212 }}
      >
        <img
          src={`http://localhost:8080${item.imgSrc}`}
          alt=""
          style={{ width: "100%", verticalAlign: "top" }}
        />
      </a>
    ));
  }
  renderNavs(){
      return navs.map(item=><Flex.Item key={item.id} onClick={()=>this.props.history.push(item.path)}>
        <img src={item.img} alt=""></img>
        <h2>{item.title}</h2>
    </Flex.Item>)
  }
  render() {
    return (
      <div className="index">
          <div className="swiper">
       {
           this.state.isSwiperLoaded?
           <Carousel autoplay={true} infinite autoplayInterval={5000}>
           {this.renderSwipers()}
         </Carousel>:''
       }
       </div>
        {/* 导航菜单 */}
        <Flex className="nav">
            {this.renderNavs()}
        </Flex>
      </div>
    );
  }
}