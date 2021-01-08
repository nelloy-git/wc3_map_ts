import { hEffectAttached, hUnit } from "../../Handle";
import { Buff } from "../Buff";
import { Type } from "../Type";
import { TypeData } from "../Type/Data";
import { TypeProcess } from "../Type/Process";

let ICON = 'ReplaceableTextures\\CommandButtons\\BTNStun.blp'
let MODEL = 'Abilities\\Spells\\Human\\Thunderclap\\ThunderclapTarget.mdl'

class StunData extends TypeData {
    static readonly instance = new StunData()

    name(buff: Buff<number>){return 'Stun'}
    icon(buff: Buff<number>){return ICON}
    tooltip(buff: Buff<number>){return 'Unit stunned and can not do any actions.'}
}

class StunProcess extends TypeProcess<number> {
    static readonly instance = new StunProcess

    start(buff: Buff<number>){
        let targ = buff.dst
        let prev = StunProcess._targ2time.get(targ)
        let longest

        if (!prev){
            longest = buff
            targ.pause = true
            let eff = new hEffectAttached(MODEL, targ, 'Overhead')
            StunProcess._targ2eff.set(targ, eff)
        } else {
            longest = prev.data > buff.data ? prev : buff
        }

        StunProcess._targ2time.set(targ, longest)
    }

    period(buff: Buff<number>){}

    cancel(buff: Buff<number>){
        this.finish(buff)
    }

    finish(buff: Buff<number>){
        let targ = buff.dst
        let longest = StunProcess._targ2time.get(targ)

        if (longest == buff){
            targ.pause = false
            let eff = StunProcess._targ2eff.get(targ)
            if (eff)(eff.destroy())
            StunProcess._targ2eff.delete(targ)
            StunProcess._targ2time.delete(targ)
        }
    }

    private static _targ2time = new Map<hUnit, Buff<number>>()
    private static _targ2eff = new Map<hUnit, hEffectAttached>()
}

export let Stun = new Type<number>(StunData.instance,
                                   StunProcess.instance)