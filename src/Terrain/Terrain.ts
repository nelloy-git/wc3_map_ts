import * as Binary from '../Binary'
import * as Json from '../Json'

import { getFilePath, Log } from '../Utils'

let __path__ = Macro(getFilePath())

export type Terrain = {
    readonly name: string
    readonly icon: string

    readonly types: ReadonlyArray<Binary.TDoodad>
    readonly doodads: ReadonlyArray<Binary.Doodad>
}

export namespace Terrain {

    function create(name: string, icon: string, 
                    types: ReadonlyArray<Binary.TDoodad>,
                    doodads: ReadonlyArray<Binary.Doodad>): Terrain{
        return {
            name: name,
            icon: icon,

            types: types,
            doodads: doodads
        }
    }

    export function createFromBinary(name: string, icon: string, w3d_path: string, doo_path: string): Terrain{
        if (IsGame()){
            return Log.err('Terrain: function can not be used in runtime.',
                            __path__, undefined, 2)
        }

        let w3d = new Binary.w3dFile(w3d_path)
        let doo = new Binary.dooFile(doo_path)
    
        let t: Terrain = {
            name: name,
            icon: icon,
    
            types: w3d.data,
            doodads: doo.data
        }
    
        return create(name, icon, w3d.data, doo.data)
    }

    export function createFromJson(path: string){
        let f = new Json.JsonFile(path, GetSrc(), false)
        let json = <LuaHash | undefined>f.data

        if (!json){
            return Log.err('Terrain: file ' + path + ' is empty.')
        }

        let name = Json.Read.String(json, 'name', path)
        let icon = Json.Read.String(json, 'icon', path)
        let json_types = Json.Read.TableArray(json, 'types', path)
        let json_doodads = Json.Read.TableArray(json, 'doodads', path)

        let types: Binary.TDoodad[] = []
        for (let json_type of json_types){
            let id = Json.Read.String(json_type, 'id', path)
            let origin_id = Json.Read.String(json_type, 'origin_id', path)
            let tdood = Binary.TDoodad.create(id, origin_id)
            types.push(tdood)

            let json_fields = Json.Read.Table(json_type, 'fields', path)
            for (let code in json_fields){
                let field = Binary.findDoodadField(code)
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

        let doodads: Binary.Doodad[] = []
        for (let json_dood of json_doodads){
            let id = Json.Read.String(json_dood, 'id', path)
            let pos = Json.Read.NumberArray(json_dood, 'pos', path)
            let angle = Json.Read.Number(json_dood, 'angle', path)
            let variation = Json.Read.Number(json_dood, 'variation', path)
            let scale = Json.Read.NumberArray(json_dood, 'scale', path)

            let dood = Binary.Doodad.create(id, pos[0], pos[1], pos[2],
                                            angle, variation, scale[0], scale[1], scale[2])
            doodads.push(dood)
        }
        
        return create(name, icon, types, doodads)
    }
}