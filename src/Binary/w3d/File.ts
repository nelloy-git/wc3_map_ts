import { Log } from "../../Utils";
import { Field } from "../Field";
import { File } from "../File";
import { byte2int, getFirstId, int2byte, nextId } from "../Utils";

import { findTDoodadField, TDoodadFieldBool, TDoodadFieldInt, TDoodadFieldReal, TDoodadFieldString, TDoodadFieldUnreal } from "./Field";
import { TDoodad } from "./TDoodad";

export class w3dFile extends File<TDoodad> {
    get version(){return this._version}

    add(origin_id: string){
        let doodad = TDoodad.create(this._getNextId(), origin_id)
        this._data.push(doodad)
        return doodad
    }

    save(path: string){
        this._serialize()
        return super.save(path)
    }

    protected _parse(){
        let list: TDoodad[] = []
        this._version = this._readInt(4)

        let origin_count = this._readInt(4)
        for (let i = 0; i < origin_count; i++){
            let doodad = this._parseDoodad()
            list.push(doodad)
        }

        let count = this._readInt(4)
        for (let i = 0; i < count; i++){
            let doodad = this._parseDoodad()
            list.push(doodad)
        }

        return list
    }

    private _parseDoodad(){
        let origin_id = this._readChar(4)
        let id = this._readChar(4)
        let no_id = id.charCodeAt(0) == 0 &&
                    id.charCodeAt(1) == 0 &&
                    id.charCodeAt(2) == 0 &&
                    id.charCodeAt(3) == 0
        if (no_id){
            id = origin_id
        }
        let doodad = TDoodad.create(id, origin_id)

        let changes_count = this._readInt(4)
        for (let j = 0; j < changes_count; j++){
            let change = this._parseChange()
            if (change){
                let [field, val] = change
                TDoodad.setField(doodad, field, val)
            }
        }

        return doodad
    }

    private _parseChange(){
        let code = this._readChar(4)
        let field = findTDoodadField(code)
        if (!field){
            Log.wrn(w3dFile.name + ': unknown field \"' + code + '\" - ' + this._file_pos)
        }

        let type_bytes = this._readChar(4)
        if (field && Field.type2byte(field.type) != type_bytes){
            Log.wrn(w3dFile.name + ': wrong field value type ' + code + '\n' +
                    byte2int(Field.type2byte(field.type)) + ' != ' + byte2int(type_bytes))
        }

        let variation = this._readInt(4) // Ignored
        let data_pointer = this._readInt(4) // Ignored

        let val
        if (field && field.type == 'bool' && type_bytes == Field.type2byte('bool')){
            val = this._readBool(4)
        } else if(type_bytes == Field.type2byte('int')){
            val = this._readInt(4)
        } else if (type_bytes == Field.type2byte('real') || type_bytes == Field.type2byte('unreal')){
            val = this._readFloat()
        } else {
            val = this._readString()
        }

        this._readChar(4) // Pass end bytes

        if (field){
            return <[TDoodadFieldBool, boolean] |
                    [TDoodadFieldInt | TDoodadFieldReal | TDoodadFieldUnreal, number] |
                    [TDoodadFieldString, string]> [field, val]
        }
    }

    private _serialize(){
        this._raw_data = '\2\0\0\0' + 
                         '\0\0\0\0' +
                         int2byte(this._data.length)
        this._data.forEach(cur => {
            this._raw_data += TDoodad.serialize(cur)
        })
    }
    
    private _version: number = 0

    private _last_id = getFirstId('DECO')
    private _getNextId(){
        // Is id in use?
        let found = true
        while (found){
            found = false
            this._last_id = nextId(this._last_id)

            for (let i = 0; i < this._data.length; i++){
                let unit = this._data[i]
                if (unit.id == this._last_id){
                    found = true
                    break
                }
            }
        }
        return this._last_id
    }
}

import { DoodadsSLK } from './DoodadsSLK'
let t = DoodadsSLK.getModel('LSeb', true)
print(t)