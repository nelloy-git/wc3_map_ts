import * as Binary from '../Binary'
import { hDestructable, hEffect } from '../Handle'
import * as Json from '../Json'

import { getFilePath, getTerrainZ, id2int, Log } from '../Utils'

let __path__ = Macro(getFilePath())

export type Terrain = {
    readonly name: string
    readonly icon: string

    readonly tiles_used: ReadonlyArray<string>
    readonly tiles: ReadonlyArray<Binary.Tile>
    readonly doodads_used: ReadonlyArray<Binary.TDoodad>
    readonly doodads: ReadonlyArray<Binary.Doodad>
}

export namespace Terrain {

    function create(name: string, icon: string,
                    tiles_used: ReadonlyArray<string>,
                    tiles: ReadonlyArray<Binary.Tile>,
                    doodads_used: ReadonlyArray<Binary.TDoodad>,
                    doodads: ReadonlyArray<Binary.Doodad>): Terrain{
        return {
            name: name,
            icon: icon,

            tiles_used: tiles_used,
            tiles: tiles,

            doodads_used: doodads_used,
            doodads: doodads
        }
    }

    export function createFromBinary(name: string, icon: string,
                                     w3e_path: string,
                                     w3d_path: string,
                                     doo_path: string): Terrain{
        if (IsGame()){
            return Log.err('Terrain: function can not be used in runtime.',
                            __path__, undefined, 2)
        }

        let w3d = new Binary.w3dFile(w3d_path)
        let doo = new Binary.dooFile(doo_path)
        let w3e = new Binary.w3eFile(w3e_path)

        let used_id: string[] = []
        for (let dood of doo.data){
            if (used_id.indexOf(dood.id) < 0){
                used_id.push(dood.id)
            }
        }
    
        return create(name, icon, w3e.usedTiles, w3e.data, w3d.data, doo.data)
    }

    export function createFromJson(json: LuaHash){
        let name = Json.Read.String(json, 'name')
        let icon = Json.Read.String(json, 'icon')
        let json_tiles = Json.Read.TableArray(json, 'tiles')
        let json_types = Json.Read.TableArray(json, 'doodads_used')
        let json_doodads = Json.Read.TableArray(json, 'doodads')

        let tiles_used = Json.Read.StringArray(json, 'tiles_used')
        let tiles = getJsonTiles(json_tiles)
        let [used_id, doodads] = getJsonDoodads(json_doodads)
        let types = getJsonDoodadTypes(json_types, used_id)
        
        return create(name, icon, tiles_used, tiles, types, doodads)
    }

    function getJsonTiles(json: LuaTable[]){
        let tiles: Binary.Tile[] = []
        for (let json_tile of json){
            let id = Json.Read.String(json_tile, 'id')
            let pos = Json.Read.NumberArray(json_tile, 'pos')

            tiles.push(Binary.Tile.create(id, pos[0], pos[1], pos[2]))
        }

        return tiles
    }

    function getJsonDoodads(json: LuaTable[]): [string[], Binary.Doodad[]]{
        let used_id: string[] = []
        let doodads: Binary.Doodad[] = []
        for (let json_dood of json){
            let id = Json.Read.String(json_dood, 'id')
            let pos = Json.Read.NumberArray(json_dood, 'pos')
            let angle = Json.Read.Number(json_dood, 'a')
            let variation = Json.Read.Number(json_dood, 'var')
            let scale = Json.Read.NumberArray(json_dood, 'sc')

            let dood = Binary.Doodad.create(id, pos[0], pos[1], pos[2],
                                            angle, variation, scale[0], scale[1], scale[2])
            
            if (used_id.indexOf(id) < 0){
                used_id.push(id)
            }
            doodads.push(dood)
        }

        return [used_id, doodads]
    }

    function getJsonDoodadTypes(json: LuaTable[], used_ids: string[]){
        let types: Binary.TDoodad[] = []
        for (let json_type of json){
            let id = Json.Read.String(json_type, 'id')
            if (used_ids.indexOf(id) < 0){
                continue
            }

            let origin_id = Json.Read.String(json_type, 'origin_id')
            let tdood = Binary.TDoodad.create(id, origin_id)
            types.push(tdood)

            let json_fields = Json.Read.Table(json_type, 'fields')
            for (let code in json_fields){
                let field = Binary.findTDoodadField(code)
                if (!field){
                    return Log.err('')
                }

                let val = json_fields[code]
                let is_valid = (typeof val === 'boolean' && field.type == 'bool') ||
                               (typeof val === 'number' && (field.type == 'int' || field.type == 'real' || field.type == 'unreal')) ||
                               (typeof val === 'string' && field.type == 'string')     

                if (!is_valid){
                    return Log.err('')
                }
                
                Binary.TDoodad.setField(tdood, field, <any>json_fields[code])
            }
        }

        return types
    }

    let doods: (hEffect | hDestructable)[] = []
    let min_x: number
    let min_y: number
    let max_x: number
    let max_y: number
    if (IsGame()){
        let rect = GetWorldBounds()
        min_x = GetRectMinX(rect)
        min_y = GetRectMinY(rect)
        max_x = GetRectMaxX(rect)
        max_y = GetRectMaxY(rect)

        clear()
    }

    export function apply(terrain: Terrain){
        clear()

        for (let tile of terrain.tiles){
            let [x, y, z] = tile.pos
            SetTerrainType(x, y, FourCC(tile.id), -1, 1, 1)
            TerrainDeformCrater(x, y, 128, (8192 - z) / 4 + 160, 1, true)
        }

        for (let dood of terrain.doodads){
            if (blockers.includes(dood.id)){
                print(dood.id, dood.a)
                let dest = new hDestructable(id2int(dood.id),
                                             dood.pos[0], dood.pos[1], dood.pos[2],
                                             dood.a, dood.sc[0], dood.var)
                doods.push(dest)
                continue
            }

            let type: Binary.TDoodad | undefined
            for (type of terrain.doodads_used){
                if (dood.id == type.id){
                    break
                }
            }

            if (type == undefined){
                continue
            }

            let model = Binary.TDoodad.getField(type, Binary.TDoodadField.Model)

            if (model == undefined){
                continue
            }

            let [x, y, z] = dood.pos
            let eff = new hEffect(model, x, y, z)
            eff.yaw = dood.a
            eff.scaleX = 1.0975 * dood.sc[0]
            eff.scaleY = 1.0975 * dood.sc[1]
            eff.scaleZ = 1.0975 * dood.sc[2]

            doods.push(eff)
        }
        print(terrain.doodads.length)
    }

    export function clear(){
        for (let x = min_x; x < max_x; x += 128){
            for (let y = min_y; y < max_y; y += 128){
                SetTerrainType(x, y, FourCC('Oaby'), -1, 1, 1)
                TerrainDeformCrater(x, y, 128, getTerrainZ(x, y), 1, true)
            }
        }

        for (let dood of doods){
            dood.destroy()
        }
        doods = []
    }
    
    let blockers: string[] = [
        'YTfb', //2x2 Unflyable
        'YTfc', //4x4 Unflyable
        'YTlb', //2x2 Default
        'Ytlc', //4x4 Default
        'YTpb', //2x2 Default
        'YTpc', //4x4 Default
        'YTab', //2x2 Cyan
        'YTac', //4x4 Cyan
        'OTis', //2x2 Platform 
        'OTip', //4x4 Platform
    ]
}