import * as Abil from "../../../AbilityExt";
import * as Param from "../../../Parameter";
import { hTimer, hUnit } from "../../../Handle";
import { getFileDir, Vec2 } from "../../../Utils";

import { VoodooPoisonData } from "../data/VoodooPoison";
import { AbilityData, KeysTree } from "../Data";

const __dir__ = Macro(getFileDir())

const SCALE_CAST_TIME = 'castTime'
const SCALE_DMG = 'dmg'
const SCALE_DUR = 'dur'
const SCALE_TICKS_PER_SEC = 'ticksPerSec'

const ANIM_CAST: KeysTree = ['animation', 'cast']
const ANIM_CAST_DEFAULT_DUR: KeysTree = ['animation', 'castDefaultDur']

const TData = new AbilityData(__dir__ + '/../json/VoodooPoison.json')
TData.checkScale([SCALE_CAST_TIME, SCALE_DMG, SCALE_DUR, SCALE_TICKS_PER_SEC])
TData.checkTree([ANIM_CAST, ANIM_CAST_DEFAULT_DUR])

let Casting = new Abil.TCasting<[Vec2]>()

Casting.start = (abil, target) => {
    let targ = target[0]
    let caster = abil.Data.owner
    let angle = caster.getAngleTo(targ)
    let json = AbilityData.getJson(abil)

    caster.pause = true
    caster.angle = angle

    caster.animation = json.getNumber(ANIM_CAST, 0)
    caster.animation_scale =  json.getNumber(ANIM_CAST_DEFAULT_DUR, 0) / abil.Casting.Timer.fullTime

    new VoodooPoisonData(abil, caster, target[0], abil.Data.area)
}

Casting.casting = (abil, target) => {
    let data = VoodooPoisonData.get(abil)
    data.progress = 1 - (abil.Casting.Timer.left / abil.Casting.Timer.fullTime)
}

function clear(abil: Abil.IFace<[Vec2]>){
    let data = VoodooPoisonData.get(abil)
    if (data){data.detach(); data.destroy()}

    let caster = abil.Data.owner
    caster.pause = false
    caster.animation = 'stand'
    caster.animation_scale = 1
}

Casting.cancel = (abil) => {clear(abil)}
Casting.interrupt = (abil) => {clear(abil)}
Casting.finish = (abil) => {
    let data = VoodooPoisonData.get(abil)
    data.detach()

    let caster = abil.Data.owner
    caster.pause = false
    caster.animation = 'stand'
    caster.animation_scale = 1

    let json = AbilityData.getJson(abil)
    let params = Param.UnitContainer.get(caster)

    let dur = json.getScaled(SCALE_DUR, params)
    let ticks_per_sec = json.getScaled(SCALE_TICKS_PER_SEC, params)
    let dmg = json.getScaled(SCALE_DMG, params)

    let t = new hTimer()
    t.addAction(t => {
        data.time += t.timeout
        if (data.time >= dur){
            data.destroy()
            t.destroy()
        }
        
        let in_range = hUnit.getInRange(data.target, data.area)
        for (const targ of in_range){
            if (targ.isAlly(caster)){continue} 
            Param.Damage.deal(caster, targ, dmg, 'MSPL')
        }
    })
    t.start(1 / ticks_per_sec, true)
}

Casting.castingTime = (abil, target) => {
    let params = Param.UnitContainer.get(abil.Data.owner)
    let json = AbilityData.getJson(abil)

    return json.getScaled(SCALE_CAST_TIME, params)
}
Casting.isTargetValid = (abil, target) => {return true}

export let VoodooPoison = new Abil.TAbility(Casting, TData, Abil.TTargetingArea)