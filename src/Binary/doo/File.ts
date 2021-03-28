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
    
    head: string = ''
    version: number = 0
    subversion: number = 0
}