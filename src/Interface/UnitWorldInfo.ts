import { hTimer, hTrigger, hTriggerEvent, hUnit } from "../Handle";
import { WorldBar } from "./Utils/WorldBar";

export namespace InterfaceUnitWorldInfo {
    export function Init(){
        EnablePreSelect(false, false)

        let _trigger = new hTrigger()
        _trigger.addAction(()=>{_createBars()})

        let map = CreateRegion()
        RegionAddRect(map, GetWorldBounds())
        let _trigger_event = hTriggerEvent.newEnterRegion(map)
        _trigger_event.applyToTrigger(_trigger)

        let timer = new hTimer()
        timer.addAction(()=>{_update()})
        timer.start(0.02, true)
    }

    function _createBars(){
        let u = hUnit.getEntering()
        print(u)
        if (!u){return}

        let bars = []
        let life = new WorldBar()
        life.target = u
        life.offsetZ = 180

        bars.push(life)

        _unit2bars.set(u, bars)
    }

    function _update(){
        for (let [u, bars] of _unit2bars){
            bars[0].fullness = u.life / u.lifeMax
            print(bars[0].fullness)
        }
    }

    let _unit2bars = new Map<hUnit, WorldBar[]>()
}