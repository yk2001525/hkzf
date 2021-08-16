import React, { Component } from 'react'

//导入路由
import {Route} from 'react-router-dom'
import News from '../News'
export default class Home extends Component {
    render() {
        return (
            <div>
                首页
                {/* 渲染子路由 */}
                <Route path="/home/news" component={News}></Route>
            </div>
        )
    }
}
