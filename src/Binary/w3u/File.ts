import { id2int, Log } from "../../Utils";
import { File } from "../File";
import { byte2id, getFirstId, int2byte, nextId } from "../Utils";
import { UnitChange } from "./Change";
import { FieldUnitBool, FieldUnitInt, FieldUnitList, FieldUnitReal, FieldUnitString, FieldUnitUnreal } from "./Field";
import { tUnit } from "./Unit";

export class w3uFile extends File {

    get version(){return this._version}
    get data(): ReadonlyArray<tUnit>{
        return this._data
    }

    add(base_id: number){
        let u = new tUnit(base_id, this._getNextId(), [])
        this._data.push(u)
        return u
    }

    open(path: string){
        super.open(path)
        this._parse()
    }

    save(path: string){
        this._serialize()
        return super.save(path)
    }

    private _parse(){
        if (!this._raw_data){
            return Log.err(w3uFile.name + 
                           ': not raw data. Open file or add it manually.')
        }

        if (this._data.length > 0){
            return Log.err(w3uFile.name + 
                           ': parsed already.')
        }

        this._data = []
        this._file_pos = 0

        this._version = this._parseNext('int', 4)
        // Pass original table
        this._file_pos += 4

        let count = this._parseNext('int', 4)
        for (let i = 0; i < count; i++){
            let base = byte2id(this._parseNext('char', 4))
            let id = byte2id(this._parseNext('char', 4))
            let changes_count = this._parseNext('int', 4)
            let changes: UnitChange<any>[] = []
            for (let j = 0; j < changes_count; j++){
                let change_id = this._parseNext('char', 4)
                let val_type = this._parseNext('int', 4)
                // parse changed value
                // let val: number|string = ''

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
                    return Log.err(File.name + 
                                   ': can not find field \'' + change_id + '\' in the list.' )
                }
                let change = new UnitChange<any>(field, val)
                changes.push(change)

                // Pass change end bytes
                this._file_pos += 4
            }

            let unit = new tUnit(base, id, changes)
            this._data.push(unit)
        }
    }

    private _serialize(){
        this._raw_data = '\2\0\0\0' + 
                         '\0\0\0\0' +
                         int2byte(this._data.length)
        this._data.forEach(cur => {
            this._raw_data += cur.serialize()
        })
    }

    private _parseNext(type: 'char', size: number): string
    private _parseNext(type: 'int', size: number): number
    private _parseNext(type: 'float', size: number): number
    private _parseNext(type: 'char'|'int'|'float', size: number){
        if (type == 'char'){
            let val = this._parseData(type, this._file_pos, size)
            this._file_pos += size
            return val
        } else if (type == 'int'){
            let val = this._parseData(type, this._file_pos, size)
            this._file_pos += size
            return val
        } else if (type == 'float'){
            let val = this._parseData(type, this._file_pos, size)
            this._file_pos += size
            return val
        }
    }

    private _findField(id: string){
        let available_fields = Object.values(FieldUnitList)
        for (let i = 0; i < available_fields.length; i++){
            if (available_fields[i].id == id){
                return available_fields[i]
            }
        }

        return Log.err(w3uFile.name + 
                       ': can not find field \'' + id + '\'')
    }

    private _file_pos: number = 0
    
    private _version: number = 0
    private _data: tUnit[] = []

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