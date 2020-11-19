export class Import{
    constructor(src:string, dst:string){
        this.src = src;
        this.dst = dst;
        this.full_dst = GetDst() + Import.sep + dst

        if (!IsGame()){
            Import.copy(src, this.full_dst)
        }
    }

    private static isExist(path: string){
        let [ok, err] = os.rename(path, path)
        if (!ok) {
            return false
        }
        return true
    }

    private static isDir(path: string){
        return Import.isExist(path + Import.sep)
    }

    private static scanDir(path:string){
        let f: LuaFile;
        if (Import.sep == '/'){
            // Linux
            f = io.popen('ls -a "' + path + '"')
        } else {
            // Windows
            f = io.popen('dir ' + path + ' /b/a')
        }

        let list: string[] = [];
        for (let [line] of f.lines()){
            list.push(line)
        }
        f.close()

        return list
    }

    private static copyFile(src: string, dst: string){
        if (!Import.isExist(src)){
            error("Import: file " + src + " does not exist.")
        }

        let [infile] = io.open(src, "rb")
        if (!infile){error('Import: can not open file ' + src)}
        let [instr] = infile.read('*a')
        if (!instr){error('Import: can not open file ' + src)}
        infile.close()
    
        let [outfile] = io.open(dst, "wb")
        if (!outfile){error('Import: can not open file ' + dst)}
        outfile.write(instr)
        outfile.close()
    }

    private static copyDir(src: string, dst: string){
        if (!Import.isDir(dst)){
            os.execute('mkdir ' + dst)
        }  

        let list = Import.scanDir(src)
        for (let name of list){
            let src_path = src + Import.sep + name
            let dst_path = dst + Import.sep + name
            if (Import.isDir(src_path)){
                Import.copyDir(src_path, dst_path)
            } else {
                Import.copyFile(src_path, dst_path)
            }
        }
    }

    private static copy(src: string, dst:string){
        let tree = dst.split('/')

        // Make directories.
        for (let i = 1; i < tree.length - 1; i++){
            tree[i] = tree[i - 1] + Import.sep + tree[i]
            if (!Import.isExist(tree[i])){
                os.execute('mkdir ' + tree[i])
            }
        }

        if (Import.isDir(src)){
            Import.copyDir(src, dst)
        } else {
            Import.copyFile(src, dst)
        }
    }

    private static sep = IsGame() ? '\\' : _G.package.config.charAt(0);

    private src:string;
    private dst:string;
    private full_dst:string;
}