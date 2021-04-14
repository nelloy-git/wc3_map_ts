import * as Frame from "../../FrameExt";
import { Vec2 } from '../../../src/Utils'

import { hTimerList, hTimerObj } from "../../../src/Handle";
import { Shield } from "../../Parameter";
import { IUnit } from "../Unit";
import { InterfaceMultiBar } from "../Utils/MultiBar";

export class InterfaceUnitBars extends Frame.SimpleEmpty {
    constructor(){
        super()

        this.__timer = InterfaceUnitBars._timer_list.newTimerObj()
        this.__timer.addAction('PERIOD', () => {this.update()})
        this.__timer.addAction('FINISH', timer => {timer.start(3600)})
        this.__timer.start(3600)

        this.__life = new InterfaceMultiBar(4)
        this.__life.parent = this
        this.__life.bar(0).texture = 'Replaceabletextures\\Teamcolor\\Teamcolor06.blp'
        this.__life.bar(1).texture = 'Replaceabletextures\\Teamcolor\\Teamcolor17.blp'
        this.__life.setBarHeightPart(1, 0.5)
        this.__life.bar(2).texture = 'Replaceabletextures\\Teamcolor\\Teamcolor15.blp'
        this.__life.setBarHeightPart(2, 0.5)
        this.__life.bar(3).texture = 'Replaceabletextures\\Teamcolor\\Teamcolor02.blp'
        this.__life.setBarHeightPart(3, 0.5)
        
        this.__mana = new Frame.SimpleStatusBarExt()
        this.__mana.parent = this
        this.__mana.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor01.blp'
        
        this.size = this.size
    }

    get unit(){return this._unit}
    set unit(u: IUnit | undefined){
        this._unit = u
        this.update()
    }

    update(){
        if (this._unit){
            let u = this._unit.obj

            // Life and shield
            let life = u.life
            let max_life = u.life_max

            let p_shield = Shield.getCur('PHYS', u)
            let max_p_shield = Shield.getMax('PHYS', u)

            let m_shield = Shield.getCur('MAGIC', u)
            let max_m_shield = Shield.getMax('MAGIC', u)

            let min = Math.min(p_shield, m_shield)
            let max = Math.max(max_p_shield, max_m_shield, max_life)

            this.__life.bar(0).fullness = life / max_life
            this.__life.bar(1).fullness = p_shield / max
            this.__life.bar(2).fullness = m_shield / max
            this.__life.bar(3).fullness = min / max
            this.__life.text.text = string.format('%.0f / %.0f (%.1f%%)',
                                                 life, max_life, 100 * life / max_life)

            // Mana

            let mana = u.mana
            let max_mana = u.mana_max

            this.__mana.fullness = mana / max_mana
            let mana_text = this.__mana.getElement('TEXT')
            if (mana_text){
                mana_text.text = string.format('%.0f / %.0f (%.1f%%)',
                                                mana, max_mana, 100 * mana / max_mana)
            }
        }
    }
    
    protected _set_size(size: Vec2){
        super._set_size(size)

        this.__life.size = new Vec2(size.x, size.y / 2)
        this.__life.pos = new Vec2(0, 0)

        this.__mana.size = new Vec2(size.x, size.y / 2)
        this.__mana.pos = new Vec2(0, size.y / 2)
        let mana_text = this.__mana.getElement('TEXT')
        if (mana_text){
            mana_text.fontSize = 0.8 * size.y / 2
        }
    }

    private _unit: IUnit | undefined

    private __timer: hTimerObj
    private __life: InterfaceMultiBar
    private __mana: Frame.SimpleStatusBarExt

    private static _timer_list: hTimerList = new hTimerList(0.025);
}