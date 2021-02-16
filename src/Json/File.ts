import { JsonFileCached } from './FileCached'
import { JsonFileGame } from './FileGame'
import { JsonFileIface } from './FileIface'

export class JsonFile {
    constructor(root: string, path: string, use_custom?: boolean){
        this.__root = root
        this.__path = path
        use_custom = use_custom ? true : false

        this.__file = new JsonFileCached(root + '/' + path)
        if (IsGame() && use_custom){
            let f = new JsonFileGame(path)
            if (f.read()){
                this.__file = f
            }
        }

        let data = this.__file.read()
        this._data = data ? data : {}
    }

    save(){
        this.__file.write(this._data)
    }
    
    protected _data: LuaTable

    private __root: string
    private __path: string
    private __file: JsonFileIface
}