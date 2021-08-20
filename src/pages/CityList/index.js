import React, { Component } from "react";

import axios from "axios";

import { NavBar,Toast } from "antd-mobile";
import "./index.scss";

import { getCurrentCity } from "../../utils/index";

import { List, AutoSizer } from "react-virtualized";

// 数据格式化方法
//list:[{},{}]
const formatCityData = (list) => {
  const cityList = {};

  //1 遍历list数组
  //2 获取每一个城市的首字母
  //3 判断cityList中是否有该分类
  // 4 如果有，就直接往该分类push数据
  // 5如果没有，就先创建一个数组，然后，把当前城市信息添加到数组中
  list.forEach((item) => {
    const first = item.short.substr(0, 1);
    if (cityList[first]) {
      cityList[first].push(item);
    } else {
      cityList[first] = [item];
    }
  });

  // 获取索引数据
  const cityIndex = Object.keys(cityList).sort();
  return {
    cityList,
    cityIndex,
  };
};
const TITLE_HEIGHT = 36
const NAME_HEIGHT = 50
const HOUSE_CITY = ['北京','上海','广州','深圳']
const formatCityIndex=(letter)=>{
    switch(letter){
        case '#':
        return '当前定位'
        case 'hot':
        return '热门城市'
        default:
            return letter.toUpperCase()
    }
}
export default class CityList extends Component {
    constructor(props){
        super(props)

        this.state = {
            cityList: {},
            cityIndex: [],
            activeIndex:0
          }
        //创建Ref对象
        this.cityListComponent = React.createRef()

    }
 

  async componentDidMount() {
   await this.getCityList();
    // 调用measureAllRows 提前计算List中每一行的高度，实现scrollToRow的精确跳转
    this.cityListComponent.current.measureAllRows()
  }

  // 获取城市列表
  async getCityList() {
    const res = await axios.get("http://localhost:8080/area/city?level=1");
    const { cityList, cityIndex } = formatCityData(res.data.body);
    const hotRes = await axios.get("http://localhost:8080/area/hot");
    cityList["hot"] = hotRes.data.body;
    //    将索引添加到cityIndex中
    cityIndex.unshift("hot");

    // 获取当前定位城市
    const curCity = await getCurrentCity();

    cityList["#"] = [curCity];
    cityIndex.unshift("#");
    console.log(cityList, cityIndex, curCity);
    this.setState({
      cityList,
      cityIndex,
    });
  }
  changeCity({label,value}){
      if(HOUSE_CITY.indexOf(label) > -1){
          localStorage.setItem('hkzf_city',JSON.stringify({label,value}))
          this.props.history.go(-1)
          
      }else{
        Toast.info('该城市暂无房源数据',1,null,false)
      }

  }

  rowRenderer=({ 
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) =>{
      const {cityIndex,cityList}  = this.state
      const letter  = cityIndex[index]

    //   获取指定字母索引下的城市列表数据

    return (
        <div key={key} style={style} className="city">
            <div className="title">{formatCityIndex(letter)}</div>
           {
               cityList[letter].map((item)=> <div className="name" key={item.value} onClick={()=>{this.changeCity(item)}}>{item.label}</div>)
           }
        </div>
     
    );
  }

  getRowHeight=({index})=>{
    // 索引标题高度+城市数量 * 城市名称的高度
// TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
    const {cityIndex,cityList } = this.state

      return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
  }

  renderCityIndex(){
      const {activeIndex,cityIndex} = this.state
      return cityIndex.map((item,index)=> <li onClick={()=>{
          console.log(index)
          this.cityListComponent.current.scrollToRow(index)
      }} key={item} className="city-index-item">
      <span className={activeIndex === index? 'index-active':''}>{item === 'hot' ? '热':item.toUpperCase()}</span>
  </li>)
  }
  onRowsRendered=({startIndex})=>{
    if(this.state.activeIndex !== startIndex){
        this.setState({
            activeIndex:startIndex
        })
    }
  }

  render() {
    return (
      <div className="citylist">
        <NavBar
          className="navbar"
          mode="light"
          icon={<i className="iconfont icon-back"></i>}
          onLeftClick={() => this.props.history.go(-1)}
          rightContent={[]}
        >
          城市选择
        </NavBar>
        {/* 城市列表 */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              scrollToAlignment="start"
              ref={this.cityListComponent}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
              width={width}
              onRowsRendered={this.onRowsRendered}
              
            />
          )}
        </AutoSizer>
        {/* 右侧索引列表 */}
        <ul className="city-index">
           {this.renderCityIndex()}
        </ul>
      </div>
    );
  }
}
