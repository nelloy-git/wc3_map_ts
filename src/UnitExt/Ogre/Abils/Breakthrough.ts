// import * as Abil from "../../../AbilityExt";
// import * as Param from "../../../Parameter";

// import { hItem, hUnit } from "../../../Handle";
// import { id2int, Log } from "../../../Utils";

// let NAME = 'Breakthrough'
// let ICON = 'ReplaceableTextures\\CommandButtons\\BTNStampede.blp'
// let DIS_ICON = 'ReplaceableTextures\\CommandButtonsDisabled\\DISBTNStampede.blp'
// let TOOLTIP = 'T\no\no\nl\nt\ni\np'

// class Casting extends Abil.TCasting<[Abil.Point]> {
//     static readonly instance = new Casting()

//     start(abil: Abil.Ability<[Abil.Point]>): void {
//         let targ = abil.getTarget()[0]

//         let dx = targ.x - abil.owner.x
//         let dy = targ.y - abil.owner.y
//         let r = math.pow(math.pow(dx, 2) + math.pow(dy, 2), 0.5)
//         let cos = dx / r
//         let sin = dy / r
//         let r_x = r * cos
//         let r_y = r * sin

//         let speed =  abil.type.data.range(abil) / abil.type.data.castingTime(abil)
//         let sp_x = speed * cos
//         let sp_y = speed * sin

//         Casting._caster2speed.set(abil.owner, [sp_x, sp_y])
//         Casting._caster2range.set(abil.owner, [r_x, r_y])
//     };

//     casting(abil: Abil.Ability<[Abil.Point]>, dt: number): void {
//         let caster = abil.owner

//         let speed = Casting._caster2speed.get(caster)
//         if (!speed){
//             return Log.err(Casting.name + 
//                            ': speed is undefined.')
//         }
//         let [sp_x, sp_y] = speed

//         let x = caster.x + sp_x
//         let y = caster.y + sp_y
//         Casting._pathChecker.pos = [caster.x + sp_x, caster.y + sp_y]
//         // Collision detected
//         if (Casting._pathChecker.x == x || Casting._pathChecker.y == y){
//             abil.castingFinish()
//         }

//         let r = Casting._caster2range.get(caster)
//         if (!r){
//             return Log.err(Casting.name + 
//                            ': range is undefined.')
//         }

//         let [r_x, r_y] = r
//         r_x -= sp_x
//         r_y -= sp_y

//         // Target point achieved.
//         if (r_x <= 0 || r_y <= 0){
//             abil.castingFinish()
//         }
//         Casting._caster2range.set(caster, [r_x, r_y])
//     };

//     cancel(abil: Abil.Ability<[Abil.Point]>): void {};
//     interrupt(abil: Abil.Ability<[Abil.Point]>): void {};
//     finish(abil: Abil.Ability<[Abil.Point]>): void {};
//     isTargetValid(abil: Abil.Ability<[Abil.Point]>, target: [Abil.Point]): boolean {return true}

//     private static _pathChecker = IsGame() ? (()=>{
//         let it = new hItem(id2int('rat9'), 0, 0)
//         it.visible = false
//         return it
//     })() : <hItem><unknown>undefined
//     private static _caster2speed = new Map<hUnit, [x: number, y: number]>()
//     private static _caster2range = new Map<hUnit, [x: number, y: number]>()
// }

// class Data extends Abil.TData {
//     static readonly instance = new Data()
//     name(abil: Abil.IFace): string {return NAME}
//     iconNormal(abil: Abil.IFace): string {return ICON}
//     iconDisabled(abil: Abil.IFace): string {return DIS_ICON}
//     tooltip(abil: Abil.IFace): string {return TOOLTIP}
//     lifeCost(abil: Abil.IFace): number {return 0}
//     manaCost(abil: Abil.IFace): number {return 0}
//     range(abil: Abil.IFace){return 650}
//     area(abil: Abil.IFace){return 100}
//     chargeUsed(abil: Abil.IFace): number {return 1}
//     chargeMax(abil: Abil.IFace): number {return 1}
//     chargeCooldown(abil: Abil.IFace): number {return 5}
//     castingTime(abil: Abil.IFace): number {
//         let owner = abil.owner
//         let param = Param.Unit.get(abil.owner)
//         let ms = param ? param.get('MOVE', 'RES') : 300
//         let mspd = param ? param.get('MSPD', 'RES') : 1

//         return this.range(abil) / (mspd * ms)
//     }
//     isAvailable(abil: Abil.IFace): boolean {return abil.charges.count > 0}
//     consume(abil: Abil.IFace): boolean {abil.charges.count -= 1; return true}
// }

// export let Breakthrough = new Abil.Type(Casting.instance,
//                                         Data.instance,
//                                         Abil.TypeTargetingFriend.instance)