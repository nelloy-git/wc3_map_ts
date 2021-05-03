import * as Handle from '../Handle'
import * as Abil from '../Abil'
import * as Buff from '../Buff'
import * as Param from '../Parameter'

export interface IUnit {
    readonly obj: Handle.hUnit
    readonly abils: Abil.Container
    readonly buffs: Buff.Container
    readonly params: Param.ContainerUnit
}

export function IUnit(u: Handle.hUnit | undefined): IUnit | undefined{
    if (!u){
        return undefined
    }

    let abils = Abil.Container.get(u)
    let buffs = Buff.Container.get(u)
    let params = Param.ContainerUnit.get(u)

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