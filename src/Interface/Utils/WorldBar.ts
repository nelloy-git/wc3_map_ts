// https://www.hiveworkshop.com/threads/genericbar.277605/#resource-37792
// https://www.hiveworkshop.com/threads/hero-glow.326680/#resource-91186

import { BinUnit, getFreeId } from "../../Binary";
import { BinUnitField } from "../../Binary/ObjField/Unit";
import { TimerList } from "../../Handle/Timer/TimerList";
import { Unit } from "../../Handle/Unit";
import { Import } from "../../Utils";

export class WorldBar extends Unit {
    constructor(target: Unit, height: number){
        super(WorldBar._dummy_type.id, target.x, target.y, target.owner)
        this._target = target
        this._height = height
        this.fullness = 1

        this._timer.addAction('PERIOD', () => {this._update()})
        this._timer.start(10^10)
    }

    get target(){return this._target}
    set target(targ: Unit){this._target = targ; this._update()}

    get fullness(){return this._fullness}
    set fullness(val: number){
        this._fullness = val > 1 ? 1 : val < 0 ? 0 : val
        this.setAnimation(Math.floor(100 * this._fullness))
    }

    get height(){return this._height}
    set height(h: number){this._height = h; this._update()}

    destroy(){
        super.destroy()
        WorldBar._timer_list.removeTimerObj(this._timer)
    }

    private _update(){
        this.x = this._target.x
        this.y = this._target.y
        this.z = this._target.z + this._height
    }
    
    private _target: Unit
    private _height: number
    private _fullness: number = 1
    private _timer = WorldBar._timer_list.newTimerObj()

    private static _dummy_type = (() => {
        let dummy = new BinUnit(getFreeId('UNIT'), 'Hpal')
        dummy.setValue(BinUnitField.NormalAbilities, 'Aloc,Abun')
        dummy.setValue(BinUnitField.MovementSpeedBase, 1)
        dummy.setValue(BinUnitField.ModelFile, WorldBar._import_bar.dst)
        return dummy
    })()

    private static _timer_list = new TimerList(0.02)

    private static _import_bar = new Import(GetSrc() + '\\Interface\\Utils\\WorldBar\\generic_bar.mdx',
                                            'war3mapImported\\WorldBar\\generic_bar.mdx')
    private static _import_noglow = new Import(GetSrc() + '\\Interface\\Utils\\WorldBar\\heroglow_bw.dds',
                                               'war3mapImported\\WorldBar\\heroglow_bw.dds')
}