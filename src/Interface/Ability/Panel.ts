import { Abil, Container, TTargeting, Casting } from "../../Abil";
import * as Frame from "../../FrameExt";
import * as WcIO from '../../WcIO'
import { Vec2 } from '../../Math'
import { Action, log} from '../../Utils'

import { InterfaceBorderFdf } from "../Utils/BorderFdf"
import { InterfaceAbilityButton } from "./Button";
import { InterfaceCastingBar } from "./CastingBar";
import { InterfaceAbilityTooltip } from "./Tooltip";

export class InterfaceAbilityPanel extends Frame.SimpleEmpty {
    constructor(cols: number, rows: number){
        super()
        this.cols = cols
        this.rows = rows

        this.__casting_bar = new InterfaceCastingBar()
        this.__casting_bar.parent = this

        this.__tooltip = new InterfaceAbilityTooltip()
        this.__tooltip.parent = this
        this.__tooltip.visible = false

        WcIO.Keyboard.actions.add(OSKEY_LCONTROL, 'DOWN', (e, pl, key, meta) => {
            this.__fullTooltip(pl, key, true)
        })

        WcIO.Keyboard.actions.add(OSKEY_LCONTROL, 'UP', (e, pl, key, meta) => {
            this.__fullTooltip(pl, key, false)
        })

        this.__backgrounds = []
        this.__buttons = []
        for (let y = 0; y < rows; y++){
            this.__backgrounds.push([])
            this.__buttons.push([])

            for (let x = 0; x < cols; x++){
                let back = new Frame.Backdrop(InterfaceBorderFdf)
                this.__backgrounds[y].push(back)
                back.parent = this

                let btn = new InterfaceAbilityButton()
                this.__buttons[y].push(btn)
                btn.parent = back
                btn.actions.add('MOUSE_ENTER', ()=>{
                    this.__tooltip.ability = btn.ability
                    this.__tooltip.pos = btn.pos.add(new Vec2(0, -0.005 - this.__tooltip.size.y))
                    this.__tooltip.visible = true
                })
                btn.actions.add('MOUSE_LEAVE', ()=>{
                    this.__tooltip.visible = false
                })

            }
        }
        this.size = this.size
    }

    get abils(){return this.__abils}
    set abils(abils: Container | undefined){
        if (this.__abils){
            let removed = this.__abils.actions.remove(this.__act_added)
            removed = removed && this.__abils.actions.remove(this.__act_removed)

            if (!removed){
                log(this.toString() + ': can not remove actions from previous ability container.', 'Wrn')
            }
        }

        this.__abils = abils
        this.__casting_bar.abils = abils
        this.visible = abils != undefined

        if (!abils){
            return
        }

        this.__act_added = abils.actions.add('ADDED', () => {this.__updateAbils(abils)})
        this.__act_removed = abils.actions.add('REMOVED', () => {this.__updateAbils(abils)})
        this.__updateAbils(abils)
    }

    setKey(x: number, y: number, key: joskeytype | undefined){
        this.__buttons[y][x].key = key
    }

    protected _set_size(size: Vec2){
        super._set_size(size)

        this.__casting_bar.pos = new Vec2(size.x / 4, -size.y / 4)
        this.__casting_bar.size = new Vec2(size.x / 2, size.y / 4)

        let back_size = new Vec2(size.x / this.cols, size.y / this.rows)
        for (let y = 0; y < this.rows; y++){
            for (let x = 0; x < this.cols; x++){
                this.__backgrounds[y][x].pos = new Vec2(x * back_size.x, y * back_size.y)
                this.__backgrounds[y][x].size = back_size

                this.__buttons[y][x].pos = back_size.mult(0.1)
                this.__buttons[y][x].size = back_size.mult(0.8)
            }
        }

        this.__tooltip.size = new Vec2(size.x / 2, 1.5 * size.y)
        this.__tooltip.pos = new Vec2(0, -this.__tooltip.size.y)
    }

    protected _set_visible(f: boolean){
        super._set_visible(f && (this.__abils != undefined))
    }

    protected __updateAbils(abils: Container | undefined){
        let list = abils ? abils.list : undefined

        let i = 0
        for (let y = 0; y < this.rows; y++){
            for (let x = 0; x < this.cols; x++){
                const abil = list ? list.get(i) : undefined
                this.__buttons[y][x].ability = abil
                i++
            }
        }
    }

    private __fullTooltip(pl: jplayer, key: joskeytype, f: boolean){
        if (pl != GetLocalPlayer() || key != OSKEY_LCONTROL){
            return
        }

        this.__tooltip.full = f
        this.__tooltip.ability = this.__tooltip.ability
        this.__tooltip.pos = new Vec2(0, -this.__tooltip.size.y)
    }

    readonly cols: number
    readonly rows: number

    private __abils: Container | undefined
    private __act_added: Action<[Container.Event, Container, Abil<any>], void> | undefined
    private __act_removed: Action<[Container.Event, Container, Abil<any>], void> | undefined

    private __casting_bar: InterfaceCastingBar
    private __backgrounds: Frame.Backdrop[][]
    private __buttons: InterfaceAbilityButton[][]
    private __tooltip: InterfaceAbilityTooltip

    private _mouse_control = WcIO.Mouse.actions.add('UP', (event, pl, btn) => {
        if (btn == MOUSE_BUTTON_TYPE_LEFT){
            let active_targ = TTargeting.activeAbility(pl)
            if (active_targ){
                active_targ.Targeting.finish(pl)
            }
        } else if (btn == MOUSE_BUTTON_TYPE_RIGHT){
            if (this.__abils){
                let active_cast = Casting.getActive(this.__abils.owner)
                if (active_cast){
                    active_cast.Casting.cancel()
                }
            }
        }
    })
}