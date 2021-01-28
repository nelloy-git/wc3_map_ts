import { Doodad } from "../doo/Doodad";
import { id2int, int2id, Log } from "../../Utils";
import { dooFile } from "../doo/File";
import { BinaryCache } from "./Cache";

export class CacheDoo extends BinaryCache<Doodad> {
    constructor(path: string){
        super(path)
        this.path = path

        if (!IsGame()){
            let f = new dooFile()
            f.open(this.path)
            this._save(f.data)
        }
        this.data = this._load()
    }

    protected _elemToRaw(dood: Doodad){
        return string.format('(%s,%d,%d,%d,%f,%f,%f,%f)',
                             int2id(dood.id), math.floor(dood.x), math.floor(dood.y), math.floor(dood.z), dood.a,
                             dood.scale_x, dood.scale_y, dood.scale_z)
    }

    protected _elemFromRaw(s_tile: string){
        if (s_tile.charAt(0) != '(' ||
            s_tile.charAt(s_tile.length - 1) != ')'){

            print('\'' + s_tile.charAt(0), s_tile.charAt(s_tile.length - 1) + '\'')
            return Log.err(CacheDoo.name + 
                           ': can not parse tile \'' + s_tile + '\'')
        }

        s_tile = s_tile.slice(1, s_tile.length - 1)
        let [s_id, s_x, s_y, s_z, s_a, s_sx, s_sy, s_sz] = s_tile.split(',')
        let id = id2int(s_id)
        let x = parseInt(s_x)
        let y = parseInt(s_y)
        let z = parseInt(s_z)
        let a = parseFloat(s_a)
        let sx = parseFloat(s_sx)
        let sy = parseFloat(s_sy)
        let sz = parseFloat(s_sz)

        return new Doodad(id, x, y, z, a, sx, sy, sz)
    }

    readonly path: string
    readonly data: ReadonlyArray<Doodad>
}