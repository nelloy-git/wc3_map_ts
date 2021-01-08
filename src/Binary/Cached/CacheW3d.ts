import { Tile } from "../w3e/Tile";
import { Log } from "../../Utils";
import { BinaryCache } from "./Cache";
import { w3dFile } from "../w3d/File";
import { Decor } from "../w3d/Decor";
import { FieldDecorList } from "../w3d/Field";

export class CacheW3d extends BinaryCache<[id: number, model: string]> {
    constructor(path: string){
        super(path)
        this.path = path

        if (!IsGame()){
            let f = new w3dFile()
            f.open(this.path)

            let id2model: [id: number, model: string][] = []
            f.data.forEach(elem => {
                let id = elem.id
                let model = elem.getString(FieldDecorList.Model)
                if (model){
                    id2model.push([id, model])
                }
            });

            this._save(id2model)
        }
        this.data = this._load()
    }

    protected _elemToRaw(data: [id: number, model: string]){
        return string.format('(%d,%s)', data[0], data[1])
    }

    protected _elemFromRaw(s_data: string){
        if (s_data.charAt(0) != '(' ||
            s_data.charAt(s_data.length - 1) != ')'){

            print('\'' + s_data.charAt(0), s_data.charAt(s_data.length - 1) + '\'')
            return Log.err(CacheW3d.name + 
                           ': can not parse tile \'' + s_data + '\'')
        }

        s_data = s_data.slice(1, s_data.length - 1)
        let [s_id, model] = s_data.split(',')
        let id = parseInt(s_id)

        let res: [id: number, model: string] = [id, model]

        return res
    }

    readonly path: string
    readonly data: ReadonlyArray<[id: number, model: string]>
}