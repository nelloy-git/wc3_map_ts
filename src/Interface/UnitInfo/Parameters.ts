import * as Frame from "../../FrameExt"
import * as Param from "../../Parameter";
import { Vec2 } from '../../Math'
import { Action, Color } from "../../Utils";
import { IUnit } from "../Unit";

import { InterfaceBorderFdf } from "../Utils/BorderFdf"

const WHITE = new Color()
const GREEN = new Color(50, 200, 50, 255)
const RED = new Color(200, 50, 50, 255)

export class InterfaceUnitParameters extends Frame.Backdrop {
    constructor(){
        super(InterfaceBorderFdf)

        for (let [param, [name, val]] of this._frames){
            name.parent = this
            name.text = param

            val.parent = this
            val.text = '0'
        }

        this.size = this.size
    }

    get unit(){return this.__unit}
    set unit(u: IUnit | undefined){
        if (this.__unit){
            this.__unit.params.actions.remove(this.__changed_action)
        }

        this.__unit = u
        if (!u){return}

        let p = u.params
        this.__changed_action = p.actions.add((p) => {this.__updateValues(p)})
        this.__updateValues(p)
    }

    protected _set_size(size: Vec2){
        super._set_size(size)

        let name_x0 = 0.05 * size.x
        let val_x0 = 0.55 * size.x
        let h = 0.9 * size.y / this._frames.size
        let cell_size = new Vec2(0.45 * size.x, h)

        let i = 0
        for (let [param, [name, val]] of this._frames){
            name.pos = new Vec2(name_x0, 0.05 * size.y + i * h)
            name.size = cell_size
            name.fontSize = 0.9 * h

            val.pos = new Vec2(val_x0, 0.05 * size.y + i * h)
            val.size = cell_size
            val.fontSize = 0.9 * h

            i++
        }
    }

    private __updateValues(params: Param.Container){
        for (let [param, [name, val]] of this._frames){
            let base = params.get(param, 'BAS')
            let res = params.get(param, 'RES')

            let res_col = res == base ? WHITE : res > base ? GREEN : RED

            if (this._percent_param.includes(param)){
                let tmp = res_col.colorText('%.0f%%')
                val.text = string.format(tmp, 100 * res)
            } else {
                let tmp = res_col.colorText('%.0f')
                val.text = string.format(tmp, res)
            }
        }
    }

    private _frames = new Map<Param.Type, [param: Frame.SimpleText, val: Frame.SimpleText]>([
        ['PATK', [new Frame.SimpleText(), new Frame.SimpleText()]],
        ['PSPD', [new Frame.SimpleText(), new Frame.SimpleText()]],
        ['PDEF', [new Frame.SimpleText(), new Frame.SimpleText()]],
        ['PRES', [new Frame.SimpleText(), new Frame.SimpleText()]],

        ['MATK', [new Frame.SimpleText(), new Frame.SimpleText()]],
        ['MSPD', [new Frame.SimpleText(), new Frame.SimpleText()]],
        ['MDEF', [new Frame.SimpleText(), new Frame.SimpleText()]],
        ['MRES', [new Frame.SimpleText(), new Frame.SimpleText()]],
        
        ['LIFE', [new Frame.SimpleText(), new Frame.SimpleText()]],
        ['REGE', [new Frame.SimpleText(), new Frame.SimpleText()]],
        ['MANA', [new Frame.SimpleText(), new Frame.SimpleText()]],
        ['RECO', [new Frame.SimpleText(), new Frame.SimpleText()]],

        ['CRIT', [new Frame.SimpleText(), new Frame.SimpleText()]],
        ['MOVE', [new Frame.SimpleText(), new Frame.SimpleText()]],
    ])

    private _percent_param: Param.Type[] = [
        'PSPD',
        'PRES',
        'MSPD',
        'MRES',
        'CRIT'
    ]

    private __unit: IUnit | undefined
    private __changed_action: Action<[Param.ContainerUnit, Param.Type], void> | undefined
}