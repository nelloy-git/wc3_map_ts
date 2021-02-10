import { getFilePath, Log, Json } from "../../Utils";
import { ReadonlyUnitExtParams, readUnitExtParams } from "./Params";

let __path__ = getFilePath()

function _readField<T>(field: string, json: Json.JsonData, type: 'string'|'number'|'object', json_path?: string){
    let val = json[field]
    if (typeof val !== type){
        return Log.err('can not get field \'' + field + '\' from ' + json_path,
                       __path__, undefined, 3)
    }
    return <T><unknown>val
}

export class JsonUnitExt {
    constructor(json_path: string){
        let json = Json.decode(json_path)

        this.name = _readField('name', json, 'number', json_path)
        this.model = _readField('model', json, 'number', json_path)
        this.size_new = _readField('size_new', json, 'number', json_path)
        this.size_old = _readField('size_old', json, 'number', json_path)
        this.params = readUnitExtParams(_readField('params', json, 'object', json_path), json_path)
    }

    readonly name: string
    readonly model: string
    readonly size_new: number
    readonly size_old: number
    readonly params: ReadonlyUnitExtParams
}