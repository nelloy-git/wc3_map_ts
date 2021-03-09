import * as Handle from '../Handle'
import * as Ability from '../AbilityExt'
import * as Buff from '../Buff'
import * as Param from '../Parameter'

export interface IUnit {
    readonly obj: Handle.hUnit
    readonly abils: Ability.Container
    readonly buffs: Buff.Container
    readonly params: Param.Container
}