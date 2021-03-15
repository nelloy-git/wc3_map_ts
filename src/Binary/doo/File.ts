import * as Json from '../../Json'

import { FileBinary } from '../../Utils';
import { File } from "../File";
import { int2byte } from "../Utils";
import { Doodad } from "./Doodad";

export class dooFile extends File<Doodad> {

    static fromBinary(file: FileBinary){
        file.startReading()

        let doo = new dooFile()
        doo.head = file.readChar(4)
        doo.version = file.readInt(4)
        doo.subversion = file.readInt(4)
        doo.objects = []

        let count = file.readInt(4)
        for (let i = 0; i < count; i++){
            doo.objects.push(Doodad.fromBinary(file))
        }

        file.finishReading()
        return doo
    }

    static fromJson(json: LuaTable, path: string){
        let doo = new dooFile()
        doo.head = Json.Read.String(json, 'head', 'undefined', path)
        doo.version = Json.Read.Number(json, 'ver', 0, path)
        doo.subversion = Json.Read.Number(json, 'subv', 0, path)
        doo.objects = []

        let list = Json.Read.TableArray(json, 'objects', [], path)
        for (let i = 0; i < list.length; i++){
            const cur_dood = list[i]
            doo.objects.push(Doodad.fromJson(cur_dood, path + '::[' + i + ']'))
        }
        return doo
    }

    toBinary(){
        let raw = ''
        raw += this.head.slice(0, 4)
        raw += int2byte(this.version).slice(0, 4)
        raw += int2byte(this.subversion).slice(0, 4)
        raw += int2byte(this.objects.length).slice(0, 4)

        for (const dood of this.objects){
            raw += dood.toBinary()
        }

        return raw
    }

    toJson(){
        let list: LuaTable[] = []
        for (const dood of this.objects){
            list.push(dood.toJson())
        }

        return {
            head: this.head,
            ver: this.version,
            subv: this.subversion,
            objects: list
        }
    }
    
    head: string = ''
    version: number = 0
    subversion: number = 0
}