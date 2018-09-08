import style from './index.less';
import React, {Component} from 'react';
import Item from './Item';
import {Button} from 'antd';
import util from '../public/util';

export default class App extends Component {

    change = (e)=>{
        util.getFileData(e.target.files, (data)=>{
            this.props.selected(data)
            setTimeout(()=>{
                this.refs.list.scrollTop = 19920604
            })
        })
    }

    render(){
        //选择文件后重新渲染，不然之前选择的文件就无法选择
        const File = ()=>{
            return <input type="file" title="点击添加nginx" onChange={this.change} accept="application/octet-stream" />
        }
        return (
            <div className={style.list} ref="list">
                {
                    this.props.list.map((v,i)=>{
                        return (
                            <Item key={v.path} data={v} index={i} remove={this.props.remove} />
                        )
                    })
                }
                <Button className={style.button} type="dashed" shape="circle" size="large" icon="plus">
                    <File />
                </Button>
            </div>
        )
    }
}