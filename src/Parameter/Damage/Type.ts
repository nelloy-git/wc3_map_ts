export type DamageType = 'PATK'|'MATK'|'CATK'|'PSPL'|'MSPL'|'CSPL'

export let type2wc = new Map<DamageType, jdamagetype>([
    ['PATK', DAMAGE_TYPE_NORMAL],
    ['MATK', DAMAGE_TYPE_ENHANCED],
    ['CATK', DAMAGE_TYPE_UNIVERSAL],
    ['PSPL', DAMAGE_TYPE_FORCE],
    ['MSPL', DAMAGE_TYPE_MAGIC],
    ['CSPL', DAMAGE_TYPE_UNKNOWN],
])

export let wc2type = new Map<jdamagetype, DamageType>([
    [DAMAGE_TYPE_NORMAL, 'PATK'],
    [DAMAGE_TYPE_ENHANCED, 'MATK'],
    [DAMAGE_TYPE_UNIVERSAL, 'CATK'],
    [DAMAGE_TYPE_FORCE, 'PSPL'],
    [DAMAGE_TYPE_MAGIC, 'MSPL'],
    [DAMAGE_TYPE_UNKNOWN, 'CSPL'],
])