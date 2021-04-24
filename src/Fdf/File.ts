import { log } from '../Utils'
import { IFace } from "./IFace";

export class File {
    constructor(name: string){
        this.name = name
        if (File._name2file.get(name)){
            error(File.name + 
                         ': file with the same name already exists.')
        }
        File._name2file.set(name, this)

        if (!IsGame()){
            MacroFinal(()=>{this.save()})
        } else {
            let toc_path = File.__dst_dir + name + '.toc'
            if (!BlzLoadTOCFile(toc_path)){
                error(File.name + 
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

        let dir = GetDst() + File.__sep + File.__dst_dir
        let toc_path = dir + this.name + '.toc'
        let fdf_path = dir + this.name + '.fdf'

        let tree = dir.split(File.__sep)
        // Make directories.
        for (let i = 1; i < tree.length - 1; i++){
            tree[i] = tree[i - 1] + File.__sep + tree[i]
            if (File.__sep == '/'){
                os.execute('mkdir -p ' + tree[i])
            } else {
                os.execute('if not exist ' + tree[i] + ' mkdir ' + tree[i])
            }
        }

        let [fdf] = io.open(fdf_path, 'w')
        fdf?.write(output)
        fdf?.close()

        let [toc] = io.open(toc_path, 'w')
        toc?.write(File.__dst_dir + this.name + '.fdf\n\n\n')
        toc?.close()

        if (!IsGame()){
            log(log_msg, 'Msg')
        }
    }

    readonly name: string;
    protected _list: IFace[] = []

    protected static _name2file = new Map<string, File>()

    private static __sep = IsGame() ? '\\' : _G.package.config.charAt(0);
    private static __dst_dir = 'war3mapImported' + File.__sep + 'FrameExt' + File.__sep;
}