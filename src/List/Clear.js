import React, {Component} from 'react';
import {Button, Icon} from 'antd';

export default class App extends Component {

    state = {
        loading:false
    }

    clear = ()=>{
        if(!this.state.loading){
            const props = this.props;
            this.setState({
                loading:true
            })
            Fs.writeFile(props.url, '', (err)=>{
                this.setState({
                    loading:false
                })
                props.item.setState({
                    [props.type]:[]
                })
            })
        }
    }

    render(){
        return (
            <Button size="small" onClick={this.clear}>
                <Icon type={!this.state.loading ? 'close' : 'loading'} />
                清空日志
            </Button>
        )
    }
}