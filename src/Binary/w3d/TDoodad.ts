import * as Json from '../../Json'

import { FileBinary } from "../../Utils"
import { Obj } from "../Obj"
import { float2byte, int2byte } from "../Utils"

export class TDoodad extends Obj {

    toBinary(){
    }

    fromBinary(file: FileBinary){
    }

    toJson(){
    }

    fromJson(json: LuaTable){
    }

    get id(){ return this.__id }
    set id(id: string){
        this.__id = id.slice(0, 4)
    }

    get origin_id(){ return this.__origin_id }
    set origin_id(origin_id: string){
        this.__origin_id = origin_id.slice(0, 4)
    }

    private __id: string = ''
    private __origin_id: string = ''
    private __fields = new Map<
}