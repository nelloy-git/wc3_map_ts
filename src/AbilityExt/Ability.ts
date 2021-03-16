import { hUnit } from "../Handle";

import { IFace, TargetType } from "./Ability/IFace";

import { Casting } from "./Ability/Casting";
import { Data } from "./Ability/Data";
import { Targeting } from "./Ability/Targeting";

import { TCasting } from './Type/Casting'
import { TData } from './Type/Data'
import { TTargeting } from './Type/Targeting'

export class TAbility<T extends TargetType[]>{
    constructor(
        public TCasting: TCasting<T>, 
        public TData: TData<T>,
        public TTargeting: TTargeting<T>){}
}

export class Ability<T extends TargetType[]> implements IFace<T> {
    constructor(owner: hUnit, type: TAbility<T>){
        let id = IFace.register(this)

        this.Casting = new Casting(this, type.TCasting)
        this.Data = new Data(this, id, owner, type.TData)
        this.Targeting = new Targeting(this, type.TTargeting)
    }

    readonly Casting: Casting<T>
    readonly Data: Data<T>
    readonly Targeting: Targeting<T>
}