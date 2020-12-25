// https://www.hiveworkshop.com/threads/genericbar.277605/#resource-37792
// https://www.hiveworkshop.com/threads/hero-glow.326680/#resource-91186

import { hTimerList, hTimerObj, hUnit } from '../../Handle'
import { hEffect } from '../../Handle'
import { Import } from '../../Utils'

export class WorldBar extends hEffect {
    constructor(){
        super(WorldBar._import_bar.dst, 0, 0, 1000)
    }

    get offsetX(){return this._x}
    set offsetX(x: number){this._x = x; this._update()}

    get offsetY(){return this._y}
    set offsetY(y: number){this._y = y; this._update()}

    get offsetZ(){return this._z}
    set offsetZ(z: number){this._z = z; this._update()}

    get target(){return this._target}
    set target(targ: hUnit | undefined){
        if (targ && !this._timer){
            let t = WorldBar._timer_list.newTimerObj()
            t.addAction('PERIOD', ()=>{this._update()})
            t.addAction('FINISH', ()=>{t.start(3600)})
            t.start(3600)
            this._timer = t
        }
        if (!targ && this._timer){
            WorldBar._timer_list.removeTimerObj(this._timer)
        }
        this._target = targ;
        this._update()
    }

    get fullness(){return this._fullness}
    set fullness(val: number){
        let prev = this._fullness
        this._fullness = val > 1 ? 1 : val < 0 ? 0 : val

        this.scaleX = this._fullness / prev
    }

    destroy(){
        super.destroy()

        if (this._timer){
            WorldBar._timer_list.removeTimerObj(this._timer)
        }
    }

    private _update(){
        if (this._target){
            this.x = this._target.x - 16 + this._x  // TODO default offset
            this.y = this._target.y - 16 + this._y  // TODO default offset
            this.z = this._target.z + this._z
        } else {
            this.x = this.x + this._x
            this.y = this.y + this._y
            this.z = this.z + this._z
        }
    }
    
    private _x: number = 0
    private _y: number = 0
    private _z: number = 0
    private _target: hUnit | undefined
    private _fullness: number = 1
    private _timer: hTimerObj | undefined

    private static _timer_list = new hTimerList(0.02)

    private static _import_bar = new Import(GetSrc() + '\\Interface\\Utils\\WorldBar\\generic_bar.mdx',
                                            'war3mapImported\\WorldBar\\generic_bar.mdx')
    private static _import_noglow = new Import(GetSrc() + '\\Interface\\Utils\\WorldBar\\heroglow_bw.dds',
                                               'war3mapImported\\WorldBar\\heroglow_bw.dds')
}