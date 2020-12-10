import { Backdrop, FdfBackdrop, SimpleText } from "../../FrameExt";
import { hUnit } from "../../Handle";
import { Parameter, Params, ParamsUnit } from "../../Parameter";
import { ParamContainer } from "../../Parameter/Container";
import { Action, float2str } from "../../Utils";

export class InterfaceUnitParameters extends Backdrop {
    constructor(){
        super(InterfaceUnitParameters._fdf)

        for (let [param, [name, val]] of this._frames){
            name.parent = this
            name.text = param

            val.parent = this
            val.text = '0'
        }

        this.visible = false
        this.size = this.size
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

    get unit(){return this._unit}
    set unit(u: hUnit | undefined){
        if (this._params){
            this._params.removeAction(this._changed_action)
        }

        this._unit = u

        this.visible = false
        if (!u){return}
        this._params = ParamsUnit.get(u)
        if (!this._params){return}

        this._changed_action = this._params.addAction((params)=>{this._updateValues(params)})
        this._updateValues(this._params)

        this.visible = true
    }

    private _updateValues(params: Params){
        for (let [param, [name, val]] of this._frames){
            val.text = Math.floor(params.get(param, 'RES')).toString()
        }
    }

    private _frames = new Map<Parameter.Type, [param: SimpleText, val: SimpleText]>([
        ['PATK', [new SimpleText(), new SimpleText()]],
        ['PSPD', [new SimpleText(), new SimpleText()]],
        ['PDEF', [new SimpleText(), new SimpleText()]],
        ['PRES', [new SimpleText(), new SimpleText()]],

        ['MATK', [new SimpleText(), new SimpleText()]],
        ['MSPD', [new SimpleText(), new SimpleText()]],
        ['MDEF', [new SimpleText(), new SimpleText()]],
        ['MRES', [new SimpleText(), new SimpleText()]],
        
        ['LIFE', [new SimpleText(), new SimpleText()]],
        ['REGE', [new SimpleText(), new SimpleText()]],
        ['MANA', [new SimpleText(), new SimpleText()]],
        ['RECO', [new SimpleText(), new SimpleText()]],

        ['CRIT', [new SimpleText(), new SimpleText()]],
        ['MOVE', [new SimpleText(), new SimpleText()]],
    ])

    private _unit: hUnit | undefined
    private _params: ParamsUnit | undefined;
    private _changed_action: Action<[Params, Parameter.Type], void> | undefined

    private static _fdf = (() => {
        let fdf = new FdfBackdrop(InterfaceUnitParameters.name)
        fdf.width = 0.1
        fdf.height = 0.1
        fdf.backgroundTileMode = true
        fdf.backgroudTileSize = 0.2
        fdf.background = 'UI\\Widgets\\ToolTips\\Human\\human-tooltip-background'
        fdf.blendAll = true
        fdf.insets = [0.001, 0.001, 0.001, 0.001]
        fdf.cornarFlags = ['UL', 'UR', 'BL', 'BR', 'T', 'L', 'B', 'R']
        fdf.cornerSize = 0.0125
        fdf.edgeFile = 'UI\\Widgets\\ToolTips\\Human\\human-tooltip-border'
        return fdf
    })()

    private static _fdf_text = (()=>{

    })()
}