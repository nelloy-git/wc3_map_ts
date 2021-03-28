import * as Utils from '../../Utils'
import * as Json from '../../Json'

let __path__ = Macro(Utils.getFilePath())

const NAME = ['name']
const ICON = ['icon']
const TOOLTIP = ['tooltip']

export class BuffJson extends Json.Cached {
    constructor(path: string, extra?: Json.Tree[]){
        super(path)
        
        let data = this.data
        this.name = data.getString(NAME, 'undefined')
        this.icon = data.getString(ICON, 'undefined')
        this.tooltip = data.getString(TOOLTIP, 'undefined')
    }

    readonly name: string
    readonly icon: string
    readonly tooltip: string
}