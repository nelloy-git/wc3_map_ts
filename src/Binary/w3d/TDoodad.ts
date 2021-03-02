import * as Json from '../../Json'

import { FileBinary } from "../../Utils"
import { Obj } from "../Obj"
import { TDoodadFieldChange } from './Field'

export class TDoodad extends Obj {

    static fromBinary(file: FileBinary){
        let tdood = new TDoodad()
        tdood.origin_id = file.readChar(4)
        tdood.id = file.readChar(4)
        if ((tdood.id.charCodeAt(0) + tdood.id.charCodeAt(1) + 
            tdood.id.charCodeAt(2) + tdood.id.charCodeAt(3)) == 0){
            tdood.id = tdood.origin_id
        }

        let changes_count = file.readInt(4)
        for (let i = 0; i < changes_count; i++){
            tdood.changes.push(TDoodadFieldChange.fromBinary(file))
        }

        return tdood
    }

    static fromJson(json: LuaTable){
        let tdood = new TDoodad()
        tdood.id = Json.Read.String(json, 'id')
        tdood.origin_id = Json.Read.String(json, 'origin_id')

        let changes = Json.Read.TableArray(json, 'changes')
        for (const json_change of changes){
            tdood.changes.push(TDoodadFieldChange.fromJson(json_change))
        }

        return tdood
    }

    toBinary(){
        let raw = ''
        raw += this.origin_id
        raw += this.id
        raw += this.changes.length

        for (const change of this.changes){
            raw += change.toBinary()
        }

        return raw
    }

    toJson(){
        let changes = []
        for (const change of this.changes){
            changes.push(change.toJson())
        }

        return {
            id: this.id,
            origin_id: this.origin_id,
            changes: changes
        }
    }

    get id(){ return this.__id }
    set id(id: string){
        this.__id = id.slice(0, 4)
    }

    get origin_id(){ return this.__origin_id }
    set origin_id(origin_id: string){
        this.__origin_id = origin_id.slice(0, 4)
    }
    
    public changes: TDoodadFieldChange<any>[] = []

    private __id: string = ''
    private __origin_id: string = ''
}