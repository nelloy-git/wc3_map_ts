import { Vec2 } from '../Math'

import * as Abil from './index'

const TCasting = new Abil.TCasting<[Vec2]>()
TCasting.start = (abil, target) => {print(abil.Data.name + ': casting start')}
TCasting.casting = (abil, target) => {print(abil.Data.name + ': casting left ' + abil.Casting.timer.left)}
TCasting.cancel = (abil, target) => {print(abil.Data.name + ': casting cancel')}
TCasting.interrupt = (abil, target) => {print(abil.Data.name + ': casting interrupt')}
TCasting.finish = (abil, target) => {print(abil.Data.name + ': casting finish')}
TCasting.castingTime = (abil, target) => {return 3}
TCasting.isTargetValid = (abil, target) => {return true}

const TCharges = new Abil.TCharges<[Vec2]>()
TCharges.use = () => {return 1}
TCharges.max = () => {return 1}
TCharges.cd = () => {return 1}

const TData = new Abil.TData<[Vec2]>()
TData.name = abil => {return 'TestType'}
TData.icon = abil => {return 'ReplaceableTextures\\WorldEditUI\\DoodadPlaceholder.blp'}
TData.dis_icon = abil => {return 'ReplaceableTextures\\WorldEditUI\\DoodadPlaceholder.blp'}
TData.tooltip = abil => {return 'TestTooltip'}
TData.life_cost = abil => {return 0}
TData.mana_cost = abil => {return 0}
TData.range = abil => {return 500}
TData.area = abil => {return 50}
TData.is_available = abil => {
    let charges = abil.Charges.cur > abil.Charges.use
    let casting = abil.Casting.timer.left <= 0
    return charges && casting
}
TData.consume = abil => {
    abil.Charges.consume()
    return true
}

export const TestType = new Abil.TAbil(TCasting, TCharges, TData, Abil.TTargetingArea)