export class Import{
    constructor(src:string, dst:string){

        src = string.gsub(src, '\\', Import.__sep)[0]
        src = string.gsub(src, '/', Import.__sep)[0]
        
        dst = string.gsub(dst, '\\', Import.__sep)[0]
        dst = string.gsub(dst, '/', Import.__sep)[0]

        this.src = src
        this.dst = dst
        this.__full_dst = GetDst() + Import.__sep + dst

        if (!IsGame()){
            Import.__copy(src, this.__full_dst)
        }
    }

    readonly src: string;
    readonly dst: string;
    private __full_dst: string;

    private static __isExist(path: string){
        let [ok, err, code] = os.rename(path, path)
        if (!ok) {
            if (<number><unknown>code == 13){
               return true
            }
            return false
        }
        return true
    }

    private static __isDir(path: string){
        return Import.__isExist(path + Import.__sep)
    }

    private static __scanDir(path:string){
        let f: LuaFile;
        if (Import.__sep == '/'){
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

    private static __copyFile(src: string, dst: string, err_lvl: number){
        if (!Import.__isExist(src)){
            error("Import: file " + src + " does not exist.", err_lvl)
        }

        let [infile] = io.open(src, "rb")
        if (!infile){error('Import: can not open file ' + src, err_lvl)}
        let [instr] = infile.read('*a')
        if (!instr){error('Import: can not open file ' + src, err_lvl)}
        infile.close()
    
        let [outfile] = io.open(dst, "wb")
        if (!outfile){error('Import: can not open file ' + dst, err_lvl)}
        outfile.write(instr)
        outfile.close()
    }

    private static __copyDir(src: string, dst: string, err_lvl: number){
        if (!Import.__isDir(dst)){
            os.execute('mkdir ' + dst)
        }  

        let list = Import.__scanDir(src)
        for (let name of list){
            let src_path = src + Import.__sep + name
            let dst_path = dst + Import.__sep + name
            if (Import.__isDir(src_path)){
                Import.__copyDir(src_path, dst_path, err_lvl + 1)
            } else {
                Import.__copyFile(src_path, dst_path, err_lvl + 1)
            }
        }
    }

    private static __copy(src: string, dst:string){
        let tree = dst.split(Import.__sep)

        // Make directories.
        for (let i = 1; i < tree.length - 1; i++){
            tree[i] = tree[i - 1] + Import.__sep + tree[i]
            
            if (!Import.__isExist(tree[i]) && !Import.__isDir(tree[i])){
                os.execute('mkdir ' + tree[i])
            }
        }

        if (Import.__isDir(src)){
            Import.__copyDir(src, dst, 4)
        } else {
            Import.__copyFile(src, dst, 4)
        }
    }

    private static __sep = IsGame() ? '\\' : _G.package.config.charAt(0);
}