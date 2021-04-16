import * as Utils from '../../Utils'

import { ObjList } from "../File";
import { getFirstId, int2byte, nextId } from "../Utils";
import { TUnit } from "./TUnit";

export class w3uFile extends ObjList<TUnit> {

    static fromBinary(file: Utils.FileBinary){
        file.startReading()

        let w3u = new w3uFile()
        w3u.__version = file.readInt(4)
        w3u.objects = []
        
        let origin_count = file.readInt(4)
        for (let i = 0; i < origin_count; i++){
            w3u.objects.push(TUnit.fromBinary(file))
        }

        let new_count = file.readInt(4)
        for (let i = 0; i < new_count; i++){
            w3u.objects.push(TUnit.fromBinary(file))
        }

        file.finishReading()
        return w3u
    }

    toBinary(){
        let raw = ''

        raw += int2byte(this.version)
        raw += int2byte(0)
        raw += int2byte(this.objects.length)
        for (const tunit of this.objects){
            raw += tunit.toBinary()
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
    private __last_id = getFirstId('UNIT')
}