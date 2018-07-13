import style from './Item.less';
import React, {Component} from 'react';
import {Card, Button, Icon, Spin} from 'antd';
import Clear from './Clear';
import store from '../public/store';

const Log = function(props){
    return (
        props.data.map((v)=>{
           return <p key={v}>{v}</p>
        })
    )
}

export default class App extends Component {
    constructor(){
        super()
        this.state = {
            start:false,
            loading:false,
            access:[],
            error:[]
        }
    }

    cmd(type){
        const data = this.props.data;
        return 'cd ' + data.dir + ' && ' + data.path + ' -p '+ data.dir + ' ' + type
    }

    switch = (e)=>{
        this.setState({
            loading:true
        })
        if(this.state.start){
            Process.exec(this.cmd('-s stop'), (err)=>{
                if(!err){
                    this.setState({
                        loading:false,
                        start:false
                    })
                }
            })
        }
        else{
            Process.exec(this.cmd('-c conf/nginx.conf'))
            setTimeout(()=>{
                this.setState({
                    start:true,
                    loading:false
                })
            }, 100)
        }
    }

    reload = (e)=>{
        this.setState({
            loading:true
        })
        Process.exec(this.cmd('-s reload'), ()=>{
            this.setState({
                loading:false
            })
        })
    }

    edit = (e)=>{
        Shell.openItem(this.props.data.conf)
    }

    remove = (e)=>{
        this.props.remove(this.props.index)
    }

    open = (e)=>{
        Shell.showItemInFolder(this.props.data.path)
    }

    showLog(type){
        const file = this.props.data[type];
        Fs.readFile(file, (err, data)=>{
            if(!err){
                store.dispatch({
                    type:'CHANGE_' + type.toLocaleUpperCase(),
                    [type]:data.toString().split(/\n/g).slice(-30)
                })
                this.refs[type].scrollTop = 19920604
            }
        })
    }

    watch(type){
        const file = this.props.data[type];
        Fs.watchFile(file, ()=>{
            this.showLog(type)
        })
    }

    updateStatusOnPid(){
        Fs.readFile(this.props.data.pid, (err, data)=>{
            if(!err){
                this.setState({
                    loading:true
                })
                Process.exec('tasklist|findstr ' + data.toString(), (error, stdout, stderr)=>{
                    if(!error){
                        this.setState({
                            loading:false,
                            start:true
                        })
                    }
                    else{
                        this.setState({
                            loading:false
                        })
                    }
                })
            }
        })
    }

    componentDidMount(){

        this.unsubscribe = store.subscribe(()=>{
            const state = store.getState();
            this.setState(state)
        });

        ['access', 'error'].forEach((v)=>{
            this.showLog(v);
            this.watch(v);
        })
        this.updateStatusOnPid()
    }

    componentWillUnmount(){
        this.unsubscribe()
        //取消文件监听
        ['access', 'error'].forEach((v)=>{
            Fs.unwatchFile(this.props.data[v])
        })
        Process.exec(this.cmd('-s stop'))
    }

    render(){
        const state = this.state;
        const props = this.props;
        return (
            <div className={style.card}>
                <Spin spinning={this.state.loading}>
                    <Card 
                        className={state.start ? style.start : ''}
                        title={
                            <span>
                                <Button 
                                    type={state.start ? '' : 'primary'} 
                                    onClick={this.switch}>
                                    <Icon type={state.start ? 'poweroff' : 'play-circle-o'}  />
                                    {state.start ? '停止' : '启动'}
                                </Button>
                                <Button 
                                    style={{marginLeft:16, display:state.start ? 'inline-block' : 'none'}}
                                    onClick={this.reload}>
                                    <Icon type="reload" />
                                    重启
                                </Button>
                            </span>
                        } 
                        extra={
                            <span>
                                <Button onClick={this.edit}><Icon type="edit" />编辑配置</Button>
                                <Button onClick={this.open} style={{marginLeft:16}}><Icon type="folder-open" />打开目录</Button>
                                <Button type="danger" onClick={this.remove} style={{marginLeft:16}}><Icon type="delete" />删除</Button>
                            </span>
                        }>
                        <div className={style.access}>
                            {state.access[0] ? <Clear type="access" url={props.data.access} /> : ''}
                            <div ref="access">
                                <Log data={state.access} />
                            </div>
                        </div>
                        <div className={style.error}>
                            {state.error[0] ? <Clear type="error" url={props.data.error} /> : ''}
                            <div ref="error">
                                <Log data={state.error} />
                            </div>
                        </div>
                    </Card>
                </Spin>
            </div> 
        )
    }
}