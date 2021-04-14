import * as Handle from '../../src/Handle'
import * as Ability from '../AbilityExt'
import * as Buff from '../Buff'
import * as Param from '../Parameter'

export interface IUnit {
    readonly obj: Handle.hUnit
    readonly abils: Ability.Container
    readonly buffs: Buff.Container
    readonly params: Param.UnitContainer
}

export function IUnit(u: Handle.hUnit | undefined): IUnit | undefined{
    if (!u){
        return undefined
    }

    let abils = Ability.Container.get(u)
    let buffs = Buff.Container.get(u)
    let params = Param.UnitContainer.get(u)

    if (!abils || !buffs || !params){
        return undefined
    }

    return {
        obj: u,
        abils: abils,
        buffs: buffs,
        params: params
    }
}