import { BuilderCache, int2id, Log } from "../../Utils";
import { Doodad } from "../doo/Doodad";
import { dooFile } from "../doo/File";
import { Decor } from "../w3d/Decor";
import { FieldDecorList } from "../w3d/Field";
import { w3dFile } from "../w3d/File";
import { w3eFile } from "../w3e/File";
import { hEffect, hTile, hTimer } from '../../Handle'

type TypeData = [virt_id: number, model: string]
type TileData = [x: number, y: number, h: number, tile: number]
type DoodadData = [id: number,
                    x: number, y: number, z: number, a: number,
                    scale_x: number, scale_y: number, scale_z: number]

export class TerrainPreset {
    constructor(w3e_path: string, w3d_path: string, doo_path: string){
        this._w3d_path = w3d_path
        this._w3e_path = w3e_path
        this._doo_path = doo_path

        this._w3e = new w3eFile()
        this._doo = new dooFile()
        this._w3d = new w3dFile()

        if (!IsGame()){
            this._cacheW3e(w3e_path)
            this._cacheW3dDoo(w3d_path, doo_path)
        }
    }

    enable(flag: boolean){
        if (!IsGame()){return}

        if (flag){
            let cache_w3e = TerrainPreset._cache_w3e.get(this._w3e_path)
            cache_w3e.forEach(data => {
                this._tiles.push(new hTile(...data))
            })

            // Wait for tiles.
            let t = new hTimer()
            t.addAction(()=>{
                this._createDoodads()
                t.destroy
            })
            t.start(0.1, false)
        }
    }

    private _createDoodads(){
        let id2model = TerrainPreset._cache_id2model.get(this._w3d_path)
        let cache_doo = TerrainPreset._cache_doo.get(this._doo_path)
        cache_doo.forEach(dood => {
            let model: string|undefined
            for (let i = 0; i < id2model.length; i++){
                if (id2model[i][0] == dood[0]){
                    model = id2model[i][1]
                }
            }

            if (!model){
                return Log.err('')
            }

            let data = new Doodad(...dood)
            let eff = new hEffect(model, data.x, data.y, data.z)
            eff.x = data.x
            eff.y = data.y
            eff.z = data.z
            eff.yaw = data.a
            eff.scaleX = 1.0975 * data.scale_x // Magic const
            eff.scaleY = 1.0975 * data.scale_y // Magic const
            eff.scaleZ = 1.0975 * data.scale_z // Magic const
            this._doods.push(eff)

            if (data.scale_x != data.scale_y){
                print('data.scale_x != data.scale_y')
            }
        })
    }

    private _cacheW3e(w3e_path: string){
        this._w3e.open(w3e_path)

        let cache: TileData[] = []
        let tiles = this._w3e.data
        tiles.forEach(t => {
            cache.push([t.x, t.y, t.h, t.tile])
        })
        TerrainPreset._cache_w3e.set(w3e_path, cache)
    }

    private _cacheW3dDoo(w3d_path: string, doo_path: string){
        // TODO optimization
        this._w3d.open(w3d_path)
        this._doo.open(doo_path)

        let id2model: TypeData[] = []
        let cache: DoodadData[] = []

        let types = this._w3d.data
        let doods = this._doo.data

        doods.forEach(dood => {
            let id = dood.id
            let type: Decor | undefined
            for (let i = 0; i < types.length; i++){
                if (types[i].id == id){
                    type = types[i]
                    break
                }
            }

            if (!type){
                return Log.err(TerrainPreset.name + 
                               ': can not find id \'' + int2id(id) + '\' type.')
            }

            let model = type.getString(FieldDecorList.Model)

            if (!model){
                return Log.err(TerrainPreset.name + 
                               ': can not find \'' + int2id(id) + '\' doodad\'s model.')
            }

            id2model.push([id, model])
            cache.push([dood.id, dood.x, dood.y, dood.z, dood.a, dood.scale_x, dood.scale_y, dood.scale_z])
        })
        TerrainPreset._cache_id2model.set(w3d_path, id2model)
        TerrainPreset._cache_doo.set(doo_path, cache)
    }
    
    private _w3d_path: string
    private _w3e_path: string
    private _doo_path: string
    
    private _w3d: w3dFile
    private _w3e: w3eFile
    private _doo: dooFile

    private _tiles: hTile[] = []
    private _doods: hEffect[] = []

    private static _cache_id2model = new BuilderCache<string, TypeData[]>(0)
    private static _cache_doo = new BuilderCache<string, DoodadData[]>(1)
    private static _cache_w3e = new BuilderCache<string, TileData[]>(2)
}