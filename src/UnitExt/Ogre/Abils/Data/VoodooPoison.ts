import { IFace } from "../../../../AbilityExt"
import { hUnit } from "../../../../Handle"
import { IsWalkable } from "../../../../Utils"
import { AbilData } from "../../../AbilityData"

export class VoodooPoisonData extends AbilData{
    constructor(abil: IFace<any>, cx: number, cy: number, r: number){
        super(abil)

        
    }

    static get = <(abil: IFace<any>) => VoodooPoisonData|undefined>AbilData.get

    destroy(){
        super.destroy()


    }

}