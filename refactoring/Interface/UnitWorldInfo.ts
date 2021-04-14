import { hTimer, hTrigger, hTriggerEvent, hUnit } from "../../src/Handle";
import { Shield } from "../Parameter";
import { Action, Color } from "../../src/Utils";
import { WorldBar } from "./Utils/WorldBar";

enum BAR_TYPE {
    LIFE,
    MANA,
    PSHIELD,
    MSHELD,
    SHIELD,
    LIFE_BACK,
    MANA_BACK,
}

const BAR_COLOR = {
    [BAR_TYPE.LIFE]: new Color(0.13, 0.75, 0, 0.5),
    [BAR_TYPE.MANA]: new Color(0, 0.26, 1, 0.5),
    [BAR_TYPE.PSHIELD]: new Color(0.96, 165 / 255, 139 / 255, 0.5),
    [BAR_TYPE.MSHELD]: new Color(189 / 255, 0, 1, 0.5),
    [BAR_TYPE.SHIELD]: new Color(27 / 255, 231 / 255, 186 / 255, 0.5),
    [BAR_TYPE.LIFE_BACK]: new Color(0, 0, 0, 0.5),
    [BAR_TYPE.MANA_BACK]: new Color(0, 0, 0, 0.5),
}

const BAR_OFFSET = {
    [BAR_TYPE.LIFE]: <[number, number, number]>[0, 5, 150],
    [BAR_TYPE.MANA]: <[number, number, number]>[0, -5, 145],
    [BAR_TYPE.PSHIELD]: <[number, number, number]>[0, 16.1, 155],
    [BAR_TYPE.MSHELD]: <[number, number, number]>[0, 16.1, 155],
    [BAR_TYPE.SHIELD]: <[number, number, number]>[0, 16, 155],
    [BAR_TYPE.LIFE_BACK]: <[number, number, number]>[0, 5, 149.9],
    [BAR_TYPE.MANA_BACK]: <[number, number, number]>[0, -5, 144.9],
}

function getShieldMax(u: hUnit){
    return Math.max(Shield.getMax('PHYS', u), Shield.getMax('MAGIC', u), u.life)
}

const BAR_FULLNESS = {
    [BAR_TYPE.LIFE]: (u: hUnit) => {return u.life / u.life_max},
    [BAR_TYPE.MANA]: (u: hUnit) => {return u.mana / u.mana_max},
    [BAR_TYPE.PSHIELD]: (u: hUnit) => {return Shield.getCur('PHYS', u) / getShieldMax(u)},
    [BAR_TYPE.MSHELD]: (u: hUnit) => {return Shield.getCur('MAGIC', u) / getShieldMax(u)},
    [BAR_TYPE.SHIELD]: (u: hUnit) => {return Math.min(Shield.getCur('PHYS', u), Shield.getCur('MAGIC', u)) / getShieldMax(u)},
    [BAR_TYPE.LIFE_BACK]: (u: hUnit) => {return 1},
    [BAR_TYPE.MANA_BACK]: (u: hUnit) => {return 1},
}

export class UnitWorldBars {

    constructor(target: hUnit){
        this.__target = target
        this.__upd_action = UnitWorldBars.__update_timer.addAction(()=>{this.__update()})
        UnitWorldBars.__unit2bars.set(target, this)

        this.__bars = []
        for (let t of Object.values(BAR_TYPE)){
            if (typeof t === 'string'){continue}
            this.__bars[t] = this.__createBar(t)
        }
    }
    
    static Init(){
        // Disable default bars
        EnablePreSelect(false, false)

        // Already existed units
        let map = CreateRegion()
        RegionAddRect(map, GetWorldBounds())
        hUnit.getInRect(GetWorldBounds()).forEach(u => {new UnitWorldBars(u)})

        // New bars
        let trigger_new = new hTrigger()
        hTriggerEvent.newEnterRegion(map).applyToTrigger(trigger_new)
        trigger_new.addAction(()=>{
            let u = hUnit.getEntering()
            if (u){new UnitWorldBars(u)}
        })

        // Start update timer
        UnitWorldBars.__update_timer.start(0.02, true)

        // Delete bars
        let trigger_hide = new hTrigger()
        for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++){
            let event = hTriggerEvent.newPlayerUnitEvent(Player(i), EVENT_PLAYER_UNIT_DEATH)
            event.applyToTrigger(trigger_hide)
        }
        trigger_hide.addAction(() => {
            let u = hUnit.getTriggered()
            let bars = UnitWorldBars.get(u)
            if (bars){bars.destroy()}
        })

    }

    static get(u: hUnit | undefined){
        if (!u){return undefined}
        return UnitWorldBars.__unit2bars.get(u)
    }

    destroy(){
        for (let bar of this.__bars){
            bar.destroy()
        }
        UnitWorldBars.__update_timer.removeAction(this.__upd_action)
        UnitWorldBars.__unit2bars.delete(this.__target)
    }

    get visible(){return this.__visible}
    set visible(f: boolean){
        this.__visible = f
        for (let bar of this.__bars){
            bar.visible = f
        }
    }

    private __createBar(type: BAR_TYPE){
        let bar = new WorldBar()
        bar.target = this.__target
        bar.color = BAR_COLOR[type]
        bar.offset = BAR_OFFSET[type]
        return bar
    }

    private __update(){
        for (let t of Object.values(BAR_TYPE)){
            if (typeof t === 'string'){continue}
            this.__bars[t].fullness = BAR_FULLNESS[t](this.__target)
        }
    }

    private __target: hUnit
    private __visible = true
    private __bars: WorldBar[]

    private __upd_action: Action<[hTimer], void>

    private static __update_timer: hTimer = IsGame() ? new hTimer() : <hTimer><unknown>undefined
    private static __unit2bars = new Map<hUnit, UnitWorldBars>()
}