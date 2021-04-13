import { Vec2 } from '../Math'
import { Color, id2int } from "../Utils";
import { Handle } from "./Handle";

export class hUnit extends Handle<junit>{
    constructor(type_id: number, owner: jplayer){
        super(CreateUnit(owner, type_id, 0, 0, 0))
        this.type_id = type_id
        this.__color = new Color()
        this.__dispersion_damage = -1
        this.__attack_cooldown_default = BlzGetUnitWeaponRealField(this.handle, UNIT_WEAPON_RF_ATTACK_BASE_COOLDOWN, 0)
        this.__modelScale = 1
        this.__pause_counter = 0
        this.__animation_scale = 1

        // Apply dispersion
        BlzSetUnitDiceNumber(this.handle, 1, 0)
        this.dispersionDamage = this.__dispersion_damage

        // Enable Z coord
        UnitAddAbility(this.handle, id2int('Arav'))
        UnitRemoveAbility(this.handle, id2int('Arav'))
    }

    static get(id: junit | number){
        return Handle.get(id, 'unit') as hUnit | undefined
    }

    get z(){return GetUnitFlyHeight(this.handle)}
    set z(z: number){SetUnitFlyHeight(this.handle, z, 0)}

    get pos(){return new Vec2(GetUnitX(this.handle) - 16, GetUnitY(this.handle) - 16)}
    set pos(v: Vec2){
        SetUnitX(this.handle, v.x + 16)
        SetUnitY(this.handle, v.y + 16)
    }

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

    get dispersionDamage(){return this.__dispersion_damage}
    set dispersionDamage(val: number){
        this.__dispersion_damage = val
        BlzSetUnitDiceSides(this.handle, math.floor(val * this.baseDamage) + 1, 0)
    }

    get attackCooldownDefault(){return this.__attack_cooldown_default}

    get attackCooldown(){return BlzGetUnitAttackCooldown(this.handle, 0)}
    set attackCooldown(val: number){BlzSetUnitAttackCooldown(this.handle, val, 0)}

    get moveSpeed(){return GetUnitMoveSpeed(this.handle)}
    set moveSpeed(val: number){SetUnitMoveSpeed(this.handle, val)}

    get color(){return new Color(this.__color)}
    set color(color: Color){
        this.__color = new Color(color)
        SetUnitVertexColor(this.handle, math.floor(255 * color.r),
                                        math.floor(255 * color.g),
                                        math.floor(255 * color.b),
                                        math.floor(255 * color.a))
    }

    get owner(){return GetOwningPlayer(this.handle)}
    set owner(player: jplayer){SetUnitOwner(this.handle, player, true)}

    get modelScale(){return this.__modelScale}
    set modelScale(scale: number){
        this.__modelScale = scale
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

    get animation_scale(){return this.__animation_scale}
    set animation_scale(scale: number){
        this.__animation_scale = scale
        SetUnitTimeScale(this.handle, scale)
    }

    get pause(){return IsUnitPaused(this.handle)}
    set pause(flag: boolean){
        this.__pause_counter += flag ? 1 : -1
        if (this.__pause_counter < 0){this.__pause_counter = 0}
        PauseUnit(this.handle, this.__pause_counter > 0)
    }

    get typeId(){return this.type_id}

    isEnemy(other: hUnit){return IsUnitEnemy(this.handle, other.owner)}
    isAlly(other: hUnit){return IsUnitAlly(this.handle, other.owner)}

    setAnimation(index: number){SetUnitAnimationByIndex(this.handle, index)}
    getCollisionSize(){return BlzGetUnitCollisionSize(this.handle)}

    immediateOrder(order: string){IssueImmediateOrder(this.handle, order)}

    destroy(){
        RemoveUnit(this.handle)
        super.destroy()
    }
    
    readonly type_id: number
    private __color: Color
    private __dispersion_damage: number
    private __attack_cooldown_default: number
    private __modelScale: number
    private __pause_counter: number
    private __animation_scale: number
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

    export function getSpellCaster(){
        let u = GetSpellAbilityUnit()
        return u ? hUnit.get(u) : undefined
    }

    export function getInRange(point: Vec2, r: number){
        GroupEnumUnitsInRange(_group, point.x, point.y, r)

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