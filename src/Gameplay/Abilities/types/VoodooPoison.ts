import * as Abil from "../../../AbilityExt";
import * as Param from "../../../Parameter";
import { hTimer, hUnit } from "../../../Handle";
import { getFileDir, Vec2 } from "../../../Utils";

import { VoodooPoisonData } from "../data/VoodooPoison";
import { AbilityData, getJson } from "../Data";

const __dir__ = Macro(getFileDir())

const SCALE_CAST_TIME = 'castTime'
const SCALE_DMG = 'dmg'
const SCALE_DUR = 'dur'
const SCALE_TICKS_PER_SEC = 'ticksPerSec'

const ANIM_CAST = ['animation', 'cast']
const ANIM_CAST_DEFAULT_DUR = ['animation', 'castDefaultDur']

const TData = new AbilityData(__dir__ + '/../json/VoodooPoison.json',
                              [SCALE_CAST_TIME, SCALE_DMG, SCALE_DUR, SCALE_TICKS_PER_SEC],
                              [ANIM_CAST, ANIM_CAST_DEFAULT_DUR])

let Casting = new Abil.TCasting<[Vec2]>()

Casting.start = (abil, target) => {
    let caster = abil.Data.owner
    let json = getJson(abil)
    
    let delta = target[0].sub(caster.pos)
    let angle = delta.angle

    caster.pause = true
    caster.angle = angle

    caster.animation = json.data.getNumber(ANIM_CAST, 0)
    caster.animation_scale =  json.data.getNumber(ANIM_CAST_DEFAULT_DUR, 0) / abil.Casting.Timer.fullTime

    new VoodooPoisonData(abil, caster, target[0], abil.Data.area)
}

Casting.casting = (abil, target) => {
    let data = VoodooPoisonData.get(abil)
    data.progress = 1 - (abil.Casting.Timer.left / abil.Casting.Timer.fullTime)
}

Casting.cancel = (abil) => {clear(abil)}
Casting.interrupt = (abil) => {clear(abil)}
Casting.finish = (abil) => {
    let data = VoodooPoisonData.get(abil)
    let caster = abil.Data.owner
    let json = getJson(abil)

    let params = Param.UnitContainer.get(caster)
    let dur = json.getScaled(SCALE_DUR, params)
    let ticks_per_sec = json.getScaled(SCALE_TICKS_PER_SEC, params)
    let dmg = json.getScaled(SCALE_DMG, params)

    stopAnim(caster)
    data.detach()

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
    let json = getJson(abil)

    return json.getScaled(SCALE_CAST_TIME, params)
}
Casting.isTargetValid = (abil, target) => {return true}

function stopAnim(u: hUnit){
    u.pause = false
    u.animation = 'stand'
    u.animation_scale = 1
}

function clear(abil: Abil.IFace<[Vec2]>){
    let data = VoodooPoisonData.get(abil)
    if (data){data.destroy()}
    stopAnim(abil.Data.owner)
}

export let VoodooPoison = new Abil.TAbility(Casting, TData, Abil.TTargetingArea)