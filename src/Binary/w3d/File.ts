import * as Utils from '../../Utils'

import { ObjList } from "../File";
import { getFirstId, int2byte, nextId } from "../Utils";
import { TDoodad } from "./TDoodad";

export class w3dFile extends ObjList<TDoodad> {

    static fromBinary(file: Utils.FileBinary){
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

    toBinary(){
        let raw = ''

        raw += int2byte(this.version)
        raw += int2byte(0)
        raw += int2byte(this.objects.length)
        for (const tdood of this.objects){
            raw += tdood.toBinary()
        }

        return raw
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
    
    get version(){return this.__version}

    private __version: number = 1
    private __last_id = getFirstId('DECO')
}