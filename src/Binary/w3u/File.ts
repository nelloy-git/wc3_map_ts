import { getFilePath, id2int, Log } from "../../Utils";
import { File } from "../File";
import { byte2id, getFirstId, int2byte, nextId } from "../Utils";
import { UnitChange } from "./Change";
import { FieldUnitBool, FieldUnitInt, FieldUnitList, FieldUnitReal, FieldUnitString, FieldUnitUnreal } from "./Field";
import { tUnit } from "./Unit";

let __path__ = Macro(getFilePath())

export class w3uFile extends File<tUnit> {

    get version(){return this._version}

    add(base_id: number){
        let u = new tUnit(base_id, this._getNextId(), [])
        this._data.push(u)
        return u
    }

    save(path: string){
        this._serialize()
        return super.save(path)
    }

    protected _parse(){
        let list: tUnit[] = []
        let unknown

        this._version = this._parseNext('int', 4)
        unknown = this._parseNext('int', 4) // Pass original table

        let count = this._parseNext('int', 4)
        for (let i = 0; i < count; i++){
            let base = byte2id(this._parseNext('char', 4))
            let id = byte2id(this._parseNext('char', 4))
            let changes_count = this._parseNext('int', 4)
            let changes: UnitChange<any>[] = []

            for (let j = 0; j < changes_count; j++){
                let change_id = this._parseNext('char', 4)
                let val_type = this._parseNext('int', 4)

                // Parse changed value
                let val
                let field = this._findField(change_id)
                if (field instanceof FieldUnitBool){
                    val = this._parseNext('int', 4)
                } else if (field instanceof FieldUnitInt){
                    val = this._parseNext('int', 4)
                } else if (field instanceof FieldUnitReal){
                    val = this._parseNext('float', 4)
                } else if (field instanceof FieldUnitUnreal){
                    val = this._parseNext('float', 4)
                } else if (field instanceof FieldUnitString){
                    // Strings are nullterminated
                    // TODO TRIGSTR
                    val = ''
                    let c: string
                    while (true){
                        c = this._parseNext('char', 1)
                        if (c == '\0'){break}
                        val += c
                    }
                } else {
                    return Log.err('can not find field \'' + change_id + '\' in the list.',
                                    __path__, File, 3)
                }
                let change = new UnitChange<any>(field, val)
                changes.push(change)

                unknown = this._parseNext('int', 4) // Pass end bytes
            }

            let unit = new tUnit(base, id, changes)
            list.push(unit)
        }

        return list
    }

    private _serialize(){
        this._raw_data = '\2\0\0\0' + 
                         '\0\0\0\0' +
                         int2byte(this._data.length)
        this._data.forEach(cur => {
            this._raw_data += cur.serialize()
        })
    }

    private _findField(id: string){
        let available_fields = Object.values(FieldUnitList)
        for (let i = 0; i < available_fields.length; i++){
            if (available_fields[i].id == id){
                return available_fields[i]
            }
        }

        return Log.err('can not find field \'' + id + '\' in the list.',
                        __path__, File, 3)
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
                if (unit.id == id2int(this._last_id)){
                    found = true
                    break
                }
            }
        }
        return id2int(this._last_id)
    }
}