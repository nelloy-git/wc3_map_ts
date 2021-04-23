const Enum = {
    PATK: 'PATK',
    MATK: 'MATK',
    CATK: 'CATK',
    PSPL: 'PSPL',
    MSPL: 'MSPL',
    CSPL: 'CSPL',
}

export type Type = keyof typeof Enum

function createList(){
    let l: Type[] = []
    for (const k in Enum){
        l.push(<Type>k)
    }
    return l
}

export const List: ReadonlyArray<Type> = createList()

export const type2wc = new Map<Type, jdamagetype>()
if (IsGame()){
    type2wc.set('PATK', DAMAGE_TYPE_NORMAL)
    type2wc.set('MATK', DAMAGE_TYPE_ENHANCED)
    type2wc.set('CATK', DAMAGE_TYPE_UNIVERSAL)

    type2wc.set('PSPL', DAMAGE_TYPE_FORCE)
    type2wc.set('MSPL', DAMAGE_TYPE_MAGIC)
    type2wc.set('CSPL', DAMAGE_TYPE_UNKNOWN)
}

export const wc2type = new Map<jdamagetype, Type>()
if (IsGame()){
    wc2type.set(DAMAGE_TYPE_NORMAL, 'PATK')
    wc2type.set(DAMAGE_TYPE_ENHANCED, 'MATK')
    wc2type.set(DAMAGE_TYPE_UNIVERSAL, 'CATK')

    wc2type.set(DAMAGE_TYPE_FORCE, 'PSPL')
    wc2type.set(DAMAGE_TYPE_MAGIC, 'MSPL')
    wc2type.set(DAMAGE_TYPE_UNKNOWN, 'CSPL')
}