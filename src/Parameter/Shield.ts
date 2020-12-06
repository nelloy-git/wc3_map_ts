import { hUnit } from "../Handle"

export class Shield {

    private static _cur = new Map<jdamagetype, number>

    private static _all_dmg_types = [
        DAMAGE_TYPE_UNKNOWN,
        DAMAGE_TYPE_NORMAL,
        DAMAGE_TYPE_ENHANCED,
        DAMAGE_TYPE_FIRE,
        DAMAGE_TYPE_COLD,
        DAMAGE_TYPE_LIGHTNING,
        DAMAGE_TYPE_POISON,
        DAMAGE_TYPE_DISEASE,
        DAMAGE_TYPE_DIVINE,
        DAMAGE_TYPE_MAGIC,
        DAMAGE_TYPE_SONIC,
        DAMAGE_TYPE_ACID,
        DAMAGE_TYPE_FORCE,
        DAMAGE_TYPE_DEATH,
        DAMAGE_TYPE_MIND,
        DAMAGE_TYPE_PLANT,
        DAMAGE_TYPE_DEFENSIVE,
        DAMAGE_TYPE_DEMOLITION,
        DAMAGE_TYPE_SLOW_POISON,
        DAMAGE_TYPE_SPIRIT_LINK,
        DAMAGE_TYPE_SHADOW_STRIKE,
        DAMAGE_TYPE_UNIVERSAL,
    ]
}