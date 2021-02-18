import { JsonFileCached } from './FileCached'
import { JsonFileGame } from './FileGame'
import { JsonFileIface } from './FileIface'

export class JsonFile {
    constructor(path: string, root: string = ''){
        this.root = root
        this.path = path

        this.__file = new JsonFileCached(path)
        this._data = this.__file.read()

        if (IsGame()){
            this.__file = new JsonFileGame(path)
            let data = this.__file.read()

            if (data){
                this._data = data
            }
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