import * as Json from '../../Json'

import { FileBinary } from "../../Utils";
import { File } from "../File";
import { float2byte, int2byte } from '../Utils';
import { Tile } from "./Tile";

export class w3eFile extends File<Tile> {

    static fromBinary(file: FileBinary){
        file.startReading()
        let w3e = new w3eFile()

        w3e.head = file.readChar(4)
        w3e.version = file.readInt(4)
        w3e.main_tile = file.readChar(1)
        w3e.is_custom = file.readInt(4)

        w3e.used_tiles = []
        let tiles_count = file.readInt(4)
        for (let i = 0; i < tiles_count; i++){
            w3e.used_tiles.push(file.readChar(4))
        }

        w3e.used_cliffs = []
        let cliffs_count = file.readInt(4)
        for (let i = 0; i < cliffs_count; i++){
            w3e.used_cliffs.push(file.readChar(4))
        }

        w3e.mx = file.readInt(4)
        w3e.my = file.readInt(4)
        w3e.cx = file.readFloat()
        w3e.cy = file.readFloat()

        w3e.objects = []
        for (let y = 0; y < w3e.my; y += 1){
            for (let x = 0; x < w3e.mx; x += 1){
                w3e.objects.push(Tile.fromBinary(file))
            }
        }

        file.finishReading()
        return w3e
    }

    toBinary(){
        let raw = ''

        raw += this.head.slice(0, 4)
        raw += int2byte(this.version, 4)
        raw += this.main_tile.slice(0, 1)
        raw += int2byte(1, 4)
        raw == int2byte(this.used_tiles.length, 4)
        for (let i = 0; i < this.used_tiles.length; i++){
            raw += this.used_tiles[i].slice(0, 4)
        }
        raw == int2byte(this.used_cliffs.length, 4)
        for (let i = 0; i < this.used_cliffs.length; i++){
            raw += this.used_cliffs[i].slice(0, 4)
        }
        raw += int2byte(this.mx, 4)
        raw += int2byte(this.my, 4)
        raw += float2byte(this.cx)
        raw += float2byte(this.cy)

        raw += int2byte(this.objects.length, 4)
        for (let i = 0; i < this.objects.length; i++){
            raw += this.objects[i].toBinary()
        }

        return raw
    }

    get(x: number, y: number): Tile | undefined {
        return this.objects[y * this.my + x]
    }

    getIdPos(x: number, y: number){
        let tile = this.get(x, y)
        return tile ? tile.id_pos : undefined
    }

    head: string = 'W3E!'
    version: number = 11
    main_tile: string = 'A'
    is_custom: number = 1
    used_tiles: string[] = []
    used_cliffs: string[] = []

    mx: number = 0
    my: number = 0
    cx: number = 0
    cy: number = 0
}