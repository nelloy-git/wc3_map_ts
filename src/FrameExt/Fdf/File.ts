import { Log } from "../../Utils";
import { FdfIFace } from "./IFace";

export class FdfFile {
    constructor(name: string){
        this.name = name
        if (FdfFile._name2file.get(name)){
            return Log.err(FdfFile.name + 
                           ': file with the same name already exists.')
        }
        FdfFile._name2file.set(name, this)

        if (!IsGame()){
            BuildFinal(()=>{this.save()})
        } else {
            let toc_path = FdfFile._dst_dir + name + '.toc'
            if (!BlzLoadTOCFile(toc_path)){
                return Log.err(FdfFile.name + 
                               ': can not load ' + toc_path)
            }
        }
    }

    public add(fdf: FdfIFace){
        this._list.push(fdf)
    }

    public remove(fdf: FdfIFace){
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

        let dir = GetDst() + FdfFile._sep + FdfFile._dst_dir
        let toc_path = dir + this.name + '.toc'
        let fdf_path = dir + this.name + '.fdf'

        let tree = dir.split(FdfFile._sep)
        // Make directories.
        for (let i = 1; i < tree.length - 1; i++){
            tree[i] = tree[i - 1] + FdfFile._sep + tree[i]
            os.execute('mkdir ' + (FdfFile._sep == '/' ? '-p ' : '/Q ') + tree[i])
        }

        let [fdf] = io.open(fdf_path, 'w')
        fdf?.write(output)
        fdf?.close()

        let [toc] = io.open(toc_path, 'w')
        toc?.write(FdfFile._dst_dir + this.name + '.fdf\n\n\n')
        toc?.close()

        Log.msg(log_msg)
    }

    readonly name: string;
    protected _list: FdfIFace[] = []

    protected static _name2file = new Map<string, FdfFile>()

    private static _sep = IsGame() ? '\\' : _G.package.config.charAt(0);
    private static _dst_dir = 'war3mapImported' + FdfFile._sep + 'FrameExt' + FdfFile._sep;
}