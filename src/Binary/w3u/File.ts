import { Log } from "../../Utils";
import { Field } from "../Field";
import { File } from "../File";
import { byte2int, getFirstId, int2byte, nextId } from "../Utils";

import { findTUnitField, TUnitFieldBool, TUnitFieldInt, TUnitFieldReal, TUnitFieldString, TUnitFieldUnreal } from "./Field";
import { TUnit } from "./TUnit";

export class w3uFile extends File<TUnit> {
    get version(){return this._version}

    add(origin_id: string){
        let u = TUnit.create(this._getNextId(), origin_id)
        this._data.push(u)
        return u
    }

    save(path: string){
        this._serialize()
        return super.save(path)
    }

    protected _parse(){
        let list: TUnit[] = []
        let unknown

        this._version = this._parseNext('int', 4)
        unknown = this._parseNext('int', 4) // Pass original table

        let count = this._parseNext('int', 4)
        for (let i = 0; i < count; i++){
            let origin_id = this._parseNext('char', 4)
            let id = this._parseNext('char', 4)
            let unit = TUnit.create(id, origin_id)

            let changes_count = this._parseNext('int', 4)
            for (let j = 0; j < changes_count; j++){
                let code = this._parseNext('char', 4)
                let field = findTUnitField(code)
                if (!field){
                    Log.wrn(w3uFile.name + ': unknown field \"' + code + '\"')
                }

                let type_bytes = this._parseNext('char', 4)
                if (field && Field.type2byte(field.type) != type_bytes){
                    Log.wrn(w3uFile.name + ': wrong field value type ' + code + '\n' +
                            byte2int(Field.type2byte(field.type)) + ' != ' + byte2int(type_bytes))
                }

                let val
                if (type_bytes == Field.type2byte('bool') || type_bytes == Field.type2byte('int')){
                    val = this._parseNext('int', 4)

                    if (field instanceof TUnitFieldBool){
                        TUnit.setField(unit, field, val == 1)
                    } else if (field instanceof TUnitFieldInt){
                        TUnit.setField(unit, field, val)
                    }
                } else if (type_bytes == Field.type2byte('real') || type_bytes == Field.type2byte('unreal')){
                    val = this._parseNext('float', 4)

                    if (field instanceof TUnitFieldReal || field instanceof TUnitFieldUnreal){
                        TUnit.setField(unit, field, val)
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

                    if (field instanceof TUnitFieldString){
                        TUnit.setField(unit, field, val)
                    }
                }

                unknown = this._parseNext('int', 4) // Pass end bytes
            }

            list.push(unit)
        }

        return list
    }

    private _serialize(){
        this._raw_data = '\2\0\0\0' + 
                         '\0\0\0\0' +
                         int2byte(this._data.length)
        this._data.forEach(cur => {
            this._raw_data += TUnit.serialize(cur)
        })
    }

    private _version: number = 0

    private _last_id = getFirstId('UNIT')
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