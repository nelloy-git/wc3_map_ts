import { JsonFileCached } from './FileCached'
import { JsonFileGame } from './FileGame'
import { JsonFileIface } from './FileIface'

function precisionRound(number: number, precision: number)
{
    if (precision < 0){
        let factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
    }
    return +(Math.round(Number(number + "e+" + precision)) + "e-" + precision);
}

export class JsonFile {
    constructor(path: string, root: string = '', use_custom: boolean = false){
        this.root = root
        this.path = path

        this.__file = new JsonFileCached(root + '/' + path)
        if (IsGame() && use_custom){
            let f = new JsonFileGame(path)
            let d = f.read()
            if (d){
                this.__file = f
                this._data = d
            }
        }

        if (!this._data){
            this._data = this.__file.read()
        }
    }

    get data(){return this._data}
    set data(d: LuaTable | undefined){
        this._data = d
    }

    write(){
        if (this._data){
            this.__file.write(this._data)
        }
    }
    
    readonly root: string
    readonly path: string

    protected _data: LuaTable | undefined

    private __file: JsonFileIface
}