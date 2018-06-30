import style from './index.less';
import React, {Component} from 'react';
import util from '../public/util';

export default class App extends Component {

    change = (e)=>{
        util.getFileData(e.target.files, (data)=>{
            this.props.selected(data)
        })
    }

    render(){
        return (
            <div className={style.add} onChange={this.change}>
                请拖拽nginx目录中的nginx.exe文件到窗口中
                <input type="file" title="点击添加nginx" accept="application/octet-stream" />
            </div>
        )
    }
}