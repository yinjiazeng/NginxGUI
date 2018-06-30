export default {
    getFileData(files, callback=new Function){
        let data = [];
        for(let file of files){
            if(file.name === 'nginx.exe'){
                let path = file.path.replace(/\\/g, '/');
                let dir = Path.dirname(path);
                data.push({
                    name:file.name,
                    path:path,
                    dir:dir,
                    conf:Path.join(dir, './conf/nginx.conf').replace(/\\/g, '/'),
                    access:Path.join(dir, './logs/access.log').replace(/\\/g, '/'),
                    error:Path.join(dir, './logs/error.log').replace(/\\/g, '/'),
                    pid:Path.join(dir, './logs/nginx.pid').replace(/\\/g, '/')
                })
            }
        }
        callback(data)
    }
}