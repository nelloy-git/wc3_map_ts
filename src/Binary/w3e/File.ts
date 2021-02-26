import { File } from "../File";
import { Tile } from "./Tile";

let __head: string
let __version: number
let __main_tile: string
let __is_custom: number
let __used_tiles: string[]
let __used_cliffs: string[]

let __mx: number
let __my: number
let __cx: number
let __cy: number

export class w3eFile extends File<Tile> {

    constructor(path: string){
        super(path)

        this._head = __head
        this._version = __version
        this._main_tile = __main_tile
        this._is_custom = __is_custom
        this._used_tiles = __used_tiles
        this._used_cliffs = __used_cliffs
    
        this._mx = __mx
        this._my = __my
        this._cx = __cx
        this._cy = __cy
    }

    get head(){return this._head}
    get version(){return this._version}
    get mainTile(){return this._main_tile}
    get isCustom(){return this._is_custom}
    get usedTiles(){return <ReadonlyArray<string>>this._used_tiles}
    get usedCliffs(){return <ReadonlyArray<string>>this._used_cliffs}
    get cx(){return this._cx}
    get cy(){return this._cy}

    protected _parse(){
        let list: Tile[] = []

        __head = this._readChar(4)
        __version = this._readInt(4)
        __main_tile = this._readChar(1)
        __is_custom = this._readInt(4)

        __used_tiles = []
        let tiles_count = this._readInt(4)
        for (let i = 0; i < tiles_count; i++){
            __used_tiles[i] = this._readChar(4)
        }

        __used_cliffs = []
        let cliffs_count = this._readInt(4)
        for (let i = 0; i < cliffs_count; i++){
            __used_cliffs[i] = this._readChar(4)
        }

        __mx = 128 * this._readInt(4)
        __my = 128 * this._readInt(4)
        __cx = this._readFloat() + __mx / 2
        __cy = this._readFloat() + __my / 2

        for (let y = 0; y < __my; y += 128){
            for (let x = 0; x < __mx; x += 128){
                let h = this._readInt(2)
                this._readChar(2) // Pass 2 bytes
                let tile_id = __used_tiles[this._readChar(1).charCodeAt(0) & 15]
                this._readChar(1) // Pass 1 bytes
                let layer = this._readChar(1).charCodeAt(0) & 0x0F

                let z = (h - 8192 + (layer - 2) * 256) / 4
                let tile = Tile.create(tile_id, x, y, z)
                list.push(tile)
            }
        }

        return list
    }

    private _head: string = ''
    private _version: number = 0
    private _main_tile: string = ''
    private _is_custom: number = 1
    private _used_tiles: string[] = []
    private _used_cliffs: string[] = []

    private _mx: number = 0
    private _my: number = 0
    private _cx: number = 0
    private _cy: number = 0
}