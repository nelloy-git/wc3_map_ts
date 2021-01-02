import { id2int, int2id, Log } from "../../Utils";
import { File } from "../File";
import { byte2id } from "../Utils";
import { Tile } from "./Tile";

export class w3eFile extends File {

    get head(){return this._head}
    get version(){return this._version}
    get mainTile(){return this._main_tile}
    get isCustom(){return this._is_custom}
    get usedTiles(){
        let copy: number[] = []
        this._used_tiles.forEach(tile => {
            copy.push(tile)
        });
        return copy
    }
    get usedCliffs(){
        let copy: number[] = []
        this._used_cliffs.forEach(tile => {
            copy.push(tile)
        });
        return copy
    }
    get data(): ReadonlyArray<Tile>{
        return this._data
    }

    open(path: string){
        super.open(path)
        this._parse()
    }

    private _parse(){
        if (!this._raw_data){
            return Log.err(w3eFile.name + 
                           ': not raw data. Open file or add it manually.')
        }

        this._file_pos = 0

        this._head = this._parseNext('char', 4)
        this._version = this._parseNext('int', 4)
        this._main_tile = this._parseNext('char', 1)
        this._is_custom = this._parseNext('int', 4)

        this._used_tiles = []
        let tiles_count = this._parseNext('int', 4)
        for (let i = 0; i < tiles_count; i++){
            let tile = this._parseNext('char', 4)
            this._used_tiles[i] = id2int(tile)
        }

        this._used_cliffs = []
        let cliffs_count = this._parseNext('int', 4)
        for (let i = 0; i < cliffs_count; i++){
            let cliff = this._parseNext('char', 4)
            this._used_cliffs[i] = id2int(cliff)
        }

        this._mx = this._parseNext('int', 4)
        this._my = this._parseNext('int', 4)
        this._cx = this._parseNext('float', 4)
        this._cy = this._parseNext('float', 4)

        let count = this._mx * this._my
        let cur_x = 0
        let cur_y = 0

        for (let i = 0; i < count; i ++){
            let x = this._cx + 128 * cur_x;
            let y = this._cy + 128 * cur_y;
            let h = this._parseNext('int', 2)
            // Pass 2 bytes
            this._file_pos += 2
            let tile_id = this._used_tiles[this._parseNext('char', 1).charCodeAt(0) & 15]
            // if (int2id(tile_id) != 'Ldrt'){
            //     print(int2id(tile_id))
            // }
            // Pass 2 bytes
            this._file_pos += 2

            let tile = new Tile(x, y, h, tile_id)
            this._data.push(tile)
            
            cur_x += 1
            if (cur_x >= this._mx){
                cur_y += 1
                cur_x = 0
            }
        }
    }

    private _parseNext(type: 'char', size: number): string
    private _parseNext(type: 'int', size: number): number
    private _parseNext(type: 'float', size: number): number
    private _parseNext(type: 'char'|'int'|'float', size: number){
        if (type == 'char'){
            let val = this._parseData(type, this._file_pos, size)
            this._file_pos += size
            return val
        } else if (type == 'int'){
            let val = this._parseData(type, this._file_pos, size)
            this._file_pos += size
            return val
        } else if (type == 'float'){
            let val = this._parseData(type, this._file_pos, size)
            this._file_pos += size
            return val
        }
    }

    private _file_pos: number = 0

    private _head: string = ''
    private _version: number = 0
    private _main_tile: string = ''
    private _is_custom: number = 0
    private _used_tiles: number[] = []
    private _used_cliffs: number[] = []

    private _data: Tile[] = []

    private _mx: number = 0
    private _my: number = 0
    private _cx: number = 0
    private _cy: number = 0
}