import * as Utils from '../../Utils'
import * as Json from '../../Json'

let __path__ = Macro(Utils.getFilePath())

export class BuffJson extends Json.FileCached {
    constructor(path: string){
        super(path)
        
        let data = this._file.data
        if (!data){
            Utils.Log.err(path + ' is empty', __path__, BuffJson)
        }

        let raw = Json.decode(<string>data)

        this.name = Json.Read.String(raw, 'name', 'undefined', path)
        this.icon = Json.Read.String(raw, 'icon', 'undefined', path)
        this.tooltip = Json.Read.String(raw, 'tooltip', 'undefined', path)
    }

    readonly name: string
    readonly icon: string
    readonly tooltip: string
}