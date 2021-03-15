import * as Frame from "../../FrameExt"
import * as Param from "../../Parameter";
import { Action } from "../../Utils";
import { IUnit } from "../Unit";

import { InterfaceBorderFdf } from "../Utils/BorderFdf"

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

    get unit(){return this._unit}
    set unit(u: IUnit | undefined){
        if (this._unit){
            this._unit.params.removeAction(this._changed_action)
        }

        this._unit = u
        if (!u){return}

        let p = u.params
        this._changed_action = p.addAction((p) => {this._updateValues(p)})
        this._updateValues(p)
    }

    protected _set_size(size: [w: number, h: number]){
        super._set_size(size)

        let x0 = 0.05 * size[0]
        let y0 = 0.05 * size[1]
        let w = 0.9 * size[0]
        let h = 0.9 * size[1] / this._frames.size

        for (let [param, [name, val]] of this._frames){
            name.pos = [x0, y0]
            name.size = [w / 2, h]
            name.fontSize = 0.9 * h

            val.pos = [x0 + w / 2, y0]
            val.size = [w / 2, h]
            val.fontSize = 0.9 * h

            y0 += h
        }
    }

    private _updateValues(params: Param.Container){
        for (let [param, [name, val]] of this._frames){
            val.text = Math.floor(params.get(param, 'RES')).toString()
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

    private _unit: IUnit | undefined
    private _changed_action: Action<[Param.Container, Param.Type], void> | undefined
}