import { hUnit } from "../Handle";

import { IFace } from "./Ability/IFace";
import { TargetType } from "./Utils";

import { Casting } from "./Ability/Casting";
import { Data } from "./Ability/Data";
import { Targeting } from "./Ability/Targeting";

import { TCasting } from './Type/Casting'
import { TData } from './Type/Data'
import { TTargeting } from './Type/Targeting'

export class TAbility<T extends TargetType>{
    constructor(TCasting: TCasting<T>, TData: TData<T>, TTargeting: TTargeting<T>){
        this.TData = TData
        this.TCasting = TCasting
        this.TTargeting = TTargeting
    }

    readonly TData: TData<T>
    readonly TCasting: TCasting<T>
    readonly TTargeting: TTargeting<T>
}

export class Ability<T extends TargetType> implements IFace<T> {
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