import * as Binary from '../Binary'
import { hDestructable, hEffect } from '../Handle'
import * as Json from '../Json'

import { getFilePath, getTerrainZ, id2int, isReforged, Log } from '../Utils'

let __path__ = Macro(getFilePath())

export type Terrain = {
    readonly name: string
    readonly icon: string
    readonly cx: number
    readonly cy: number

    readonly tiles_used: ReadonlyArray<string>
    readonly tiles: ReadonlyArray<Binary.Tile>
    readonly pathing: ReadonlyArray<Binary.Path>
    readonly doodads_used: ReadonlyArray<Binary.TDoodad>
    readonly doodads: ReadonlyArray<Binary.Doodad>
}

export namespace Terrain {

    function create(name: string, icon: string,
                    cx: number, cy: number,
                    tiles_used: ReadonlyArray<string>,
                    tiles: ReadonlyArray<Binary.Tile>,
                    pathing: ReadonlyArray<Binary.Path>,
                    doodads_used: ReadonlyArray<Binary.TDoodad>,
                    doodads: ReadonlyArray<Binary.Doodad>): Terrain{
        return {
            name: name,
            icon: icon,
            cx: cx,
            cy: cy,

            tiles_used: tiles_used,
            tiles: tiles,

            pathing: pathing,

            doodads_used: doodads_used,
            doodads: doodads
        }
    }

    export function createFromBinary(name: string, icon: string,
                                     dir_path: string): Terrain{
        if (IsGame()){
            return Log.err('Terrain: function can not be used in runtime.',
                            __path__, undefined, 2)
        }

        let wmp = new Binary.wmpFile(dir_path + '/war3map.wmp')
        let w3d = new Binary.w3dFile(dir_path + '/war3map.w3d')
        let doo = new Binary.dooFile(dir_path + '/war3map.doo')
        let w3e = new Binary.w3eFile(dir_path + '/war3map.w3e')

        let used_id: string[] = []
        for (let dood of doo.data){
            if (used_id.indexOf(dood.id) < 0){
                used_id.push(dood.id)
            }
        }
    
        print(w3e.cx, w3e.cy)
        return create(name, icon,
                      w3e.cx, w3e.cy,
                      w3e.usedTiles, w3e.data,
                      wmp.data,
                      w3d.data, doo.data)
    }

    export function createFromJson(json: LuaHash){
        let name = Json.Read.String(json, 'name')
        let icon = Json.Read.String(json, 'icon')
        let cx = Json.Read.Number(json, 'cx')
        let cy = Json.Read.Number(json, 'cy')
        let json_pathing = Json.Read.TableArray(json, 'pathing')
        let json_tiles = Json.Read.TableArray(json, 'tiles')
        let json_types = Json.Read.TableArray(json, 'doodads_used')
        let json_doodads = Json.Read.TableArray(json, 'doodads')

        let tiles_used = Json.Read.StringArray(json, 'tiles_used')
        let tiles = getJsonTiles(json_tiles)
        let pathing = getJsonPathing(json_pathing)
        let [used_id, doodads] = getJsonDoodads(json_doodads)
        let types = getJsonDoodadTypes(json_types, used_id)
        
        return create(name, icon, cx, cy, tiles_used, tiles, pathing, types, doodads)
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

    function getJsonPathing(json: LuaTable[]){
        let paths: Binary.Path[] = []
        for(let json_path of json){
            let x = Json.Read.Number(json_path, 'x')
            let y = Json.Read.Number(json_path, 'y')
            let f = Json.Read.Number(json_path, 'f')

            paths.push(Binary.Path.create(x, y, f))
        }

        return paths
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
                    return Log.err('can not file field ' + code + ' of doodad ' + id)
                }

                let val = json_fields[code]
                let is_valid = (typeof val === 'boolean' && field.type == 'bool') ||
                               (typeof val === 'number' && (field.type == 'int' || field.type == 'real' || field.type == 'unreal')) ||
                               (typeof val === 'string' && field.type == 'string')     

                if (!is_valid){
                    return Log.err('invalid data of field ' + code + ' of doodad ' + id + '\n' + 
                                    typeof val + '(' + field.type + ')')
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
        let cx = terrain.cx
        let cy = terrain.cy

        for (let tile of terrain.tiles){
            let [x, y, z] = tile.pos

            SetTerrainType(min_x + x, min_y + y, FourCC(tile.id), -1, 1, 1)
            TerrainDeformCrater(min_x + x, min_y + y, 128, -z - 224, 1, true)
        }

        for (let dood of terrain.doodads){
            if (blockers.includes(dood.id)){
                let dest = new hDestructable(id2int(dood.id),
                                             dood.pos[0] - cx, dood.pos[1] - cy, dood.pos[2],
                                             dood.a, dood.sc[0], dood.var)
                doods.push(dest)
                continue
            }

            let type: Binary.TDoodad | undefined
            for (let t of terrain.doodads_used){
                if (dood.id == t.id){
                    type = t
                    break
                }
            }

            let model
            if (type){
                model = Binary.TDoodad.getField(type, Binary.TDoodadField.Model)
            }

            let hd = isReforged(GetLocalPlayer())
            if (!model){model = Binary.DoodadsSLK.getModel(dood.id, hd)}
            if (!model){continue}

            let scale = 1
            if (type){
                let s = Binary.DoodadsSLK.getScale(type.origin_id, hd)
                scale = s ? s : scale
            } else if (Binary.DoodadsSLK.isDefault(dood.id)){
                let s = Binary.DoodadsSLK.getScale(dood.id, hd)
                scale = s ? s : scale
            }

            if (Binary.DoodadsSLK.isDefault(dood.id) && Binary.DoodadsSLK.hasVariations(dood.id, hd)){
                model += dood.var
            }

            if (dood.id == 'ZRrk'){
                print(Binary.DoodadsSLK.hasVariations(dood.id, hd), model)
            }

            let [x, y, z] = dood.pos
            let eff = new hEffect(model, x - cx + 64, y - cy + 64, z)
            eff.yaw = dood.a
            eff.scaleX = scale * dood.sc[0]
            eff.scaleY = scale * dood.sc[1]
            eff.scaleZ = scale * dood.sc[2]

            doods.push(eff)
        }
        print(terrain.doodads.length, doods.length)
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