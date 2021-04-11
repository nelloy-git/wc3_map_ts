// https://www.hiveworkshop.com/threads/genericbar.277605/#resource-37792
// https://www.hiveworkshop.com/threads/hero-glow.326680/#resource-91186

import { hTimerList, hTimerObj, hUnit } from '../../Handle'
import { hEffect } from '../../Handle'
import { Import, Vec3 } from '../../Utils'

export class WorldBar extends hEffect {
    constructor(){
        super(WorldBar._import_bar.dst, new Vec3(0, 0, 1000))
    }

    get offset(): [number, number, number]{return [this._offset_x, this._offset_y, this._offset_z]}
    set offset(v: [number, number, number]){
        this._offset_x = v[0]
        this._offset_y = v[1]
        this._offset_z = v[2]
        this._update()
    }

    get offsetX(){return this._offset_x}
    set offsetX(x: number){this._offset_x = x; this._update()}

    get offsetY(){return this._offset_y}
    set offsetY(y: number){this._offset_y = y; this._update()}

    get offsetZ(){return this._offset_z}
    set offsetZ(z: number){this._offset_z = z; this._update()}

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
        this._fullness = val
        this.scaleX = this._fullness
    }

    destroy(){
        super.destroy()

        if (this._timer){
            WorldBar._timer_list.removeTimerObj(this._timer)
        }
    }

    private _update(){
        if (this._target){
            this.x = this._target.x + this._offset_x  // TODO default offset
            this.y = this._target.y + this._offset_y  // TODO default offset
            MoveLocation(WorldBar._location, this.x, this.y)
            this.z = this._target.z + GetLocationZ(WorldBar._location) + this._offset_z
        } else {
            this.x = this.x + this._offset_x
            this.y = this.y + this._offset_y
            this.z = this.z + this._offset_z
        }
    }
    
    private _offset_x: number = 0
    private _offset_y: number = 0
    private _offset_z: number = 0
    private _target: hUnit | undefined
    private _fullness: number = 1
    private _timer: hTimerObj | undefined

    private static _timer_list = new hTimerList(0.02)

    private static _import_bar = new Import(GetSrc() + '\\Interface\\Utils\\WorldBar\\generic_bar.mdx',
                                            'war3mapImported\\WorldBar\\generic_bar.mdx')
    private static _import_noglow = new Import(GetSrc() + '\\Interface\\Utils\\WorldBar\\heroglow_bw.dds',
                                               'war3mapImported\\WorldBar\\heroglow_bw.dds')
    private static _location = IsGame() ? (()=>{
        return Location(0, 0)
    })() : <jlocation><unknown>undefined
}