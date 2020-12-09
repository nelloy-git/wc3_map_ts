import { Backdrop, FdfBackdrop, SimpleText } from "../../FrameExt";
import { hUnit } from "../../Handle";
import { Parameter, ParamsUnit } from "../../Parameter";
import { ParamContainer } from "../../Parameter/Container";

export class InterfaceUnitParameters extends Backdrop {
    constructor(){
        super(InterfaceUnitParameters._fdf)

        for (let [param, [name, val]] of this._params){
            name.parent = this
            name.textHorzAlignment = 'LEFT'

            val.parent = this
            
        }
    }



    get unit(){return this._unit}
    set unit(u: hUnit | undefined){
        this._unit = u

        this.visible = u != undefined
        if (!u){return}

        let params = ParamsUnit.get(u)
        for (let [param, [name, val]] of this._params){
            
        }
    }

    private _params = new Map<Parameter.Type, [param: SimpleText, val: SimpleText]>([
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

    private static _fdf = (() => {
        let fdf = new FdfBackdrop('InterfaceAbilityPanelBackground')
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
}