import { hTimer, hTrigger, hTriggerEvent, hUnit } from "../Handle";
import { Shield } from "../Parameter";
import { Color } from "../Utils";
import { WorldBar } from "./Utils/WorldBar";

type BAR_TYPE = {
    LIFE: 0,
    MANA: 1,
    PSHIELD: 2,
    MSHELD: 3,
    SHIELD: 4,
    LIFE_BACK: 5,
    MANA_BACK: 6
}

export class UnitWorldBars {
    constructor(){

    }

    private __createBar(target: hUnit, type: keyof(BAR_TYPE)){
        
    }
}

export namespace InterfaceUnitWorldInfo {
    export function Init(){
        EnablePreSelect(false, false)

        // Already existed units
        let map = CreateRegion()
        RegionAddRect(map, GetWorldBounds())
        let _trigger_event = hTriggerEvent.newEnterRegion(map)

        hUnit.getInRect(GetWorldBounds()).forEach(u => {_createBars(u)})

        // New bars
        let _trigger_new = new hTrigger()
        _trigger_new.addAction(()=>{
            let u = hUnit.getEntering()
            if (u){_createBars(u)}
        })
        _trigger_event.applyToTrigger(_trigger_new)

        // Update
        let timer = new hTimer()
        timer.addAction(()=>{_update()})
        timer.start(0.02, true)

        // Delete
        let trigger_delete = new hTrigger()
        trigger_delete.addAction(() => {
            let u = hUnit.getTriggered()
            if (u){_delete(u)}
        })
        for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++){
            let pl = Player(i)
            let event = hTriggerEvent.newPlayerUnitEvent(pl, EVENT_PLAYER_UNIT_DEATH)
            event.applyToTrigger(trigger_delete)
        }
    }

    function _createBars(u: hUnit){
        let bars = []

        let life = new WorldBar()
        life.target = u
        life.color = new Color(33 / 255, 191 / 255, 0, 0.5)
        life.offsetY = 5
        life.offsetZ = 150

        let life_back = new WorldBar()
        life_back.target = u
        life_back.color = new Color(0, 0, 0, 0.5)
        life_back.offsetY = 5
        life_back.offsetZ = 149.9

        let pshield = new WorldBar()
        pshield.target = u
        pshield.color = new Color(247 / 255, 165 / 255, 139 / 255, 0.5)
        // pshield.scaleY = 0.7
        pshield.offsetY = 16.1
        pshield.offsetZ = 155

        let mshield = new WorldBar()
        mshield.target = u
        mshield.color = new Color(189 / 255, 0, 1, 0.5)
        // mshield.scaleY = 0.7
        mshield.offsetY = 16.1
        mshield.offsetZ = 155

        let shield = new WorldBar()
        shield.target = u
        shield.color = new Color(27 / 255, 231 / 255, 186 / 255, 0.5)
        // shield.scaleY = 0.7
        shield.offsetY = 16
        shield.offsetZ = 155

        let mana = new WorldBar()
        mana.target = u
        mana.color = new Color(0, 66 / 255, 1, 0.5)
        mana.offsetY = -5
        mana.offsetZ = 145

        let mana_back = new WorldBar()
        mana_back.target = u
        mana_back.color = new Color(0, 0, 0, 0.5)
        mana_back.offsetY = -5
        mana_back.offsetZ = 144.9

        bars[LIFE] = life
        bars[MANA] = mana
        bars[PSHIELD] = pshield
        bars[MSHIELD] = mshield
        bars[SHIELD] = shield
        bars[LIFE_BACK] = life_back
        bars[MANA_BACK] = mana_back

        _unit2bars.set(u, bars)
    }

    // function __

    function _update(this: void){
        for (let [u, bars] of _unit2bars){
            let life = u.life
            let max_life = u.lifeMax

            let mana = u.mana
            let max_mana = u.manaMax

            let p_shield = Shield.getCur('PHYS', u)
            let max_p_shield = Shield.getMax('PHYS', u)

            let m_shield = Shield.getCur('MAGIC', u)
            let max_m_shield = Shield.getMax('MAGIC', u)

            let min = Math.min(p_shield, m_shield)
            let max = Math.max(max_p_shield, max_m_shield, max_life)

            bars[LIFE].fullness = life / max_life
            bars[MANA].fullness = mana / max_mana
            bars[PSHIELD].fullness = p_shield / max
            bars[MSHIELD].fullness = m_shield / max
            bars[SHIELD].fullness = min / max
        }
    }

    function _hide(u: hUnit){
        let bars = _unit2bars.get(u)
        if (!bars){return}

        bars.forEach(bar => {
            // TODO
        })
    }

    function _delete(this: void, u: hUnit){
        let bars = _unit2bars.get(u)
        if (!bars){return}

        bars.forEach(bar => {
            bar.destroy()
        })
        _unit2bars.delete(u)
    }

    let LIFE = 0
    let MANA = 1
    let PSHIELD = 2
    let MSHIELD = 3
    let SHIELD = 4
    let LIFE_BACK = 5
    let MANA_BACK = 6
    let _unit2bars = new Map<hUnit, WorldBar[]>()
}