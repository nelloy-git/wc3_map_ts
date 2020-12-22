import { Mouse, Selection } from '../../../Input'
import { hImageArc, hTimer, hUnit } from '../../../Handle'
import { Color, Log } from '../../../Utils'
import { TypeTargeting } from '../Targeting'

export class TypeTargetingFriend extends TypeTargeting<[hUnit]> {
    static readonly instance = new TypeTargetingFriend()

    protected _start(){
        TypeTargetingFriend.enable = true
    }

    protected _cancel(){
        TypeTargetingFriend.enable = false
    }

    protected _finish(target?: [hUnit]){
        TypeTargetingFriend.enable = false

        let abil = TypeTargeting.getActiveAbility(GetLocalPlayer())
        if (!abil){
            return Log.err(TypeTargetingFriend.name + 
                           ': to finish targeting start it first.', 2)
        }
        
        if (!target){
            let hovered = hUnit.getMouseFocus()
            if (!hovered || hovered.isEnemy(abil.owner)){
                this.cancel(GetLocalPlayer())
                return
            }
            target = [hovered]
        }

        return target
    }

    private static get enable(){return TypeTargetingFriend._enabled}
    private static set enable(flag: boolean){
        TypeTargetingFriend._enabled = flag
        Selection.lock(flag)
        if (TypeTargetingFriend._circle){TypeTargetingFriend._circle.visible = flag}
        
        // Restore color if color has not been changed.
        if (!flag &&
            TypeTargetingFriend._previous &&
            TypeTargetingFriend._highlight.compare(TypeTargetingFriend._previous.color)){
            
            TypeTargetingFriend._previous.color = TypeTargetingFriend._prev_color
        }
    }

    private static _enabled = false
    private static _circle = IsGame() ? new hImageArc(72) : undefined

    // Mouse track
    private static _mouseTrack(this: void){
        if (!TypeTargetingFriend._enabled){return}

        let hovered = hUnit.getMouseFocus()
        let owner = TypeTargeting.getActiveAbility(GetLocalPlayer())?.owner

        // Restore color if highlight color has not been changed.
        if (TypeTargetingFriend._previous &&
            TypeTargetingFriend._previous != hovered &&
            TypeTargetingFriend._highlight.compare(TypeTargetingFriend._previous.color)){
            
            TypeTargetingFriend._previous.color = TypeTargetingFriend._prev_color
        }

        let x: number, y: number
        if (hovered && owner?.isAlly(hovered)){
            let color = hovered.color
            TypeTargetingFriend._previous = hovered
            if (!color.compare(TypeTargetingFriend._highlight)){
                TypeTargetingFriend._prev_color = color
                hovered.color = TypeTargetingFriend._highlight
            }

            x = hovered.x
            y = hovered.y
        } else {
            TypeTargetingFriend._previous = undefined
            TypeTargetingFriend._prev_color = new Color(1, 1, 1, 1)

            x = Mouse.getX()
            y = Mouse.getY()
        }

        let size = hovered ? hovered.getCollisionSize() : 32
        TypeTargetingFriend._circle?.setPolarPos(x - size / 2, y - size / 2, size, 0, 2 * math.pi)
    }

    private static _mouseClick(this: void, event: Mouse.Event, pl: jplayer, btn: jmousebuttontype){
        if (pl != GetLocalPlayer()){return}
        if (!TypeTargetingFriend._enabled){return}

        let cur_instance = TypeTargeting.getActiveInstance(pl)
        if(!(cur_instance instanceof TypeTargetingFriend)){return}

        if (btn == MOUSE_BUTTON_TYPE_LEFT){
            cur_instance.finish(pl)
        } else {
            cur_instance.cancel(pl)
        }
    }

    private static _mouseTimer = IsGame() ? (():hTimer=>{
        let t = new hTimer()
        t.addAction(TypeTargetingFriend._mouseTrack)
        t.start(0.02, true)
        return t
    })() : undefined

    private static _mouseAction = Mouse.addAction('UP', TypeTargetingFriend._mouseClick)

    private static _previous: hUnit | undefined;
    private static _highlight: Color = new Color(0.3, 1, 0.3, 1);
    private static _prev_color: Color = new Color(1, 1, 1, 1);
}
