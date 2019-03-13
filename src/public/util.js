import path from 'path';

export default {
    getFileData(files, callback=new Function){
        let data = [];
        for(let file of files){
            if(file.name === 'nginx.exe'){
                const _path = path.dirname(file.path).replace(/\\/g, '/');
                const logs = _path + '/logs';
                //修复目录名称包含空格，会被当做命令处理问题，给带空格到目录名称加上引号
                const cmdDir = _path.replace(/[^\/]+/g, (str) => {
                    if(/\s+/.test(str)){
                        return `"${str}"`
                    }
                    return str
                });
                data.push({
                    cmdDir,
                    logs,
                    name:file.name,
                    cmdPath:`${cmdDir}/nginx.exe`,
                    cmdConf:`${cmdDir}/conf/nginx.conf`,
                    path:`${_path}/nginx.exe`,
                    conf:`${_path}/conf/nginx.conf`,
                    access:`${logs}/access.log`,
                    error:`${logs}/error.log`,
                    pid:`${logs}/nginx.pid`
                })
            }
        }
        callback(data)
    }
}