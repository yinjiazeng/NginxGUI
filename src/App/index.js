import style from './index.less';
import React, {Component} from 'react';
import Add from '../Add';
import List from '../List';
import util from '../public/util';

export default class App extends Component {
    constructor(){
        super()
        this.state = {
            list:JSON.parse(localStorage.getItem('list') || '[]')
        }
    }

    addList(data){
        let oldList = this.state.list;
        let list = oldList.concat(data.filter((v)=>{
            oldList.forEach((_v)=>{
                if(_v.path === v.path){
                    return v = false
                }
            })
            return v
        }))
        this.setState({
            list:this.store(list)
        })
    }

    store(data){
        localStorage.setItem('list', JSON.stringify(data))
        return data
    }

    selected = (data)=>{
        this.addList(data)
    }

    remove = (i)=>{
        this.setState((prevState)=>{
            let list = prevState.list.slice(0, i).concat(prevState.list.slice(i+1));
            return {
                list:this.store(list)
            }
        })
    }

    drop = (e)=>{
        let state = this.state;
        util.getFileData(e.dataTransfer.files, (data)=>{
            this.addList(data)
        })
        
        e.preventDefault()
        e.stopPropagation()
    }

    dragover = (e)=>{
        e.preventDefault()
        e.stopPropagation()
    }

    render(){
        
        let Layout;

        if(this.state.list.length){
            Layout = <List list={this.state.list} remove={this.remove} selected={this.selected} />
        }
        else{
            Layout = <Add selected={this.selected} />
        }

        return (
            <div 
                className={style.layout} 
                onDrop={this.drop} 
                onDragOver={this.dragover}>
                {Layout}
            </div>
        )
    }
}