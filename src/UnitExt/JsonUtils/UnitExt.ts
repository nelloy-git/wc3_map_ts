import { getFilePath, Log, Json } from "../../Utils";
import { ReadonlyUnitExtParams } from "./Params";

let __path__ = getFilePath()

function _readField<T>(field: string, json: Json.JsonData, type: 'string'|'number'|'object'){
    let val = json[field]
    if (typeof val !== type){
        return Log.err('can not get field \'' + field + '\' from ' + this._path,
                       __path__, undefined, 3)
    }
    return <T><unknown>val
}

export class JsonUnitExt {
    constructor(json_path: string){
        let json = Json.decode(json_path)

        this.name = _readField('name', json, 'number')
        this.model = _readField('model', json, 'number')
        this.name = _readField('name', json, 'number')
        this.name = _readField('name', json, 'number')
    }

    readonly name: string
    readonly model: string
    readonly size_new: number
    readonly size_old: number
    readonly params: ReadonlyUnitExtParams
}