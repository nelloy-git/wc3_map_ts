import { Color, Log, wcType } from "../Utils";
import { Handle } from "./Handle";

export class Unit extends Handle<junit>{
    constructor(unit_id: number, x: number, y: number, owner: jplayer){
        super(CreateUnit(owner, unit_id, x, y, 0))
        this._type_id = unit_id

        // Apply dispersion
        BlzSetUnitDiceNumber(this.handle, 1, 0)
        this.dispersionDamage = this._dispersion_damage

        // Get default attack cooldown
        this._attack_cooldown_default = BlzGetUnitAttackCooldown(this.handle, 0)
    }

    public static get(id: junit | number){
        let instance = Handle.get(id)
        if (!instance){return}
        if (wcType(instance.handle) != 'unit'){
            Log.err('Unit: got wrong type of handle.', 2)
        }
        return <Unit> instance
    }

    public static getMouseFocus(){
        let focus = BlzGetMouseFocusUnit()
        return focus ? Unit.get(focus) : undefined
    }

    get x(){return GetUnitX(this.handle)}
    set x(x: number){SetUnitX(this.handle, x)}

    get y(){return GetUnitY(this.handle)}
    set y(y: number){SetUnitX(this.handle, y)}

    get z(){return GetUnitFlyHeight(this.handle)}
    set z(z: number){SetUnitFlyHeight(this.handle, z, 0)}

    get life(){return GetUnitState(this.handle, UNIT_STATE_LIFE)}
    set life(val: number){SetUnitState(this.handle, UNIT_STATE_LIFE, val)}
    
    get mana(){return GetUnitState(this.handle, UNIT_STATE_MANA)}
    set mana(val: number){SetUnitState(this.handle, UNIT_STATE_MANA, val)}

    get lifeRegen(){return BlzGetUnitRealField(this.handle, UNIT_RF_HIT_POINTS_REGENERATION_RATE)}
    set lifeRegen(val: number){BlzSetUnitRealField(this.handle, UNIT_RF_HIT_POINTS_REGENERATION_RATE, val)}

    get manaRegen(){return BlzGetUnitRealField(this.handle, UNIT_RF_MANA_REGENERATION)}
    set manaRegen(val: number){BlzSetUnitRealField(this.handle, UNIT_RF_MANA_REGENERATION, val)}

    get lifeMax(){return GetUnitState(this.handle, UNIT_STATE_MAX_LIFE)}
    set lifeMax(val: number){
        let perc = GetUnitLifePercent(this.handle)
        BlzSetUnitMaxHP(this.handle, val < 1 ? 1 : val)
        SetUnitState(this.handle, UNIT_STATE_LIFE, 0.01 * perc * val)
    }

    get manaMax(){return GetUnitState(this.handle, UNIT_STATE_MAX_MANA)}
    set manaMax(val: number){
        let perc = GetUnitManaPercent(this.handle)
        BlzSetUnitMaxMana(this.handle, val < 1 ? 1 : val)
        SetUnitState(this.handle, UNIT_STATE_LIFE, 0.01 * perc * val)
    }

    get baseDamage(){return BlzGetUnitBaseDamage(this.handle, 0)}
    set baseDamage(val: number){BlzSetUnitBaseDamage(this.handle, val, 0)}

    get dispersionDamage(){return this._dispersion_damage}
    set dispersionDamage(val: number){
        this._dispersion_damage = val
        BlzSetUnitDiceSides(this.handle, math.floor(val * this.baseDamage) + 1, 0)
    }

    get attackCooldownDefault(){return this._attack_cooldown_default}

    get attackCooldown(){return BlzGetUnitAttackCooldown(this.handle, 0)}
    set attackCooldown(val: number){BlzSetUnitAttackCooldown(this.handle, val, 0)}

    get moveSpeed(){return GetUnitMoveSpeed(this.handle)}
    set moveSpeed(val: number){SetUnitMoveSpeed(this.handle, val)}

    public get color(){return new Color(this._color)}
    public set color(color: Color){
        this._color = new Color(color)
        SetUnitVertexColor(this.handle, math.floor(255 * color.r),
                                        math.floor(255 * color.g),
                                        math.floor(255 * color.b),
                                        math.floor(255 * color.a))
    }

    public get owner(){return GetOwningPlayer(this.handle)}
    public set owner(player: jplayer){SetUnitOwner(this.handle, player, true)}

    public get typeId(){return this._type_id}

    public isEnemy(other: Unit){return IsUnitEnemy(this.handle, other.owner)}
    public isAlly(other: Unit){return IsUnitAlly(this.handle, other.owner)}

    public setAnimation(index: number){SetUnitAnimationByIndex(this.handle, index)}
    public getCollisionSize(){return BlzGetUnitCollisionSize(this.handle)}

    destroy(){
        super.destroy()
        RemoveUnit(this.handle)
    }
    
    private _type_id: number;
    private _color: Color = new Color(1, 1, 1, 1);
    private _dispersion_damage: number = 0.3;
    private _attack_cooldown_default: number;
}