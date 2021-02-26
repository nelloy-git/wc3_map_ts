import * as Json from '../../Json'

import { File } from "../File";
import { int2byte } from "../Utils";
import { Doodad } from "./Doodad";

export class File_doo extends File<Doodad> {

    writeBinary(path: string){
        let f = this._file_bin
        let raw = ''

        raw += this.__head.slice(0, 4)
        raw += int2byte(this.__version).slice(0, 4)
        raw += int2byte(this.__subversion).slice(0, 4)
        raw += int2byte(this.objects.length).slice(0, 4)

        for (const dood of this.objects){
            raw += dood.toBinary()
        }

        f.write(path)
    }

    readBinary(path: string){
        let f = this._file_bin
        f.read(path)
        f.startReading()

        this.__head = f.readChar(4)
        this.__version = f.readInt(4)
        this.__subversion = f.readInt(4)
        this.objects = []

        let count = f.readInt(4)
        for (let i = 0; i < count; i++){
            let dood = new Doodad()
            dood.fromBinary(f)
            this.objects.push(dood)
        }

        f.finishReading()
    }

    writeJson(path: string){
        let f = this._file_text
        let json: LuaHash = {}

        json['head'] = this.__head
        json['version'] = this.__version
        json['subversion'] = this.__subversion
        
        let list: LuaTable[] = []
        for (const dood of this.objects){
            list.push(dood.toJson())
        }
        json['objects'] = []

        f.write(Json.encode(json))
    }

    readJson(path: string){
        let f = this._file_text
        f.read(path)
        if (!f.data){ return }

        let json = Json.decode(f.data)
        this.__head = Json.Read.String(json, 'head')
        this.__version = Json.Read.Number(json, 'version')
        this.__subversion = Json.Read.Number(json, 'subversion')
        this.objects = []

        let list = Json.Read.TableArray(json, 'objects')
        for (const json_dood of list){
            let dood = new Doodad()
            dood.fromJson(json_dood)
            this.objects.push(dood)
        }
    }
    
    private __head: string = ''
    private __version: number = 0
    private __subversion: number = 0
}