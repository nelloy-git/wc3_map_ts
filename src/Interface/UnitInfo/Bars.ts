import * as Frame from "../../FrameExt";

import { hTimerList, hTimerObj } from "../../Handle";
import { Shield } from "../../Parameter";
import { IUnit } from "../Unit";
import { InterfaceMultiBar } from "../Utils/MultiBar";

export class InterfaceUnitBars extends Frame.SimpleEmpty {
    constructor(){
        super()

        this._timer = InterfaceUnitBars._timer_list.newTimerObj()
        this._timer.addAction('PERIOD', () => {this.update()})
        this._timer.addAction('FINISH', timer => {timer.start(3600)})
        this._timer.start(3600)

        this._life = new InterfaceMultiBar(4)
        this._life.parent = this
        this._life.bar(0).texture = 'Replaceabletextures\\Teamcolor\\Teamcolor06.blp'
        this._life.bar(1).texture = 'Replaceabletextures\\Teamcolor\\Teamcolor17.blp'
        this._life.setBarHeightPart(1, 0.5)
        this._life.bar(2).texture = 'Replaceabletextures\\Teamcolor\\Teamcolor15.blp'
        this._life.setBarHeightPart(2, 0.5)
        this._life.bar(3).texture = 'Replaceabletextures\\Teamcolor\\Teamcolor02.blp'
        this._life.setBarHeightPart(3, 0.5)
        
        this._mana = new Frame.SimpleStatusBarExt()
        this._mana.parent = this
        this._mana.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor01.blp'
        
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
            let max_life = u.lifeMax

            let p_shield = Shield.getCur('PHYS', u)
            let max_p_shield = Shield.getMax('PHYS', u)

            let m_shield = Shield.getCur('MAGIC', u)
            let max_m_shield = Shield.getMax('MAGIC', u)

            let min = Math.min(p_shield, m_shield)
            let max = Math.max(max_p_shield, max_m_shield, max_life)

            this._life.bar(0).fullness = life / max_life
            this._life.bar(1).fullness = p_shield / max
            this._life.bar(2).fullness = m_shield / max
            this._life.bar(3).fullness = min / max
            this._life.text.text = string.format('%.0f / %.0f (%.1f%%)',
                                                 life, max_life, 100 * life / max_life)

            // Mana

            let mana = u.mana
            let max_mana = u.manaMax

            this._mana.fullness = mana / max_mana
            let mana_text = this._mana.getElement('TEXT')
            if (mana_text){
                mana_text.text = string.format('%.0f / %.0f (%.1f%%)',
                                                mana, max_mana, 100 * mana / max_mana)
            }
        }
    }
    
    protected _set_size(size: [w: number, h: number]){
        super._set_size(size)

        let w = size[0]
        let h = size[1] / 2

        this._life.size = [w, h]
        this._life.pos = [0, 0]

        this._mana.size = [w, h]
        this._mana.pos = [0, h]
        let mana_text = this._mana.getElement('TEXT')
        if (mana_text){
            mana_text.fontSize = 0.8 * h
        }
    }

    private _unit: IUnit | undefined

    private _timer: hTimerObj
    private _life: InterfaceMultiBar
    private _mana: Frame.SimpleStatusBarExt

    private static _timer_list: hTimerList = new hTimerList(0.025);
}