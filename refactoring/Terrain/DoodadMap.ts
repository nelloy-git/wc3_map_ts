import * as Binary from '../../src/Binary'
import * as Utils from "../../src/Utils"

import { hDestructable, hEffect } from '../../src/Handle'

const BLOCKERS: string[] = [
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

const HD = IsGame() ? Utils.isReforged(GetLocalPlayer()) : false

export class DoodadMap {
        constructor(w3d: Binary.w3dFile, doo: Binary.dooFile, offset: [number, number, number]){
        this.w3d = w3d
        this.doo = doo
        this.offset = offset

        this.__blockers = []
        this.__doodads = []
    }

    apply(){
        const cx = this.offset[0]
        const cy = this.offset[1]
        const cz = this.offset[2]
        
        for (const data of this.doo.objects){
            const id = data.id
            if (BLOCKERS.includes(id)){
                let dest = new hDestructable(Utils.id2int(id),
                                             data.pos[0] + cx, data.pos[1] + cy, data.pos[2] + cz,
                                             data.yaw, data.scale[0], data.var)
                this.__blockers.push(dest)
                continue
            }

            let tdood = this.__getType(id)
            let model = this.__getDoodModel(id, tdood)
            let s_mult = this.__getScaleMult(id, tdood)

            if (!model){continue}

            if (model
                && Binary.TDoodadsSLK.isDefault(id)
                && Binary.TDoodadsSLK.hasVariations(id, HD)){
                    model += data.var.toString()
            }

            let [x, y, z] = data.pos
            let [sc_x, sc_y, sc_z] = data.scale

            let eff = new hEffect(model, new Utils.Vec3(x + cx, y + cy, z + cz))
            this.__doodads.push(eff)
            eff.yaw = data.yaw
            eff.scale = [s_mult * sc_x, s_mult * sc_y, s_mult * sc_z]
        }
    }

    clear(){
        for (let eff of this.__doodads){
            eff.destroy()
        }
        this.__doodads = []

        for (let block of this.__blockers){
            block.destroy()
        }
        this.__blockers = []
    }

    private __getType(id: string){
        let tdood: Binary.TDoodad | undefined
        for (let td of this.w3d.objects){
            if (id == td.id){
                tdood = td
                break
            }
        }
        return tdood
    }

    private __getDoodModel(id: string, tdood: Binary.TDoodad | undefined){
        if (tdood){
            let change = tdood.findChange(Binary.TDoodadField.Model)
            if (change){return <string>change.val}
        }

        return Binary.TDoodadsSLK.getModel(id, HD)
    }

    private __getScaleMult(id: string, tdood: Binary.TDoodad | undefined){
        let mult = 1

        if (tdood){
            let s = Binary.TDoodadsSLK.getScale(tdood.origin_id, HD)
            mult = s ? s : mult
        } else if (Binary.TDoodadsSLK.isDefault(id)){
            let s = Binary.TDoodadsSLK.getScale(id, HD)
            mult = s ? s : mult
        }

        return mult
    }

    readonly w3d: Binary.w3dFile
    readonly doo: Binary.dooFile
    readonly offset: [number, number, number]

    private __blockers: hDestructable[]
    private __doodads: hEffect[]
}