import React, { Component } from 'react'

// 导入样式
import './index.scss'

export default class Map extends Component {
    componentDidMount(){
        const map = new window.BMapGL.Map('container')
        const point = new window.BMapGL.Point(116.404,39.915)
        map.centerAndZoom(point,15)
    }
    render() {
        return (
            <div className="map">
                {/* 地图容器元素 */}
                <div id="container">

                </div>
            </div>
        )
    }
}
