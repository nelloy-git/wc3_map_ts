export type DamageType = 'PATK'|'MATK'|'CATK'|'PSPL'|'MSPL'|'CSPL'

export let type2wc = new Map<DamageType, jdamagetype>()
if (IsGame()){
    type2wc.set('PATK', DAMAGE_TYPE_NORMAL)
    type2wc.set('MATK', DAMAGE_TYPE_ENHANCED)
    type2wc.set('CATK', DAMAGE_TYPE_UNIVERSAL)
    type2wc.set('PSPL', DAMAGE_TYPE_FORCE)
    type2wc.set('MSPL', DAMAGE_TYPE_MAGIC)
    type2wc.set('CSPL', DAMAGE_TYPE_UNKNOWN)
}

export let wc2type = new Map<jdamagetype, DamageType>()
if (IsGame()){
    wc2type.set(DAMAGE_TYPE_NORMAL, 'PATK')
    wc2type.set(DAMAGE_TYPE_ENHANCED, 'MATK')
    wc2type.set(DAMAGE_TYPE_UNIVERSAL, 'CATK')
    wc2type.set(DAMAGE_TYPE_FORCE, 'PSPL')
    wc2type.set(DAMAGE_TYPE_MAGIC, 'MSPL')
    wc2type.set(DAMAGE_TYPE_UNKNOWN, 'CSPL')
}