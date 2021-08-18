import React, { Component } from "react";

import { Carousel, Flex, Grid, WingBlank } from "antd-mobile";

import axios from "axios";

import Nav1 from "../../assets/images/nav-1.png";
import Nav2 from "../../assets/images/nav-2.png";
import Nav3 from "../../assets/images/nav-3.png";
import Nav4 from "../../assets/images/nav-4.png";

import "./index.scss";

const navs = [
  {
    id: 1,
    img: Nav1,
    title: "整租",
    path: "/home/list",
  },
  {
    id: 2,
    img: Nav2,
    title: "合租",
    path: "/home/list",
  },
  {
    id: 3,
    img: Nav3,
    title: "地图找房",
    path: "/map",
  },
  {
    id: 4,
    img: Nav4,
    title: "去出租",
    path: "/home/list",
  },
];

// 获取地理位置信息
// navigator.geolocation.getCurrentPosition(position => {
//   console.log('当前位置信息：', position)
// })


export default class Index extends Component {
  state = {
    //轮播图状态数据
    swipers: [],
    isSwiperLoaded: false,
    //租房小组数据
    groups: [],
    // 最新资讯
    news: [],
    // 当前城市名称
    curCityName:'上海'
  };

  //获取轮播图数据的方法
  async getSwipers() {
    const res = await axios.get("http://localhost:8080/home/swiper");
    this.setState({
      swipers: res.data.body,
      isSwiperLoaded: true,
    });
  }

  //获取租房小组数据
  async getGroups() {
    const res = await axios.get("http://localhost:8080/home/groups", {
      params: {
        area: "AREA%7C88cff55c-aaa4-e2e0",
      },
    });
    // console.log(res)
    this.setState({
      groups: res.data.body,
    });
  }
  //   获取最新资讯
  async getNews() {
    const res = await axios.get("http://localhost:8080/home/news", {
      params: {
        area: "AREA%7C88cff55c-aaa4-e2e0",
      },
    });
    this.setState({
      news: res.data.body,
    });
  }
  componentDidMount() {
    this.getSwipers();
    this.getGroups();
    this.getNews();

    // 通过ip定位获取到当前城市的名称
    const curCity = new window.BMapGL.LocalCity();
    curCity.get(async res=>{
      const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`)
      this.setState({
        curCityName : result.data.body.label
      })
    })
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
  renderNavs() {
    return navs.map((item) => (
      <Flex.Item
        key={item.id}
        onClick={() => this.props.history.push(item.path)}
      >
        <img src={item.img} alt=""></img>
        <h2>{item.title}</h2>
      </Flex.Item>
    ));
  }
  // 渲染最新资讯
  renderNews() {
    return this.state.news.map((item) => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={`http://localhost:8080${item.imgSrc}`}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ));
  }

  render() {
    return (
      <div className="index">
        <div className="swiper">
          {this.state.isSwiperLoaded ? (
            <Carousel autoplay={true} infinite autoplayInterval={5000}>
              {this.renderSwipers()}
            </Carousel>
          ) : (
            ""
          )}
          {/* 搜索框 */}
          <Flex className="search-box">
            {/* 左侧白色区域 */}
            <Flex className="search">
              {/* 位置 */}
              <div
                className="location"
                onClick={() => this.props.history.push("/citylist")}
              >
                <span className="name">{this.state.curCityName}</span>
                <i className="iconfont icon-arrow"></i>
              </div>
              {/* 搜索表单 */}
              <div className="form" onClick={() => this.props.history.push("/search")}>
                <i className="iconfont icon-search"></i>
                <span className="text">请输入小区或地址</span>
              </div>
            </Flex>
            {/* 右侧地图图标 */}
            <i className="iconfont icon-map" onClick={() => this.props.history.push("/map")}></i>
          </Flex>
        </div>
        {/* 导航菜单 */}
        <Flex className="nav">{this.renderNavs()}</Flex>
        {/* 租房小组 */}
        <div className="group">
          <h3 className="group-title">
            租房小组 <span className="more">更多</span>
          </h3>
          <Grid
            data={this.state.groups}
            square={false}
            hasLine={false}
            columnNum={2}
            renderItem={(item) => (
              <Flex key={item.id} className="group-item" justify="around">
                <div className="desc">
                  <p className="title">{item.title}</p>
                  <span className="info">{item.desc}</span>
                </div>
                <img src={`http://localhost:8080${item.imgSrc}`} alt=""></img>
              </Flex>
            )}
          />
        </div>
        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    );
  }
}
