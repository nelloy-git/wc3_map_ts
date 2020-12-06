import { Ability, AbilityTypeCasting } from "../AbilityExt";
import { hUnit } from "../Handle";

class Casting extends AbilityTypeCasting {
    start(abil: Ability): void {};
    casting(abil: Ability, dt: number): void {
        let targ_list = abil.getTargets()
        if (!targ_list ||
            targ_list.length != 1 ||
            !(targ_list[0] instanceof hUnit)){return}

        let targ = targ_list[0]

        let cur = Casting._life_drained.get(abil)
        if (!cur){cur = 0}
        cur += Casting._drain_per_sec * dt * targ.lifeMax

        Casting._life_drained.set(abil, cur)
    };
    cancel(abil: Ability): void {};
    interrupt(abil: Ability): void {};
    finish(abil: Ability): void {};

    private static _drain_per_sec = 0.03
    private static _life_drained = new Map<Ability, number>()
}