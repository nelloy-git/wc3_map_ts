import * as Utils from '../Utils'
import * as JsonLua from './JsonLua'
import { Data } from './Data'

export class Cached {
    constructor(path: string){
        let f = new Utils.FileText()
        if (!IsGame()){
            f.read(path)
            f.saveCache(path)
        } else {
            f.loadCache(path)
        }
        let s_data = <string>f.data

        this.data = new Data(path, JsonLua.decode(s_data))
    }

    readonly data: Data
}