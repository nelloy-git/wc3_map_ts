import { JsonFileCached } from './FileCached'
import { JsonFileGame } from './FileGame'
import { JsonFileIface } from './FileIface'

export class JsonFile {
    constructor(root: string, path: string, use_custom: boolean = false){
        this.__root = root
        this.__path = path

        this.__file = new JsonFileCached(root + '/' + path)
        if (IsGame() && use_custom){
            let f = new JsonFileGame(path)
            if (f.read()){
                this.__file = f
            }
        }

        this._data = this.__file.read()
    }

    set(data?: LuaTable){
        this._data = data
    }

    write(){
        if (this._data){
            this.__file.write(this._data)
        }
    }
    
    protected _data: LuaTable | undefined

    private __root: string
    private __path: string
    private __file: JsonFileIface
}