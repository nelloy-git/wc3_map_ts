import * as Frame from "../../FrameExt";

import { hTimerList, hTimerObj, hUnit } from "../../Handle";
import { Shield } from "../../Parameter";
import { Color, float2str } from "../../Utils";
import { InterfaceAutoBar } from "../Utils/AutoBar";
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

    update(){
        if (this._unit){
            let life = this._unit.life
            let max_life = this._unit.lifeMax

            let mana = this._unit.mana
            let max_mana = this._unit.manaMax

            let p_shield = Shield.getCur('PHYS', this._unit)
            let max_p_shield = Shield.getMax('PHYS', this._unit)

            let m_shield = Shield.getCur('MAGIC', this._unit)
            let max_m_shield = Shield.getMax('MAGIC', this._unit)

            let min = Math.min(p_shield, m_shield)
            let max = Math.max(max_p_shield, max_m_shield, max_life)

            this._life.bar(0).fullness = life / max_life
            this._life.bar(1).fullness = p_shield / max
            this._life.bar(2).fullness = m_shield / max
            this._life.bar(3).fullness = min / max
            this._life.text.text = float2str(life, 0) + ' / ' + float2str(max_life, 0) + 
                                   ' (' + float2str(100 * life / max_life, 0) + '%)'

            this._mana.fullness = mana / max_mana
            let mana_text = this._mana.getElement('TEXT')
            if (mana_text){
                mana_text.text = float2str(mana, 0) + ' / ' + float2str(max_mana, 0) + 
                                 ' (' + float2str(100 * mana / max_mana, 0) + '%)'
            }
        }
    }

    get unit(){return this._unit}
    set unit(u: hUnit | undefined){
        this._unit = u
        this.update()
    }

    private _unit: hUnit | undefined

    private _timer: hTimerObj
    private _life: InterfaceMultiBar
    private _mana: Frame.SimpleStatusBarExt

    private static _timer_list: hTimerList = new hTimerList(0.025);
}