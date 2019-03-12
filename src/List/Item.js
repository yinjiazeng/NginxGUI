import style from './Item.less';
import React, {Component} from 'react';
import {Card, Button, Icon, Spin} from 'antd';
import Clear from './Clear';

const Log = function(props){
    return (
        props.data.map((v, i)=>{
           return <p key={i}>{v}</p>
        })
    )
}

export default class App extends Component {
    state = {
        start:false,
        loading:false,
        access:[],
        error:[]
    }

    cmd(type){
        const data = this.props.data;
        return 'cd ' + data.cmdDir + ' && ' + data.cmdPath + ' -p '+ data.cmdDir + ' ' + type
    }

    switch = (e)=>{
        this.setState({
            loading:true
        })
        if(this.state.start){
            //停止
            Process.exec(this.cmd('-s stop'), (err)=>{
                this.setState({
                    loading:false,
                    start:false
                })
            })
        }
        else{
            //启动
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
        //重启
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
                this.setState({
                    [type]:data.toString().split(/\n/g).slice(-30)
                }, ()=>{
                    this.refs[type].scrollTop = 19920604
                })
            }
        })
    }

    updateStatusByPid(){
        this.setState({
            loading:true
        })
        Fs.readFile(this.props.data.pid, (err, data)=>{
            if(!err){
                //根据进程id检测当前nginx是否已经启动
                Process.exec('tasklist|findstr ' + data.toString(), (error, stdout, stderr)=>{
                    this.setState({
                        loading:false,
                        start:!error
                    })
                })
            }
            else{
                this.setState({
                    loading:false
                })
            }
        })
    }

    componentDidMount(){
        ['access', 'error'].forEach((v)=>{
            this.showLog(v)
            Fs.watchFile(this.props.data[v], ()=>{
                this.showLog(v)
            })
        })
        this.updateStatusByPid()
    }

    componentWillUnmount(){
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
                                <Button onClick={this.remove} style={{marginLeft:16}} type="danger"><Icon type="delete" />删除</Button>
                            </span>
                        }>
                        <div className={style.access}>
                            {state.access[0] ? <Clear item={this} type="access" url={props.data.access} /> : ''}
                            <div ref="access">
                                <Log data={state.access} />
                            </div>
                        </div>
                        <div className={style.error}>
                            {state.error[0] ? <Clear item={this} type="error" url={props.data.error} /> : ''}
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