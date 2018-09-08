export default {
    getFileData(files, callback=new Function){
        let data = [];
        for(let file of files){
            if(file.name === 'nginx.exe'){
                const path = file.path.replace(/\\/g, '/');
                const dir = Path.dirname(path);
                const logs = Path.join(dir, './logs/').replace(/\\/g, '/');
                data.push({
                    path,
                    dir,
                    logs,
                    name:file.name,
                    conf:Path.join(dir, './conf/nginx.conf').replace(/\\/g, '/'),
                    access:`${logs}access.log`,
                    error:`${logs}error.log`,
                    pid:`${logs}nginx.pid`
                })
            }
        }
        callback(data)
    }
}