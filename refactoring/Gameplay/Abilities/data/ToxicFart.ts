import { IFace, TargetType } from "../../../AbilityExt"
import { hEffect, hUnit} from "../../../../src/Handle"
import { Arc, Line, newEffectList } from '../../../Drawing'
import { CastingData } from "../CastingData"
import { Vec2, Vec3 } from "../../../../src/Utils";

export class ToxicFart {
    constructor(caster: hUnit, area: number, area_per_tick: number, model: string){
        let v = Vec3.fromVec2(Vec2.fromPolar(caster.angle, 100), 0)

        // this.__cloud = new hEffect(model, v)
        // this.__cloud.scale = 
    }

    destroy(){
    }

    // private __cloud: hEffect
}