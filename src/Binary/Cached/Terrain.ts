import { id2int, int2id, Log } from "../../Utils";
import { hDestructable, hEffect, hTile, hTimer } from '../../Handle'
import { CacheW3e } from "./CacheW3e";
import { CacheW3d } from "./CacheW3d";
import { CacheDoo } from "./CacheDoo";

export class TerrainPreset {
    constructor(w3e_path: string, w3d_path: string, doo_path: string){
        this._w3e_cache = new CacheW3e(w3e_path)
        this._w3d_cache = new CacheW3d(w3d_path)
        this._doo_cache = new CacheDoo(doo_path)
    }

    enable(flag: boolean){
        if (!IsGame()){return}

        if (flag){
            this._w3e_cache.data.forEach(tile => {
                this._tiles.push(new hTile(tile.x, tile.y, tile.z, tile.id))
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
        let id2model = this._w3d_cache.data
        let doods = this._doo_cache.data

        doods.forEach(dood => {
            // Is pathblocker?
            if (TerrainPreset._destructable_ids.indexOf(dood.id) >= 0){
                // print(int2id(dood.id), dood.x, dood.y, dood.z)
                this._destrs.push(new hDestructable(dood.id, dood.x, dood.y, dood.z, dood.a,
                                                    dood.scale_x, 0))
            } else {
                let model: string|undefined
                for (let i = 0; i < id2model.length; i++){
                    if (id2model[i][0] == dood.id){
                        model = id2model[i][1]
                    }
                }
    
                if (!model){
                    return Log.err(TerrainPreset.name + 
                                   ': model not found for id ' + int2id(dood.id))
                }
    
                let eff = new hEffect(model, dood.x, dood.y, dood.z)
                eff.yaw = dood.a
                eff.scaleX = 1.0975 * dood.scale_x // Magic const
                eff.scaleY = 1.0975 * dood.scale_y // Magic const
                eff.scaleZ = 1.0975 * dood.scale_z // Magic const
                this._doods.push(eff)
    
                if (dood.scale_x != dood.scale_y){
                    Log.err(TerrainPreset.name + 
                            ': data.scale_x != data.scale_y')
                }
            }
        })
    }

    private _w3e_cache: CacheW3e
    private _w3d_cache: CacheW3d
    private _doo_cache: CacheDoo

    private _tiles: hTile[] = []
    private _doods: hEffect[] = []
    private _destrs: hDestructable[] = []

    private static _destructable_ids: number[] = [
        id2int('YTfb'), //2x2 Unflyable
        id2int('YTfc'), //4x4 Unflyable
        id2int('YTlb'), //2x2 Default
        id2int('Ytlc'), //4x4 Default
        id2int('YTpb'), //2x2 Default
        id2int('YTpc'), //4x4 Default
        id2int('YTab'), //2x2 Cyan
        id2int('YTac'), //4x4 Cyan
        id2int('OTis'), //2x2 Platform 
        id2int('OTip'), //4x4 Platform
    ]
}