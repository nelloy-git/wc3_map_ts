import { id2int, int2id, Log } from "../../Utils";
import { File } from "../File";
import { byte2id } from "../Utils";
import { Tile } from "./Tile";

export class w3eFile extends File<Tile> {

    get head(){return this._head}
    get version(){return this._version}
    get mainTile(){return this._main_tile}
    get isCustom(){return this._is_custom}
    get usedTiles(){return <ReadonlyArray<string>>this._used_tiles}
    get usedCliffs(){return <ReadonlyArray<string>>this._used_cliffs}

    protected _parse(){
        this._head = this._parseNext('char', 4)
        this._version = this._parseNext('int', 4)
        this._main_tile = this._parseNext('char', 1)
        this._is_custom = this._parseNext('int', 4)

        this._used_tiles = []
        let tiles_count = this._parseNext('int', 4)
        for (let i = 0; i < tiles_count; i++){
            this._used_tiles[i] = this._parseNext('char', 4)
        }

        this._used_cliffs = []
        let cliffs_count = this._parseNext('int', 4)
        for (let i = 0; i < cliffs_count; i++){
            this._used_cliffs[i] = this._parseNext('char', 4)
        }

        this._mx = this._parseNext('int', 4)
        this._my = this._parseNext('int', 4)
        this._cx = this._parseNext('float', 4)
        this._cy = this._parseNext('float', 4)

        let count = this._mx * this._my
        let cur_x = 0
        let cur_y = 0

        let list: Tile[] = []
        for (let i = 0; i < count; i ++){
            let x = this._cx + 128 * cur_x;
            let y = this._cy + 128 * cur_y;
            let h = this._parseNext('int', 2)
            // Pass 2 bytes
            let unknown = this._parseNext('char', 2)
            let tile_id = this._used_tiles[this._parseNext('char', 1).charCodeAt(0) & 15]
            // Pass 2 bytes
            unknown = this._parseNext('char', 2)

            let tile = Tile.create(tile_id, x, y, h)
            list.push(tile)
            
            cur_x += 1
            if (cur_x >= this._mx){
                cur_y += 1
                cur_x = 0
            }
        }

        return list
    }

    private _head: string = ''
    private _version: number = 0
    private _main_tile: string = ''
    private _is_custom: number = 0
    private _used_tiles: string[] = []
    private _used_cliffs: string[] = []

    private _mx: number = 0
    private _my: number = 0
    private _cx: number = 0
    private _cy: number = 0
}