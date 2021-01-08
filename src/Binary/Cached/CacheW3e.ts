import { Tile } from "../w3e/Tile";
import { Log } from "../../Utils";
import { w3eFile } from "../w3e/File";
import { BinaryCache } from "./Cache";

export class CacheW3e extends BinaryCache<Tile> {
    constructor(path: string){
        super(path)
        this.path = path

        if (!IsGame()){
            let f = new w3eFile()
            f.open(this.path)
            this._save(f.data)
        }
        this.data = this._load()
    }

    protected _elemToRaw(tile: Tile){
        return string.format('(%d,%d,%d,%d)', tile.id, tile.x, tile.y, tile.z)
    }

    protected _elemFromRaw(s_tile: string){
        if (s_tile.charAt(0) != '(' ||
            s_tile.charAt(s_tile.length - 1) != ')'){

            print('\'' + s_tile.charAt(0), s_tile.charAt(s_tile.length - 1) + '\'')
            return Log.err(CacheW3e.name + 
                           ': can not parse tile \'' + s_tile + '\'')
        }

        s_tile = s_tile.slice(1, s_tile.length - 1)
        let [s_id, s_x, s_y, s_z] = s_tile.split(',')
        let id = parseInt(s_id)
        let x = parseInt(s_x)
        let y = parseInt(s_y)
        let z = parseInt(s_z)

        return new Tile(id, x, y, z)
    }

    readonly path: string
    readonly data: ReadonlyArray<Tile>
}