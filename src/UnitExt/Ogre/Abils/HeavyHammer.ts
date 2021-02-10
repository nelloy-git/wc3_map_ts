// import * as Abil from "../../../AbilityExt";
// import * as Buff from "../../../Buff";
// import * as Param from "../../../Parameter";

// import { hTimer, hUnit } from "../../../Handle";
// import { deltaPos, getTurnTime, getFileDir, Log, getFilePath } from "../../../Utils";
// import { HeavyHammerData } from "./Data/HeavyHammer";
// import { AbilityJsonData } from "../../AbilUtils/Json/Data";

// let __path__ = Macro(getFilePath())
// let __dir__ = Macro(getFileDir())

// let json = new AbilityJsonData(__dir__ + '/json/HeavyHammer.json')

// // let NAME = 'Heavy hammer'
// // let ICON = 'ReplaceableTextures\\CommandButtons\\BTNThunderclap.blp'
// // let DIS_ICON = 'ReplaceableTextures\\CommandButtonsDisabled\\DISBTNThunderclap.blp'
// // let TOOLTIP = 'T\no\no\nl\nt\ni\np'
// // let ANIM_INDEX = 6
// // let ANIM_START_TIME = 0.3
// // let ANIM_END_TIME = 0.4
// // let TURN_TIME = 0.5
// // let CAST_TIME = 1.5
// // let TOSS_HEIGHT = 300
// // let TOSS_DUR = 1.5
// // let DMG_MULT = 2

// let Casting = new Abil.TCasting<[Abil.Point]>()

// Casting.start = (abil, target) => {
//     let targ = target[0]
//     let caster = abil.Data.owner

//     let dx = targ.x - caster.x
//     let dy = targ.y - caster.y
//     let angle = Atan2(dy, dx)

//     caster.pause = true
//     caster.angle = angle

//     let area = abil.Data.area / 2
//     let data = new HeavyHammerData(abil, json.animations['strike_Ogre'], abil.Data.range, angle - area, angle + area)
//     data.animation = 'START'
// }

// Casting.casting = (abil, target) => {
//     let data = HeavyHammerData.get(abil)
//     if (!data){
//         return Log.err('data is undefined.',
//                         __path__, abil.Data, 2)
//     }
//     let left = abil.Casting.Timer.left
//     let full = abil.Casting.Timer.fullTime
//     data.progress = 1 - (left / full)

//     // Animation start
//     let startTime = <number>json.animations['strike_Ogre_startTime']
//     if (left < full - startTime && data.animation == 'START'){
//         data.animation = 'PAUSE'
//     }

//     // Animation end
//     let endTime = <number>json.animations['strike_Ogre_endTime']
//     if (left < endTime && data.animation == 'PAUSE'){
//         data.animation = 'END'
//     }
// }

// Casting.cancel = (abil, target) => {
//     let data = HeavyHammerData.get(abil)
//     if (!data){
//         return Log.err(NAME + 
//                        ': data is undefined.')
//     }
//     let prog = data.progress + (ANIM_END_TIME / abil.Casting.Timer.fullTime)
//     data.progress = prog < 1 ? prog : 1
//     data.animation = 'END'
    
//     let t = new hTimer()
//     t.addAction(t => {
//         Casting.finish(abil, target)
//         t.destroy()
//     })
//     t.start(ANIM_END_TIME, false)
// }

// Casting.interrupt = clearCasting

// Casting.finish = (abil, target) => {
//     dealDamage(abil)
//     clearCasting(abil)
// }

// Casting.castingTime = (abil, target) => {
//     let angle: number = math.pi
//     if (target){
//         let targ = target[0]
//         let caster = abil.Data.owner
    
//         let dx = targ.x - caster.x
//         let dy = targ.y - caster.y
//         angle = Atan2(dy, dx)
//         angle = angle >= 0 ? angle : 2 * math.pi + angle
//     }

//     let caster = abil.Data.owner
//     let param = Param.UnitContainer.get(caster)
//     let mspd = param ? param.get('MSPD', 'RES') : 1

//     let turn_time = TURN_TIME * math.abs(angle - caster.angle) / math.pi

//     return math.max(turn_time, ANIM_START_TIME) + CAST_TIME / mspd
// }
// Casting.isTargetValid = (abil, target) => {return true}

// function dealDamage(abil: Abil.IFace<[Abil.Point]>){
//     let data = HeavyHammerData.get(abil)
//     if (!data){
//         return Log.err(NAME + 
//                        ': data is undefined.')
//     }

//     let caster = abil.Data.owner
//     let x = caster.x
//     let y = caster.y
//     let a = caster.angle
//     let w_a = abil.Data.area / 2
//     let progr = data.progress
//     let params = Param.UnitContainer.get(caster)

//     let in_range = hUnit.getInRange(x, y, abil.Data.range)
//     for (let u of in_range){
//         if (caster.isAlly(u)){continue}

//         // Select cone
//         let angle = Atan2(u.y - y, u.x - x)
//         angle = angle >= 0 ? angle : 2 * math.pi + angle
//         if (angle > a - w_a && angle < a + w_a){
//             // Toss Up
//             let buffs = Buff.Container.get(u)
//             if (buffs){
//                 buffs.add(caster, progr * TOSS_DUR, Buff.TossUp, [progr * TOSS_HEIGHT])
//             }
            
//             // Damage
//             if (params){
//                 let patk = params.get('PATK', 'RES')
//                 Param.Damage.deal(caster, u, progr * DMG_MULT * patk, 'PSPL', WEAPON_TYPE_METAL_HEAVY_BASH)
//             }
//         }
//     }
// }

// function clearCasting(abil: Abil.IFace<[Abil.Point]>){
//     let data = HeavyHammerData.get(abil)
//     if (!data){
//         return Log.err(NAME + 
//                        ': data is undefined.')
//     }
//     data.destroy()

//     let caster = abil.Data.owner
//     caster.pause = false
// }

// let Data = new Abil.TData()

// Data.name = (abil) => {return NAME}
// Data.iconNormal = (abil) => {return ICON}
// Data.iconDisabled = (abil) => {return DIS_ICON}
// Data.tooltip = (abil) => {return TOOLTIP}
// Data.lifeCost = (abil) => {return 0}
// Data.manaCost = (abil) => {return 0}
// Data.range = (abil) => {return 250}
// Data.area = (abil) => {return math.pi / 2}
// Data.chargeUsed = (abil) => {return 1}
// Data.chargeMax = (abil) => {return 1}
// Data.chargeCooldown = (abil) => {return 5}
// Data.isAvailable = (abil) => {
//     let controllable = !abil.Data.owner.pause
//     let enough_mana = abil.Data.owner.mana >= abil.Data.mana_cost
//     let charges = abil.Data.Charges.count > 0
//     let casting = abil.Casting.Timer.left <= 0
//     return charges && casting && enough_mana && controllable
// }
// Data.consume = (abil) => {
//     abil.Data.Charges.count -= abil.Data.charges_use
//     abil.Data.owner.mana -= abil.Data.mana_cost
//     return true
// }

// export let HeavyHammer = new Abil.TAbility(Casting, Data, Abil.TTargetingCone )