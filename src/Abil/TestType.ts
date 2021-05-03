import { Vec2 } from '../Math'

import { TAbil } from './TAbil'
import { TCasting } from './Casting/Type'
import { TCharges } from './Charges/Type'
import { TData } from './Data/Type'
import { TTargetingArea } from './Targeting/Default/Area'

const TCast = new TCasting<[Vec2]>()
TCast.start = (abil, target) => {print(abil.Data.name + ': casting start')}
TCast.casting = (abil, target) => {} //print(abil.Data.name + ': casting left ' + abil.Casting.timer.left)}
TCast.cancel = (abil, target) => {print(abil.Data.name + ': casting cancel')}
TCast.interrupt = (abil, target) => {print(abil.Data.name + ': casting interrupt')}
TCast.finish = (abil, target) => {print(abil.Data.name + ': casting finish')}
TCast.castingTime = (abil, target) => {return 3}
TCast.isTargetValid = (abil, target) => {return true}

const TChar = new TCharges<[Vec2]>()
TChar.use = () => {return 1}
TChar.max = () => {return 3}
TChar.cd = () => {return 3}

const TDat = new TData<[Vec2]>()
TDat.name = abil => {return 'TestType'}
TDat.icon = abil => {return 'ReplaceableTextures\\WorldEditUI\\DoodadPlaceholder.blp'}
TDat.dis_icon = abil => {return 'ReplaceableTextures\\WorldEditUI\\DoodadPlaceholder.blp'}
TDat.tooltip = abil => {return 'TestTooltip'}
TDat.life_cost = abil => {return 0}
TDat.mana_cost = abil => {return 0}
TDat.range = abil => {return 500}
TDat.area = abil => {return 50}
TDat.is_available = abil => {
    let charges = abil.Charges.cur > abil.Charges.use
    let casting = abil.Casting.timer.left <= 0
    return charges && casting
}
TDat.consume = abil => {
    abil.Charges.consume()
    return true
}

export const TestType = new TAbil(TCast, TChar, TDat, TTargetingArea)