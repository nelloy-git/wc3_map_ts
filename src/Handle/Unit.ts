import { Vec2, Vec3 } from '../Math'
import { EventActions, EventActionsMap, Color, id2int } from "../Utils";
import { Handle } from "./Handle";
import { hTrigger } from './Trigger';
import { hTriggerEvent } from './TriggerEvent';
import { getEventList, getJEvent, getJUnit, Event as jEvent } from './Utils/UnitEvents'

export class hUnit extends Handle<junit>{
    constructor(type_id: number, owner: jplayer){
        super(CreateUnit(owner, type_id, 0, 0, 0))
        this.type_id = type_id
        this.actions = new EventActions(<hUnit>this, tostring(this.handle))
        
        this.__color = new Color()
        this.__modelScale = 1
        this.__pause_counter = 0
        this.__animation_scale = 1

        // Enable Z coord
        UnitAddAbility(this.handle, id2int('Arav'))
        UnitRemoveAbility(this.handle, id2int('Arav'))
    }

    static get(id: junit | number| undefined){
        return Handle.get(id, 'unit') as hUnit | undefined
    }

    toString(){
        return hUnit.name + '<' + this.id + '>'
    }

    get pos2(){return new Vec2(GetUnitX(this.handle) - 16,
                               GetUnitY(this.handle) - 16)}
    set pos2(v: Vec2){
        SetUnitX(this.handle, v.x + 16)
        SetUnitY(this.handle, v.y + 16)
    }

    get pos(){return new Vec3(GetUnitX(this.handle) - 16,
                              GetUnitY(this.handle) - 16,
                              GetUnitFlyHeight(this.handle))}
    set pos(v: Vec3){
        SetUnitX(this.handle, v.x + 16)
        SetUnitY(this.handle, v.y + 16)
        SetUnitFlyHeight(this.handle, v.z, 0)
    }

    get angle(){return bj_DEGTORAD * GetUnitFacing(this.handle)}
    set angle(a: number){SetUnitFacingTimed(this.handle, bj_RADTODEG * a, 0.01)}

    get life(){return GetUnitState(this.handle, UNIT_STATE_LIFE)}
    set life(val: number){SetUnitState(this.handle, UNIT_STATE_LIFE, val)}
    
    get mana(){return GetUnitState(this.handle, UNIT_STATE_MANA)}
    set mana(val: number){SetUnitState(this.handle, UNIT_STATE_MANA, val)}

    get life_max(){return GetUnitState(this.handle, UNIT_STATE_MAX_LIFE)}
    set life_max(val: number){
        let perc = GetUnitLifePercent(this.handle)
        BlzSetUnitMaxHP(this.handle, val < 1 ? 1 : val)
        SetUnitState(this.handle, UNIT_STATE_LIFE, 0.01 * perc * val)
    }

    get mana_max(){return GetUnitState(this.handle, UNIT_STATE_MAX_MANA)}
    set mana_max(val: number){
        let perc = GetUnitManaPercent(this.handle)
        BlzSetUnitMaxMana(this.handle, val < 1 ? 1 : val)
        SetUnitState(this.handle, UNIT_STATE_MAX_MANA, 0.01 * perc * val)
    }

    get atkDmg_0(){return BlzGetUnitBaseDamage(this.handle, 0)}
    set atkDmg_0(val: number){BlzSetUnitBaseDamage(this.handle, val, 0)}

    get atkDices_0(){return BlzGetUnitDiceNumber(this.handle, 0)}
    set atkDices_0(val: number){BlzSetUnitDiceNumber(this.handle, val, 0)}

    get atkDiceSides_0(){return BlzGetUnitDiceSides(this.handle, 0)}
    set atkDiceSides_0(val: number){BlzSetUnitDiceSides(this.handle, val, 0)}

    get atkCd_0(){return BlzGetUnitAttackCooldown(this.handle, 0)}
    set atkCd_0(val: number){BlzSetUnitAttackCooldown(this.handle, val, 0)}

    get atkDmg_1(){return BlzGetUnitBaseDamage(this.handle, 1)}
    set atkDmg_1(val: number){BlzSetUnitBaseDamage(this.handle, val, 1)}

    get atkDices_1(){return BlzGetUnitDiceNumber(this.handle, 1)}
    set atkDices_1(val: number){BlzSetUnitDiceNumber(this.handle, val, 1)}

    get atkDiceSides_1(){return BlzGetUnitDiceSides(this.handle, 1)}
    set atkDiceSides_1(val: number){BlzSetUnitDiceSides(this.handle, val, 1)}

    get atkCd_1(){return BlzGetUnitAttackCooldown(this.handle, 1)}
    set atkCd_1(val: number){BlzSetUnitAttackCooldown(this.handle, val, 1)}

    get move_spd(){return GetUnitMoveSpeed(this.handle)}
    set move_spd(val: number){SetUnitMoveSpeed(this.handle, val)}

    get color(){return this.__color.copy()}
    set color(color: Color){
        this.__color = color.copy()
        SetUnitVertexColor(this.handle, color.r, color.g, color.b, color.a)
    }

    get owner(){return GetOwningPlayer(this.handle)}
    set owner(player: jplayer){SetUnitOwner(this.handle, player, true)}

    get model_scale(){return this.__modelScale}
    set model_scale(scale: number){
        this.__modelScale = scale
        SetUnitScale(this.handle, scale, scale, scale)
    }

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

    isEnemy(other: hUnit){return IsUnitEnemy(this.handle, other.owner)}
    isAlly(other: hUnit){return IsUnitAlly(this.handle, other.owner)}

    setAnimation(index: number){SetUnitAnimationByIndex(this.handle, index)}
    getCollisionSize(){return BlzGetUnitCollisionSize(this.handle)}

    immediateOrder(order: string){IssueImmediateOrder(this.handle, order)}

    getField(field: junitbooleanfield): boolean
    getField(field: junitintegerfield): number
    getField(field: junitrealfield): number
    getField(field: junitstringfield): string
    getField(field: junitweaponbooleanfield, atk_index: 0 | 1) : boolean
    getField(field: junitweaponintegerfield, atk_index: 0 | 1) : number
    getField(field: junitweaponrealfield, atk_index: 0 | 1) : number
    getField(field: junitweaponstringfield, atk_index: 0 | 1) : string
    getField(field: hUnit.Field, atk_index?: 0 | 1){
        let t = Handle.wcType(field)
        if (t == hUnit.FieldType.boolean){
            return BlzGetUnitBooleanField(this.handle, <junitbooleanfield>field)
        } else if (t == hUnit.FieldType.integer){
            return BlzGetUnitIntegerField(this.handle, <junitintegerfield>field)
        } else if (t == hUnit.FieldType.real){
            return BlzGetUnitRealField(this.handle, <junitrealfield>field)
        } else if (t == hUnit.FieldType.string){
            return BlzGetUnitStringField(this.handle, <junitstringfield>field)
        } else if (t == hUnit.FieldType.boolean_atk){
            return BlzGetUnitWeaponBooleanField(this.handle, <junitweaponbooleanfield>field,
                                                <number>atk_index)
        } else if (t == hUnit.FieldType.integer_atk){
            return BlzGetUnitWeaponIntegerField(this.handle, <junitweaponintegerfield>field,
                                                <number>atk_index)
        } else if (t == hUnit.FieldType.real_atk){
            return BlzGetUnitWeaponRealField(this.handle, <junitweaponrealfield>field,
                                             <number>atk_index)
        } else if (t == hUnit.FieldType.string_atk){
            return BlzGetUnitWeaponStringField(this.handle, <junitweaponstringfield>field,
                                               <number>atk_index)
        }
    }

    setField(val: boolean, field: junitbooleanfield): void
    setField(val: number, field: junitintegerfield): void
    setField(val: number, field: junitrealfield): void
    setField(val: string, field: junitstringfield): void
    setField(val: boolean, field: junitweaponbooleanfield, atk_index: 0 | 1) : void
    setField(val: number, field: junitweaponintegerfield, atk_index: 0 | 1) : void
    setField(val: number, field: junitweaponrealfield, atk_index: 0 | 1) : void
    setField(val: string, field: junitweaponstringfield, atk_index: 0 | 1) : void
    setField(val: hUnit.FieldVal, field: hUnit.Field, atk_index?: 0 | 1){
        let t = Handle.wcType(field)
        if (t == hUnit.FieldType.boolean){
            BlzSetUnitBooleanField(this.handle, <junitbooleanfield>field, <boolean>val)
        } else if (t == hUnit.FieldType.integer){
            BlzSetUnitIntegerField(this.handle, <junitintegerfield>field, Math.floor(<number>val))
        } else if (t == hUnit.FieldType.real){
            BlzSetUnitRealField(this.handle, <junitrealfield>field, <number>val)
        } else if (t == hUnit.FieldType.string){
            BlzSetUnitStringField(this.handle, <junitstringfield>field, <string>val)
        } else if (t == hUnit.FieldType.boolean_atk){
            BlzSetUnitWeaponBooleanField(this.handle, <junitweaponbooleanfield>field,
                                         <number>atk_index, <boolean>val)
        } else if (t == hUnit.FieldType.integer_atk){
            BlzSetUnitWeaponIntegerField(this.handle, <junitweaponintegerfield>field,
                                         <number>atk_index, Math.floor(<number>val))
        } else if (t == hUnit.FieldType.real_atk){
            BlzSetUnitWeaponRealField(this.handle, <junitweaponrealfield>field,
                                         <number>atk_index, <number>val)
        } else if (t == hUnit.FieldType.string_atk){
            BlzSetUnitWeaponStringField(this.handle, <junitweaponstringfield>field,
                                         <number>atk_index, <string>val)
        }
    }

    destroy(){
        RemoveUnit(this.handle)
        super.destroy()
    }
    
    readonly type_id: number
    readonly actions: EventActions<hUnit.Event, hUnit>

    private __color: Color
    private __modelScale: number
    private __pause_counter: number
    private __animation_scale: number
}

export namespace hUnit {
    export const ActionAny = new EventActions<hUnit.Event,
                                              typeof hUnit,
                                              [hUnit]> (hUnit, hUnit.name)
    export const ActionId = new EventActionsMap<number,
                                                hUnit.Event,
                                                typeof hUnit,
                                                [hUnit]> (hUnit, hUnit.name)

    export namespace Group {

        export function inRange(point: Vec2, range: number){
            GroupEnumUnitsInRange(__group, point.x, point.y, range)

            let list: hUnit[] = []
            let u = FirstOfGroup(__group)
            while (u != undefined){
                let hu = hUnit.get(u)
                if (hu != undefined){list.push(hu)}
                GroupRemoveUnit(__group, u)
                u = FirstOfGroup(__group)
            }
    
            return list
        }

        export function inRect(rect: jrect){
            GroupEnumUnitsInRect(__group, rect)

            let list: hUnit[] = []
            let u = FirstOfGroup(__group)
            while (u != undefined){
                let hu = hUnit.get(u)
                if (hu != undefined){list.push(hu)}
                GroupRemoveUnit(__group, u)
                u = FirstOfGroup(__group)
            }

            return list
        }

        const __group: jgroup = <jgroup><unknown> undefined
        if (IsGame()){
            (<jgroup>__group) = CreateGroup()
        }
    }

    export type FieldVal = boolean | number | string
    export type Field = junitbooleanfield | junitintegerfield | junitrealfield |
                        junitstringfield | junitweaponbooleanfield |
                        junitweaponintegerfield | junitweaponrealfield |
                        junitweaponstringfield
    
    export const FieldType = {
        boolean: Handle.wcType(UNIT_BF_DECAYABLE),
        integer: Handle.wcType(UNIT_IF_AGILITY),
        real: Handle.wcType(UNIT_RF_ACQUISITION_RANGE),
        string: Handle.wcType(UNIT_SF_GROUND_TEXTURE),
        boolean_atk: Handle.wcType(UNIT_WEAPON_BF_ATTACKS_ENABLED),
        integer_atk: Handle.wcType(UNIT_WEAPON_IF_ATTACK_AREA_OF_EFFECT_TARGETS),
        real_atk: Handle.wcType(UNIT_WEAPON_RF_ATTACK_AREA_OF_EFFECT_FULL_DAMAGE),
        string_atk: Handle.wcType(UNIT_WEAPON_SF_ATTACK_PROJECTILE_ART),
    }

    export type Event = jEvent

    function __runActions(event: hUnit.Event){
        let unit = hUnit.get(getJUnit(event))
        if (unit == undefined){
            return
        }

        hUnit.ActionAny.run(event, unit)
        hUnit.ActionId.run(unit.type_id, event, unit)
        unit.actions.run(event)
    }

    // Create triggers
    if (IsGame()){
        let event_list = getEventList()

        for (const event_name of event_list){
            let tr = new hTrigger()

            for (let i = 0; i < bj_MAX_PLAYER_SLOTS - 1; i++){
                hTriggerEvent.newPlayerUnitEvent(Player(i), getJEvent(event_name)).applyToTrigger(tr)
            }
            
            tr.actions.add(() => {
                __runActions(event_name)
            })
        }
    }
}


// Apply dispersion
// BlzSetUnitDiceNumber(this.handle, 1, 0)
// this.dispersionDamage = this.__dispersion_damage

// get baseDamage(){return BlzGetUnitBaseDamage(this.handle, 0)}
// set baseDamage(val: number){BlzSetUnitBaseDamage(this.handle, val, 0)}

// get dispersionDamage(){return this.__dispersion_damage}
// set dispersionDamage(val: number){
//     this.__dispersion_damage = val
//     BlzSetUnitDiceSides(this.handle, math.floor(val * this.baseDamage) + 1, 0)
// }

// get attackCooldownDefault(){return this.__attack_cooldown_default}

    // export function getTriggered(){
    //     let u = GetTriggerUnit()
    //     return u ? hUnit.get(u) : undefined
    // }

    // export function getMouseFocus(){
    //     let u = BlzGetMouseFocusUnit()
    //     return u ? hUnit.get(u) : undefined
    // }

    // export function getDamageSource(){
    //     let u = GetEventDamageSource()
    //     return u ? hUnit.get(u) : undefined
    // }

    // export function getDamageTarget(){
    //     let u = BlzGetEventDamageTarget()
    //     return u ? hUnit.get(u) : undefined
    // }

    // export function getEntering(){
    //     let u = GetEnteringUnit()
    //     return u ? hUnit.get(u) : undefined
    // }

    // export function getSpellCaster(){
    //     let u = GetSpellAbilityUnit()
    //     return u ? hUnit.get(u) : undefined
    // }