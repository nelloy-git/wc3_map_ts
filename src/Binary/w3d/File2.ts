import { Log } from "../../Utils";
import { File } from "../File";
import { byte2id, float2byte, id2byte, int2byte, str2byte } from "../Utils";

type w3dChange = [id: string, val_type: number, variation: number, pointer: number, val: number|string]
type w3dData = [base: number, id: number, changes: w3dChange[]]

export class w3dFileOld extends File {

    get version(){return this._version}
    get data(): ReadonlyArray<w3dData>{
        return this._data
    }

    parse(){
        if (!this._raw_data){
            return Log.err(w3dFileOld.name + 
                           ': not raw data. Open file or add it manually.')
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
            let changes: w3dChange[] = []
            for (let j = 0; j < changes_count; j++){
                let change_id = this._parseNext('char', 4)
                let val_type = this._parseNext('int', 4)
                let variation = this._parseNext('int', 4)
                let data_pointer = this._parseNext('int', 4)
                // parse changed value
                let val: number|string = ''
                if (val_type == 0){
                    val = this._parseNext('int', 4)
                } else if (val_type == 1 || val_type == 2) {
                    val = this._parseNext('float', 4)
                } else {
                    // Strings are nullterminated
                    // TODO TRIGSTR
                    
                    let c: string
                    while (true){
                        c = this._parseNext('char', 1)
                        if (c == '\0'){break}
                        val += c
                    }
                }
                // Pass change end bytes
                this._file_pos += 4

                let cur: w3dChange = [change_id, val_type, variation, data_pointer, val]
                changes.push(cur)
            }

            let data: w3dData = [base, id, changes]
            this._data.push(data)
        }
    }

    serialize(){
        this._raw_data = '\2\0\0\0' + 
                         '\0\0\0\0'

        this._raw_data += this._serialize('int', this._data.length)
        this._data.forEach(cur => {
            this._raw_data += this._serialize('char', id2byte(cur[0]))
            this._raw_data += this._serialize('char', id2byte(cur[1]))
            this._raw_data += this._serialize('int', cur[2].length)
            cur[2].forEach(change => {
                this._raw_data += this._serialize('char', change[0])
                this._raw_data += this._serialize('int', change[1])
                this._raw_data += this._serialize('int', change[2])
                this._raw_data += this._serialize('int', change[3])
                if (change[1] == 0){
                    this._raw_data += this._serialize('int', <number>change[4])
                } else if (change[1] == 1 || change[1] == 2){
                    this._raw_data += this._serialize('float', <number>change[4])
                } else {
                    this._raw_data += this._serialize('char', <string>change[4])
                }
            })
            this._raw_data += '\0\0\0\0'
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

    private _serialize(type: 'char', val: string): string
    private _serialize(type: 'float', val: number): string
    private _serialize(type: 'int', val: number): string
    private _serialize(type: 'char'|'int'|'float', val: number|string): string{
        if (type == 'char'){
            return str2byte(<string>val)
        } else if (type == 'float'){
            return float2byte(<number>val)
        } else if (type == 'int'){
            return int2byte(<number>val)
        } else {
            return Log.err(w3dFileOld.name + 
                           ': unknown type')
        }
    }

    private _file_pos: number = 0
    
    private _version: number = 0
    private _data: w3dData[] = []
}