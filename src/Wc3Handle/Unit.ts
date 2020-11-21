import { Color } from "../Wc3Utils/index";
import { Handle } from "./Handle";

export class Unit extends Handle<junit>{
    constructor(unit_id: number, x: number, y: number, owner: jplayer){
        super(CreateUnit(owner, unit_id, x, y, 0))
        this._type_id = unit_id
    }

    public get x(){return GetUnitX(this.handle)}
    public set x(x: number){SetUnitX(this.handle, x)}

    public get y(){return GetUnitY(this.handle)}
    public set y(y: number){SetUnitX(this.handle, y)}

    public get z(){return GetUnitFlyHeight(this.handle)}
    public set z(z: number){SetUnitFlyHeight(this.handle, z, 0)}

    public get life(){return GetUnitState(this.handle, UNIT_STATE_LIFE)}
    public set life(val: number){SetUnitState(this.handle, UNIT_STATE_LIFE, val)}

    public get maxLife(){return GetUnitState(this.handle, UNIT_STATE_MAX_LIFE)}
    public set maxLife(val: number){
        let perc = GetUnitLifePercent(this.handle)
        BlzSetUnitMaxHP(this.handle, val < 1 ? 1 : val)
        SetUnitState(this.handle, UNIT_STATE_LIFE, 0.01 * perc * val)
    }

    public get mana(){return GetUnitState(this.handle, UNIT_STATE_MANA)}
    public set mana(val: number){SetUnitState(this.handle, UNIT_STATE_MANA, val)}

    public get maxMana(){return GetUnitState(this.handle, UNIT_STATE_MAX_MANA)}
    public set maxMana(val: number){
        let perc = GetUnitManaPercent(this.handle)
        BlzSetUnitMaxMana(this.handle, val < 1 ? 1 : val)
        SetUnitState(this.handle, UNIT_STATE_LIFE, 0.01 * perc * val)
    }

    public get color(){return new Color(this._color)}
    public set color(color: Color){
        this._color = new Color(color)
        SetUnitVertexColor(this.handle, 255 * color.r, 255 * color.g, 255 * color.b, 255 * color.a)
    }

    public get owner(){return GetOwningPlayer(this.handle)}
    public set owner(player: jplayer){SetUnitOwner(this.handle, player, true)}

    public get typeId(){return this._type_id}

    public isEnemy(other: Unit){return IsUnitEnemy(this.handle, other.owner)}
    public isAlly(other: Unit){return IsUnitAlly(this.handle, other.owner)}

    public setAnimation(index: number){SetUnitAnimationByIndex(this.handle, index)}
    public getCollisionSize(){return BlzGetUnitCollisionSize(this.handle)}

    public destroy(){
        RemoveUnit(this.handle)
        super.destroy()
    }
    
    private _type_id: number;
    private _color: Color = new Color(1, 1, 1, 1);
}