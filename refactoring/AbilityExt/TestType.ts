import * as Abil from './index'
import { hUnit } from '../../src/Handle'

let TCasting = new Abil.TCasting<hUnit[]>()
TCasting.start = (abil, target) => {print(abil.Data.name + ': casting start')}
TCasting.casting = (abil, target) => {print(abil.Data.name + ': casting left ' + abil.Casting.Timer.left)}
TCasting.cancel = (abil, target) => {print(abil.Data.name + ': casting cancel')}
TCasting.interrupt = (abil, target) => {print(abil.Data.name + ': casting interrupt')}
TCasting.finish = (abil, target) => {print(abil.Data.name + ': casting finish')}
TCasting.castingTime = (abil, target) => {return 3}
TCasting.isTargetValid = (abil, target) => {return true}

let TData = new Abil.TData<hUnit[]>()
TData.name = abil => {return 'TestType'}
TData.icon = abil => {return 'ReplaceableTextures\\WorldEditUI\\DoodadPlaceholder.blp'}
TData.dis_icon = abil => {return 'ReplaceableTextures\\WorldEditUI\\DoodadPlaceholder.blp'}
TData.tooltip = abil => {return 'TestTooltip'}
TData.life_cost = abil => {return 0}
TData.mana_cost = abil => {return 0}
TData.range = abil => {return 500}
TData.area = abil => {return 50}
TData.charges_use = abil => {return 1}
TData.charges_max = abil => {return 1}
TData.charge_cd = abil => {return 5}
TData.is_available = abil => {
    let charges = abil.Data.Charges.count > 0
    let casting = abil.Casting.Timer.left <= 0
    return charges && casting
}
TData.consume = abil => {
    abil.Data.Charges.cooldown = TData.charge_cd(abil)
    abil.Data.Charges.count -= TData.charges_use(abil)
    return true
}

export let TestType = new Abil.TAbility(TCasting, TData, Abil.TTargetingFriend)