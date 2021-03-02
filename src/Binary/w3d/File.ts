import * as Json from '../../Json'

import { FileBinary } from "../../Utils";
import { File } from "../File";
import { getFirstId, int2byte, nextId } from "../Utils";

import { TDoodad } from "./TDoodad";

export class w3dFile extends File<TDoodad> {
    get version(){return this.__version}

    static fromBinary(file: FileBinary){
        file.startReading()

        let w3d = new w3dFile()
        w3d.__version = file.readInt(4)
        w3d.objects = []
        
        let origin_count = file.readInt(4)
        for (let i = 0; i < origin_count; i++){
            w3d.objects.push(TDoodad.fromBinary(file))
        }

        let new_count = file.readInt(4)
        for (let i = 0; i < new_count; i++){
            w3d.objects.push(TDoodad.fromBinary(file))
        }

        file.finishReading()
        return w3d
    }

    static fromJson(json: LuaTable){
        let w3d = new w3dFile()
        w3d.__version = Json.Read.Number(json, 'ver')

        let list = Json.Read.TableArray(json, 'objects')
        for (const json_obj of list){
            w3d.objects.push(TDoodad.fromJson(json_obj))
        }

        return w3d
    }

    toBinary(){
        let raw = ''

        raw += int2byte(this.version)
        for (const tdood of this.objects){
            raw += tdood.toBinary()
        }

        return raw
    }

    toJson(){
        let list = []
        for (const tdood of this.objects){
            list.push(tdood.toJson())
        }

        return {
            ver: this.__version,
            objects: list,
        }
    }

    getFreeId(){
        // Is id in use?
        let found = true
        while (found){
            found = false
            this.__last_id = nextId(this.__last_id)

            for (const tdood of this.objects){
                if (tdood.id == this.__last_id){
                    found = true
                    break
                }
            }
        }
        return this.__last_id
    }

    private __version: number = 0
    private __last_id = getFirstId('DECO')
}