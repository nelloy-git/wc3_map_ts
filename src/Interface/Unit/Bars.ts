import { Backdrop } from "../../FrameExt";
import { hUnit } from "../../Handle";
import { Color } from "../../Utils";
import { InterfaceAutoBar } from "../Utils/AutoBar";

export class InterfaceUnitBars extends Backdrop {
    constructor(){
        super()

        this.alpha = 0;
        this._life.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor01.blp'
        this._mana.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor02.blp'
    }

    get unit(){return this._unit}
    set unit(u: hUnit | undefined){
        this._life.visible = !(u == undefined)
        this._mana.visible = !(u == undefined)
        this._mag_shield.visible = !(u == undefined)
        this._phys_shield.visible = !(u == undefined)

        if (!u){
            this._life.curGetter = undefined
            this._life.maxGetter = undefined

            this._mana.curGetter = undefined
            this._mana.maxGetter = undefined

            this._mag_shield.curGetter = undefined
            this._mag_shield.maxGetter = undefined

            this._phys_shield.curGetter = undefined
            this._phys_shield.maxGetter = undefined
        } else {
            this._life.curGetter = ():number => {return u.life}
            this._life.maxGetter = ():number => {return u.lifeMax}

            this._mana.curGetter = ():number => {return u.mana}
            this._mana.maxGetter = ():number => {return u.manaMax}
        }

    }

    private _unit: hUnit | undefined
    private _life = new InterfaceAutoBar()
    private _mana = new InterfaceAutoBar()
    private _mag_shield = new InterfaceAutoBar()
    private _phys_shield = new InterfaceAutoBar()
}