import { Mouse, Selection } from '../../../Input'
import { ImageArc, Timer, Unit } from '../../../Handle'
import { Color, Log } from '../../../Utils'

import { AbilityTargets } from '../../Ability/Iface'
import { Targeting } from '../Targeting'

export class TargetingFriend extends Targeting {
    protected _start(){
        TargetingFriend.enable = true
    }

    protected _cancel(){
        TargetingFriend.enable = false
    }

    protected _finish(targets?: AbilityTargets){
        if (!targets){
            let hovered = Unit.getMouseFocus()
            targets = hovered ? [hovered] : []
        }
        TargetingFriend.enable = false

        if (targets.length != 1 || 
            !(targets[0] instanceof Unit) ||
            targets[0].isEnemy(Targeting.ability.owner)){

            Log.err(TargetingFriend.name + 
                    ': can apply only 1 friendly Unit.', 3)
        }

        return targets
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
    private static _circle = IsGame() ? new ImageArc(72) : undefined

    // Mouse track
    private static _mouseTrack(this: void){
        if (!TargetingFriend._enabled){return}

        let hovered = Unit.getMouseFocus()
        let owner = Targeting.ability?.owner

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
    private static _mouseTimer = IsGame() ? (():Timer=>{
        let t = new Timer()
        t.addAction(TargetingFriend._mouseTrack)
        t.start(0.02, true)
        return t
    })() : undefined
    private static _previous: Unit | undefined;
    private static _highlight: Color = new Color(0.3, 1, 0.3, 1);
    private static _prev_color: Color = new Color(1, 1, 1, 1);
}
