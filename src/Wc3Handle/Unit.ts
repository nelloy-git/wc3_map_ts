import { Color } from "../Wc3Utils/index";
import { Handle } from "./Handle";

export class Unit extends Handle{
    constructor(unit_id: number, x: number, y: number, owner: jplayer){
        super(CreateUnit(owner, unit_id, x, y, 0))

        this._owner = owner
        this._unit_id = unit_id
    }

    public handle(){
        return (super.handle() as junit | undefined)
    }

    public setPos(x: number | undefined,
                  y: number | undefined,
                  z: number | undefined){

        let h = this.handle()
        if(!h){ return }
        if (x){ SetUnitX(h, x) }
        if (y){ SetUnitX(h, y) }
        if (z){ SetUnitFlyHeight(h, z, 0) }
    }
    public getX(){
        let h = this.handle()
        return h ? GetUnitX(h) : 0
    }
    public getY(){
        let h = this.handle()
        return h ? GetUnitY(h) : 0
    }
    public getZ(){
        let h = this.handle()
        return h ? GetUnitFlyHeight(h) : 0
    }

    public setLife(val: number){
        let h = this.handle()
        if(h){SetUnitState(h, UNIT_STATE_LIFE, val)}
    }
    public getLife(){
        return this._handle ? GetUnitState(this._handle as junit, UNIT_STATE_LIFE) : 0
    }
    public getMaxLife(){
        return this._handle ? GetUnitState(this._handle as junit, UNIT_STATE_MAX_LIFE) : 0
    }

    public setMana(val: number){
        if(this._handle){SetUnitState(this._handle as junit, UNIT_STATE_MANA, val)}
    }
    public getMana(){
        return this._handle ? GetUnitState(this._handle as junit, UNIT_STATE_MANA) : 0
    }
    public getMaxMana(){
        return this._handle ? GetUnitState(this._handle as junit, UNIT_STATE_MAX_MANA) : 0
    }

    public isEnemy(other: Unit){return (this._handle && other._owner) ? IsUnitEnemy(this._handle as junit, other._owner) : false}
    public isAlly(other: Unit){return (this._handle && other._owner) ? IsUnitAlly(this._handle as junit, other._owner) : false}

    public setColor(color: Color){
        this._color = new Color(color)
        if (this._handle){SetUnitVertexColor(this._handle, color.r, color.g, color.b, color.a)}
    }
    public getColor(){ return new Color(this._color)}
    public setAnimation(index: number){ if(this._handle){SetUnitAnimationByIndex(this._handle, index)} }
    public getCollisionSize(){ return this._handle ? BlzGetUnitCollisionSize(this._handle) : 0}

    public owner(){ return this._owner }
    public unit_id(){ return this._unit_id }

    public destroy(){
        if (!this._handle){ return }
        RemoveUnit(this._handle as junit)

        this._id = undefined
        this._handle = undefined
        this._owner = undefined
        this._unit_id = undefined
    }
    
    private _owner: jplayer | undefined;
    private _unit_id:number | undefined;

    private _color: Color = new Color(1, 1, 1, 1);
}