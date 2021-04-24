import { ActionList } from '../../src/Utils'
import { hTrigger, hTriggerEvent } from '../Handle'

export abstract class SyncData<T extends any[]> {
    constructor(){
        this.id = SyncData.__newId()
        this.actions = new ActionList(<SyncData<T>>this, this.toString())

        SyncData.__id2sync.set(this.id, this)
        if (IsGame()){
            for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++){
                let pl = Player(i)
                hTriggerEvent.newPlayerSyncEvent(pl, this.id, false).applyToTrigger(SyncData.__trigger)
            }
        }

    }

    static get(id: string){
        return SyncData.__id2sync.get(id)
    }

    toString(){
        return this.constructor.name + '<' + this.id + '>'
    }

    send(pl: jplayer, ...data: T): void{
        if (pl != GetLocalPlayer()){
            return
        }
        
        let raw = this.data2raw(...data)
        BlzSendSyncData(this.id, raw)
    }

    abstract data2raw(...data: T): string
    abstract raw2data(raw: string): T

    readonly id: string
    readonly actions: ActionList<SyncData<T>, [jplayer, T]>

    private static __runActions(this: void){
        let id = BlzGetTriggerSyncPrefix()
        let sync = SyncData.__id2sync.get(id)
        if (!sync){
            return
        }

        let pl = GetTriggerPlayer()
        let raw = BlzGetTriggerSyncData()
        let data = sync.raw2data(raw)

        sync.actions.run(pl, data)
    }

    private static __id2sync = new Map<string, SyncData<any>>()
    private static __last_id = '!!!!'
    private static __newId(){    
        let p4 = string.byte(SyncData.__last_id, 1)
        let p3 = string.byte(SyncData.__last_id, 2)
        let p2 = string.byte(SyncData.__last_id, 3)
        let p1 = string.byte(SyncData.__last_id, 4)
    
        if (p1 < 96){
            p1++
            while (p1 >= 48 && p1 <= 57){
                p1++
            }
        } else if(p2 < 96){
            p1 = string.byte('!')
            p2++
            while (p2 >= 48 && p2 <= 57){
                p2++
            }
        } else if(p3 < 96){
            p1 = string.byte('!')
            p2 = string.byte('!')
            p3++
            while (p3 >= 48 && p3 <= 57){
                p3++
            }
        } else {
            error(SyncData.name + ': no valid ids left.', 3)
        }
        SyncData.__last_id = string.char(p4) + 
                             string.char(p3) + 
                             string.char(p2) + 
                             string.char(p1)
    
        return SyncData.__last_id
    }

    private static __trigger = IsGame() ? (() => {
        let tr = new hTrigger()
        tr.actions.add(SyncData.__runActions)
        return tr
    })() : <hTrigger><unknown>undefined
}