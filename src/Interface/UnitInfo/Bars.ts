import { Backdrop } from "../../FrameExt";
import { hUnit } from "../../Handle";
import { Shield } from "../../Parameter";
import { InterfaceAutoBar } from "../Utils/AutoBar";

export class InterfaceUnitBars extends Backdrop {
    constructor(){
        super()

        this.alpha = 0;
        this.visible = false

        this._mag_shield.parent = this
        this._mag_shield.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor02.blp'
        
        this._phys_shield.parent = this
        this._phys_shield.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor07.blp'
        
        this._life.parent = this
        this._life.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor00.blp'
        
        this._mana.parent = this
        this._mana.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor01.blp'
        
        this.size = this.size
    }
    
    protected _set_size(size: [w: number, h: number]){
        super._set_size(size)

        let w = size[0]
        let h = size[1] / 4

        this._mag_shield.size = [w, h]
        this._mag_shield.pos = [0, 0]

        this._phys_shield.size = [w, h]
        this._phys_shield.pos = [0, h]

        this._life.size = [w, h]
        this._life.pos = [0, 2 * h]

        this._mana.size = [w, h]
        this._mana.pos = [0, 3 * h]
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

            this._mag_shield.curGetter = ():number => {return Shield.getCur('MAGIC', u)}
            this._mag_shield.maxGetter = ():number => {return Shield.getMax('MAGIC', u)}

            this._phys_shield.curGetter = ():number => {return Shield.getCur('PHYS', u)}
            this._phys_shield.maxGetter = ():number => {return Shield.getMax('PHYS', u)}
        }

    }

    private _unit: hUnit | undefined
    private _life = new InterfaceAutoBar()
    private _mana = new InterfaceAutoBar()
    private _mag_shield = new InterfaceAutoBar()
    private _phys_shield = new InterfaceAutoBar()
}