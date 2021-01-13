import { Color, id2int, Log, wcType } from "../Utils";
import { Handle } from "./Handle";

export class hUnit extends Handle<junit>{
    constructor(unit_id: number, x: number, y: number, owner: jplayer){
        super(CreateUnit(owner, unit_id, x, y, 0))
        this._type_id = unit_id

        // Apply dispersion
        BlzSetUnitDiceNumber(this.handle, 1, 0)
        this.dispersionDamage = this._dispersion_damage

        // Get default attack cooldown
        this._attack_cooldown_default = BlzGetUnitAttackCooldown(this.handle, 0)

        // Enable Z coord
        UnitAddAbility(this.handle, id2int('Arav'))
        UnitRemoveAbility(this.handle, id2int('Arav'))
    }
    static get(id: junit | number){
        let instance = Handle.get(id)
        if (!instance){return}
        if (wcType(instance.handle) != 'unit'){
            Log.err('Unit: got wrong type of handle.', 2)
        }
        return <hUnit> instance
    }

    get x(){return GetUnitX(this.handle) - 16}
    set x(x: number){SetUnitX(this.handle, x + 16)}

    get y(){return GetUnitY(this.handle) - 16}
    set y(y: number){SetUnitY(this.handle, y + 16)}

    get z(){return GetUnitFlyHeight(this.handle)}
    set z(z: number){SetUnitFlyHeight(this.handle, z, 0)}

    get angle(){return bj_DEGTORAD * GetUnitFacing(this.handle)}
    set angle(a: number){SetUnitFacingTimed(this.handle, bj_RADTODEG * a, 0.01)}

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
        SetUnitState(this.handle, UNIT_STATE_MAX_MANA, 0.01 * perc * val)
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

    get color(){return new Color(this._color)}
    set color(color: Color){
        this._color = new Color(color)
        SetUnitVertexColor(this.handle, math.floor(255 * color.r),
                                        math.floor(255 * color.g),
                                        math.floor(255 * color.b),
                                        math.floor(255 * color.a))
    }

    get owner(){return GetOwningPlayer(this.handle)}
    set owner(player: jplayer){SetUnitOwner(this.handle, player, true)}

    get modelScale(){return this._modelScale}
    set modelScale(scale: number){
        this._modelScale = scale
        SetUnitScale(this.handle, scale, scale, scale)
    }

    get animation(){Log.wrn(hUnit.name + ': unavailable getter.'); return 0}
    set animation(name_or_id: string|number){
        if (typeof name_or_id == 'string'){
            SetUnitAnimation(this.handle, name_or_id)
        } else {
            SetUnitAnimationByIndex(this.handle, name_or_id)
        }
    }

    get animation_scale(){return this._animation_scale}
    set animation_scale(scale: number){
        this._animation_scale = scale
        SetUnitTimeScale(this.handle, scale)
    }

    get pause(){return IsUnitPaused(this.handle)}
    set pause(flag: boolean){
        this._pause_counter += flag ? 1 : -1
        if (this._pause_counter < 0){this._pause_counter = 0}
        PauseUnit(this.handle, this._pause_counter > 0)
    }

    get typeId(){return this._type_id}

    isEnemy(other: hUnit){return IsUnitEnemy(this.handle, other.owner)}
    isAlly(other: hUnit){return IsUnitAlly(this.handle, other.owner)}

    setAnimation(index: number){SetUnitAnimationByIndex(this.handle, index)}
    getCollisionSize(){return BlzGetUnitCollisionSize(this.handle)}

    immediateOrder(order: string){IssueImmediateOrder(this.handle, order)}

    destroy(){
        RemoveUnit(this.handle)
        super.destroy()
    }
    
    private _type_id: number
    private _color: Color = new Color(1, 1, 1, 1)
    private _dispersion_damage: number = 0.3
    private _attack_cooldown_default: number
    private _modelScale: number = 1
    private _pause_counter: number = 0
    private _animation_scale: number = 1
}

export namespace hUnit {

    export function getTriggered(){
        let u = GetTriggerUnit()
        return u ? hUnit.get(u) : undefined
    }

    export function getMouseFocus(){
        let u = BlzGetMouseFocusUnit()
        return u ? hUnit.get(u) : undefined
    }

    export function getDamageSource(){
        let u = GetEventDamageSource()
        return u ? hUnit.get(u) : undefined
    }

    export function getDamageTarget(){
        let u = BlzGetEventDamageTarget()
        return u ? hUnit.get(u) : undefined
    }

    export function getEntering(){
        let u = GetEnteringUnit()
        return u ? hUnit.get(u) : undefined
    }

    export function getInRange(x: number, y: number, r: number){
        GroupEnumUnitsInRange(_group, x, y, r)

        let list: hUnit[] = []
        let u = FirstOfGroup(_group)
        while (u != undefined){
            let hu = hUnit.get(u)
            if (hu != undefined){list.push(hu)}
            GroupRemoveUnit(_group, u)
            u = FirstOfGroup(_group)
        }

        return list
    }

    export function getInRect(r: jrect){
        GroupEnumUnitsInRect(_group, r)

        let list: hUnit[] = []
        let u = FirstOfGroup(_group)
        while (u != undefined){
            let hu = hUnit.get(u)
            if (hu != undefined){list.push(hu)}
            GroupRemoveUnit(_group, u)
            u = FirstOfGroup(_group)
        }

        return list
    }

    let _group: jgroup = <jgroup><unknown> undefined
    if (IsGame()){
        _group = CreateGroup()
    }
}