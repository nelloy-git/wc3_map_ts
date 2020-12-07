import { Mouse, Selection } from '../../../Input'
import { hImageArc, hTimer, hUnit } from '../../../Handle'
import { Color, Log } from '../../../Utils'
import { Targeting } from '../Targeting'

export class TargetingFriend extends Targeting<[hUnit]> {
    protected _start(){
        TargetingFriend.enable = true
    }

    protected _cancel(){
        TargetingFriend.enable = false
    }

    protected _finish(target?: [hUnit]){
        TargetingFriend.enable = false

        let abil = Targeting.getActiveAbility(GetLocalPlayer())
        if (!abil){
            return Log.err(TargetingFriend.name + 
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

    private static get enable(){return TargetingFriend._enabled}
    private static set enable(flag: boolean){
        TargetingFriend._enabled = flag
        Selection.lock(flag)
        if (TargetingFriend._circle){TargetingFriend._circle.visible = flag}
        
        // Restore color if color has not been changed.
        if (!flag &&
            TargetingFriend._previous &&
            TargetingFriend._highlight.compare(TargetingFriend._previous.color)){
            
            TargetingFriend._previous.color = TargetingFriend._prev_color
        }
    }

    private static _enabled = false
    private static _circle = IsGame() ? new hImageArc(72) : undefined

    // Mouse track
    private static _mouseTrack(this: void){
        if (!TargetingFriend._enabled){return}

        let hovered = hUnit.getMouseFocus()
        let owner = Targeting.getActiveAbility(GetLocalPlayer())?.owner

        // Restore color if highlight color has not been changed.
        if (TargetingFriend._previous &&
            TargetingFriend._previous != hovered &&
            TargetingFriend._highlight.compare(TargetingFriend._previous.color)){
            
            TargetingFriend._previous.color = TargetingFriend._prev_color
        }

        let x: number, y: number
        if (hovered && owner?.isAlly(hovered)){
            let color = hovered.color
            TargetingFriend._previous = hovered
            if (!color.compare(TargetingFriend._highlight)){
                TargetingFriend._prev_color = color
                hovered.color = TargetingFriend._highlight
            }

            x = hovered.x
            y = hovered.y
        } else {
            TargetingFriend._previous = undefined
            TargetingFriend._prev_color = new Color(1, 1, 1, 1)

            x = Mouse.getX()
            y = Mouse.getY()
        }

        let size = hovered ? hovered.getCollisionSize() : 32
        TargetingFriend._circle?.setPolarPos(x - size / 2, y - size / 2, size, 0, 2 * math.pi)
    }

    private static _mouseClick(this: void, event: Mouse.Event, pl: jplayer, btn: jmousebuttontype){
        if (pl != GetLocalPlayer()){return}
        if (!TargetingFriend._enabled){return}

        let cur_instance = Targeting.getActiveInstance(pl)
        if(!(cur_instance instanceof TargetingFriend)){return}

        if (btn == MOUSE_BUTTON_TYPE_LEFT){
            cur_instance.finish(pl)
        } else {
            cur_instance.cancel(pl)
        }
    }

    private static _mouseTimer = IsGame() ? (():hTimer=>{
        let t = new hTimer()
        t.addAction(TargetingFriend._mouseTrack)
        t.start(0.02, true)
        return t
    })() : undefined

    private static _mouseAction = Mouse.addAction('UP', TargetingFriend._mouseClick)

    private static _previous: hUnit | undefined;
    private static _highlight: Color = new Color(0.3, 1, 0.3, 1);
    private static _prev_color: Color = new Color(1, 1, 1, 1);
}
