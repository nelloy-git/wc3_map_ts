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
        let unknown

        this._version = this._parseNext('int', 4)
        unknown = this._parseNext('int', 4) // Pass original table

        let count = this._parseNext('int', 4)
        for (let i = 0; i < count; i++){
            let origin_id = this._parseNext('char', 4)
            let id = this._parseNext('char', 4)
            let doodad = TDoodad.create(id, origin_id)

            let changes_count = this._parseNext('int', 4)
            for (let j = 0; j < changes_count; j++){
                let code = this._parseNext('char', 4)
                let field = findTDoodadField(code)
                if (!field){
                    Log.wrn(w3dFile.name + ': unknown field \"' + code + '\"')
                }

                let type_bytes = this._parseNext('char', 4)
                if (field && Field.type2byte(field.type) != type_bytes){
                    Log.wrn(w3dFile.name + ': wrong field value type ' + code + '\n' +
                            byte2int(Field.type2byte(field.type)) + ' != ' + byte2int(type_bytes))
                }

                let variation = this._parseNext('int', 4) // Ignored
                let data_pointer = this._parseNext('int', 4) // Ignored

                let val
                if (type_bytes == Field.type2byte('bool') || type_bytes == Field.type2byte('int')){
                    val = this._parseNext('int', 4)

                    if (field instanceof TDoodadFieldBool){
                        TDoodad.setField(doodad, field, val == 1)
                    } else if (field instanceof TDoodadFieldInt){
                        TDoodad.setField(doodad, field, val)
                    }
                } else if (type_bytes == Field.type2byte('real') || type_bytes == Field.type2byte('unreal')){
                    val = this._parseNext('float', 4)

                    if (field instanceof TDoodadFieldReal || field instanceof TDoodadFieldUnreal){
                        TDoodad.setField(doodad, field, val)
                    }
                } else { // string
                    // Strings are nullterminated
                    // TODO TRIGSTR
                    val = ''
                    let c: string
                    while (true){
                        c = this._parseNext('char', 1)
                        if (c == '\0'){break}
                        val += c
                    }

                    if (field instanceof TDoodadFieldString){
                        TDoodad.setField(doodad, field, val)
                    }
                }

                unknown = this._parseNext('int', 4) // Pass end bytes
            }

            list.push(doodad)
        }

        return list
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