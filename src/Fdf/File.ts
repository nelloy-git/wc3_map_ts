import { Log } from "../Utils";
import { IFace } from "./IFace";

export class File {
    constructor(name: string){
        this.name = name
        if (File._name2file.get(name)){
            return Log.err(File.name + 
                           ': file with the same name already exists.')
        }
        File._name2file.set(name, this)

        if (!IsGame()){
            MacroFinal(()=>{this.save()})
        } else {
            let toc_path = File._dst_dir + name + '.toc'
            if (!BlzLoadTOCFile(toc_path)){
                return Log.err(File.name + 
                               ': can not load ' + toc_path)
            }
        }
    }

    public add(fdf: IFace){
        this._list.push(fdf)
    }

    public remove(fdf: IFace){
        let i = this._list.indexOf(fdf)
        if (i < 0){return false}

        this._list.splice(i, 1)
        return true
    }

    private save(){
        if (IsGame()){return}

        let log_msg =  'Created new FdfFile \'' + this.name + '\' containing:'
        let output = ''
        for (let i = 0; i < this._list.length; i++){
            log_msg += '\n    ' + this._list[i].name
            output += this._list[i].serialize() + '\n'
        }

        let dir = GetDst() + File._sep + File._dst_dir
        let toc_path = dir + this.name + '.toc'
        let fdf_path = dir + this.name + '.fdf'

        let tree = dir.split(File._sep)
        // Make directories.
        for (let i = 1; i < tree.length - 1; i++){
            tree[i] = tree[i - 1] + File._sep + tree[i]
            if (File._sep == '/'){
                os.execute('mkdir -p ' + tree[i])
            } else {
                os.execute('if not exist ' + tree[i] + ' mkdir ' + tree[i])
            }
        }

        let [fdf] = io.open(fdf_path, 'w')
        fdf?.write(output)
        fdf?.close()

        let [toc] = io.open(toc_path, 'w')
        toc?.write(File._dst_dir + this.name + '.fdf\n\n\n')
        toc?.close()

        Log.msg(log_msg)
    }

    readonly name: string;
    protected _list: IFace[] = []

    protected static _name2file = new Map<string, File>()

    private static _sep = IsGame() ? '\\' : _G.package.config.charAt(0);
    private static _dst_dir = 'war3mapImported' + File._sep + 'FrameExt' + File._sep;
}