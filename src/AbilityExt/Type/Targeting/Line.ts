// import { Mouse, Selection } from '../../../Input'
// import { hImageArc, hImageLine, hTimer, hUnit } from '../../../Handle'
// import { Color, Log } from '../../../Utils'
// import { TypeTargeting } from '../Targeting2'
// import { Point } from '../../Point'

// export class TypeTargetingLine extends TypeTargeting<[Point]> {
//     static readonly instance = new TypeTargetingLine()

//     protected _start(){
//         TypeTargetingLine.enable = true
//     }

//     protected _cancel(){
//         TypeTargetingLine.enable = false
//     }

//     protected _finish(target?: [Point]){
//         TypeTargetingLine.enable = false

//         let abil = TypeTargeting.getActiveAbility(GetLocalPlayer())
//         if (!abil){
//             return Log.err(TypeTargetingLine.name + 
//                            ': to finish targeting start it first.', 2)
//         }
        
//         let x
//         let y
//         if (target){
//             x = target[0].x
//             y = target[0].y
//         } else {
//             x = Mouse.getX()
//             y = Mouse.getY()
//         }

//         let caster = abil.owner

//         let dx = x - caster.x
//         let dy = y - caster.y
//         let r = math.pow(math.pow(dx, 2) + math.pow(dy, 2), 0.5)

//         let abil_r = abil.type.data.range(abil)
//         if (r > abil_r){
//             let cos = dx / r
//             let sin = dy / r

//             dx = r * cos
//             dy = r * sin

//             x = caster.x + dx
//             y = caster.y + dy
//         }

//         target = [new Point(x, y)]

//         return target
//     }

//     private static get enable(){return TypeTargetingLine._enabled}
//     private static set enable(flag: boolean){
//         TypeTargetingLine._enabled = flag
//         Selection.lock(flag)

//         TypeTargetingLine._line_l.visible = flag
//         TypeTargetingLine._line_r.visible = flag
//         TypeTargetingLine._end_l.visible = flag
//         TypeTargetingLine._end_r.visible = flag
//     }

//     // Mouse track
//     private static _mouseTrack(this: void){
//         if (!TypeTargetingLine._enabled){return}

//         let abil = TypeTargeting.getActiveAbility(GetLocalPlayer())
//         if (!abil){
//             return Log.err(TypeTargetingLine.name + 
//                            ': can not track mouse.', 2)
//         }

//         let start_x = abil.owner.x
//         let start_y = abil.owner.y
//         let end_x = Mouse.getX()
//         let end_y = Mouse.getY()

//         print(start_x, start_y, end_x, end_y)

//         let dx = end_x - start_x
//         let dy = end_y - start_y
//         let a = math.atan2(dy, dx)
//         let w = abil.type.data.area(abil)
//         let r = math.pow(math.pow(dx, 2) + math.pow(dy, 2), 0.5)
//         r = math.min(math.max(r, w), abil.type.data.range(abil))

//         let end_l = TypeTargetingLine._end_l
//         let end_r = TypeTargetingLine._end_r
//         end_l.setPolarPos(end_x, end_y, 2 * w, a - math.pi / 6)
//         end_r.setPolarPos(end_x, end_y, 2 * w, a + math.pi / 6)
//         TypeTargetingLine._line_l.setPolarPos(end_l.x2, end_l.y2, a, r - w)
//         TypeTargetingLine._line_r.setPolarPos(end_r.x2, end_r.y2, a, r - w)
//     }

//     private static _mouseClick(this: void, event: Mouse.Event, pl: jplayer, btn: jmousebuttontype){
//         if (pl != GetLocalPlayer()){return}
//         if (!TypeTargetingLine._enabled){return}

//         let cur_instance = TypeTargeting.getActiveInstance(pl)
//         if(!(cur_instance instanceof TypeTargetingLine)){return}

//         if (btn == MOUSE_BUTTON_TYPE_LEFT){
//             cur_instance.finish(pl)
//         } else {
//             cur_instance.cancel(pl)
//         }
//     }

//     private static _mouseTimer = IsGame() ? (():hTimer=>{
//         let t = new hTimer()
//         t.addAction(TypeTargetingLine._mouseTrack)
//         t.start(0.02, true)
//         return t
//     })() : undefined
//     private static _mouseAction = Mouse.addAction('UP', TypeTargetingLine._mouseClick)

//     private static _enabled = false
//     private static _line_l = IsGame() ? new hImageLine(100) : <hImageLine><unknown>undefined
//     private static _line_r = IsGame() ? new hImageLine(100) : <hImageLine><unknown>undefined
//     private static _end_l = IsGame() ? new hImageLine(20) : <hImageLine><unknown>undefined
//     private static _end_r = IsGame() ? new hImageLine(20) : <hImageLine><unknown>undefined
// }
