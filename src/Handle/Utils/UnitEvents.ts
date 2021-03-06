import type { hUnit } from '../Unit'

export function getJUnit(event: Event){
    let getter = __event2getter.get(event)
    if (!getter){
        return undefined
    }
    return getter()
}

export function getEventList(){
    return Object.keys(__event2const) as Event[]
}

export function getJEvent(event: Event){
    return __event2const[event]
}

export type Event = keyof typeof __event2const

const __event2const = {
    ATTACKED: EVENT_PLAYER_UNIT_ATTACKED,
    RESCUED: EVENT_PLAYER_UNIT_RESCUED,
    DEATH: EVENT_PLAYER_UNIT_DEATH,
    DECAY: EVENT_PLAYER_UNIT_DECAY,
    DETECTED: EVENT_PLAYER_UNIT_DETECTED,
    HIDDEN: EVENT_PLAYER_UNIT_HIDDEN,
    SELECTED: EVENT_PLAYER_UNIT_SELECTED,
    DESELECTED: EVENT_PLAYER_UNIT_DESELECTED,
    CONSTRUCT_START: EVENT_PLAYER_UNIT_CONSTRUCT_START,
    CONSTRUCT_CANCEL: EVENT_PLAYER_UNIT_CONSTRUCT_CANCEL,
    CONSTRUCT_FINISH: EVENT_PLAYER_UNIT_CONSTRUCT_FINISH,
    UPGRADE_START: EVENT_PLAYER_UNIT_UPGRADE_START,
    UPGRADE_CANCEL: EVENT_PLAYER_UNIT_UPGRADE_CANCEL,
    UPGRADE_FINISH: EVENT_PLAYER_UNIT_UPGRADE_FINISH,
    TRAIN_START: EVENT_PLAYER_UNIT_TRAIN_START,
    TRAIN_CANCEL: EVENT_PLAYER_UNIT_TRAIN_CANCEL,
    TRAIN_FINISH: EVENT_PLAYER_UNIT_TRAIN_FINISH,
    RESEARCH_START: EVENT_PLAYER_UNIT_RESEARCH_START,
    RESEARCH_CANCEL: EVENT_PLAYER_UNIT_RESEARCH_CANCEL,
    RESEARCH_FINISH: EVENT_PLAYER_UNIT_RESEARCH_FINISH,
    ISSUED_ORDER: EVENT_PLAYER_UNIT_ISSUED_ORDER,
    ISSUED_POINT_ORDER: EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER,
    ISSUED_TARGET_ORDER: EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER,
    ISSUED_UNIT_ORDER: EVENT_PLAYER_UNIT_ISSUED_UNIT_ORDER,
    SUMMON: EVENT_PLAYER_UNIT_SUMMON,
    DROP_ITEM: EVENT_PLAYER_UNIT_DROP_ITEM,
    PICKUP_ITEM: EVENT_PLAYER_UNIT_PICKUP_ITEM,
    USE_ITEM: EVENT_PLAYER_UNIT_USE_ITEM,
    LOADED: EVENT_PLAYER_UNIT_LOADED,
    DAMAGED: EVENT_PLAYER_UNIT_DAMAGED,
    DAMAGING: EVENT_PLAYER_UNIT_DAMAGING,
    SELL: EVENT_PLAYER_UNIT_SELL,
    CHANGE_OWNER: EVENT_PLAYER_UNIT_CHANGE_OWNER,
    SELL_ITEM: EVENT_PLAYER_UNIT_SELL_ITEM,
    SPELL_CHANNEL: EVENT_PLAYER_UNIT_SPELL_CHANNEL,
    SPELL_CAST: EVENT_PLAYER_UNIT_SPELL_CAST,
    SPELL_EFFECT: EVENT_PLAYER_UNIT_SPELL_EFFECT,
    SPELL_FINISH: EVENT_PLAYER_UNIT_SPELL_FINISH,
    SPELL_ENDCAST: EVENT_PLAYER_UNIT_SPELL_ENDCAST,
    PAWN_ITEM: EVENT_PLAYER_UNIT_PAWN_ITEM,
}

const __event2getter = new Map<Event, () => junit>([
    ['ATTACKED', GetAttackedUnitBJ],
    ['RESCUED', GetTriggerUnit],        // or GetRescuer ???
    ['DEATH', GetDyingUnit],
    ['DECAY', GetDecayingUnit],
    ['DETECTED', GetDetectedUnit],
    ['HIDDEN', GetTriggerUnit],
    ['SELECTED', GetTriggerUnit],
    ['DESELECTED', GetTriggerUnit],
    ['CONSTRUCT_START', GetTriggerUnit],
    ['CONSTRUCT_CANCEL', GetTriggerUnit],
    ['CONSTRUCT_FINISH', GetTriggerUnit],
    ['UPGRADE_START', GetTriggerUnit],
    ['UPGRADE_CANCEL', GetTriggerUnit],
    ['UPGRADE_FINISH', GetTriggerUnit],
    ['TRAIN_START', GetTriggerUnit],
    ['TRAIN_CANCEL', GetTriggerUnit],
    ['TRAIN_FINISH', GetTriggerUnit],
    ['RESEARCH_START', GetTriggerUnit],
    ['RESEARCH_CANCEL', GetTriggerUnit],
    ['RESEARCH_FINISH', GetTriggerUnit],
    ['ISSUED_ORDER', GetTriggerUnit],
    ['ISSUED_POINT_ORDER', GetTriggerUnit],
    ['ISSUED_TARGET_ORDER', GetTriggerUnit],
    ['ISSUED_UNIT_ORDER', GetTriggerUnit],
    ['SUMMON', GetTriggerUnit],
    ['DROP_ITEM', GetManipulatingUnit],
    ['PICKUP_ITEM', GetManipulatingUnit],
    ['USE_ITEM', GetManipulatingUnit],
    ['LOADED', GetLoadedUnit],
    ['DAMAGED', BlzGetEventDamageTarget],
    ['DAMAGING', GetEventDamageSource],
    ['SELL', GetSellingUnit],
    ['CHANGE_OWNER', GetTriggerUnit],
    ['SELL_ITEM', GetManipulatingUnit],
    ['SPELL_CHANNEL', GetSpellAbilityUnit],
    ['SPELL_CAST', GetSpellAbilityUnit],
    ['SPELL_EFFECT', GetSpellAbilityUnit],
    ['SPELL_FINISH', GetSpellAbilityUnit],
    ['SPELL_ENDCAST', GetSpellAbilityUnit],
    ['PAWN_ITEM', GetManipulatingUnit],
])

let __all_events: Record<hUnit.Event, hUnit.Event> = {
    NEW: 'NEW',
    DESTROY: 'DESTROY',
    ATTACKED: 'ATTACKED',
    RESCUED: 'RESCUED',
    DEATH: 'DEATH',
    DECAY: 'DECAY',
    DETECTED: 'DETECTED',
    HIDDEN: 'HIDDEN',
    SELECTED: 'SELECTED',
    DESELECTED: 'DESELECTED',
    CONSTRUCT_START: 'CONSTRUCT_START',
    CONSTRUCT_CANCEL: 'CONSTRUCT_CANCEL',
    CONSTRUCT_FINISH: 'CONSTRUCT_FINISH',
    UPGRADE_START: 'UPGRADE_START',
    UPGRADE_CANCEL: 'UPGRADE_CANCEL',
    UPGRADE_FINISH: 'UPGRADE_FINISH',
    TRAIN_START: 'TRAIN_START',
    TRAIN_CANCEL: 'TRAIN_CANCEL',
    TRAIN_FINISH: 'TRAIN_FINISH',
    RESEARCH_START: 'RESEARCH_START',
    RESEARCH_CANCEL: 'RESEARCH_CANCEL',
    RESEARCH_FINISH: 'RESEARCH_FINISH',
    ISSUED_ORDER: 'ISSUED_ORDER',
    ISSUED_POINT_ORDER: 'ISSUED_POINT_ORDER',
    ISSUED_TARGET_ORDER: 'ISSUED_TARGET_ORDER',
    ISSUED_UNIT_ORDER: 'ISSUED_UNIT_ORDER',
    SUMMON: 'SUMMON',
    DROP_ITEM: 'DROP_ITEM',
    PICKUP_ITEM: 'PICKUP_ITEM',
    USE_ITEM: 'USE_ITEM',
    LOADED: 'LOADED',
    DAMAGED: 'DAMAGED',
    DAMAGING: 'DAMAGING',
    SELL: 'SELL',
    CHANGE_OWNER: 'CHANGE_OWNER',
    SELL_ITEM: 'SELL_ITEM',
    SPELL_CHANNEL: 'SPELL_CHANNEL',
    SPELL_CAST: 'SPELL_CAST',
    SPELL_EFFECT: 'SPELL_EFFECT',
    SPELL_FINISH: 'SPELL_FINISH',
    SPELL_ENDCAST: 'SPELL_ENDCAST',
    PAWN_ITEM: 'PAWN_ITEM',
}

export const event_map: ReadonlyMap<hUnit.Event, hUnit.Event> = 
    new Map(<[hUnit.Event, hUnit.Event][]>Object.entries(__all_events))