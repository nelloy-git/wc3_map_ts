import { Action, ActionList, getFilePath, Log } from '../Utils'

let __path__ = Macro(getFilePath())

export abstract class SyncData<T extends any[]> {
    constructor(){
        this._id = SyncData._newId()
        SyncData._id2sync.set(this._id, this)

        if (IsGame()){
            for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++){
                BlzTriggerRegisterPlayerSyncEvent(SyncData._trigger, Player(i), this._id, false)
            }
        }

    }

    public send(...data: T): void{
        let raw = this.data2raw(...data)
        BlzSendSyncData(this._id, raw)
    }

    protected abstract data2raw(...data: T): string
    protected abstract raw2data(raw: string): T

    public addAction(callback: (this: void, pl: jplayer, ...data: T)=>void){
        return this._actions.add(callback)
    }

    public removeAction(action: Action<[jplayer, ...T], void>){
        return this._actions.remove(action)
    }

    private _id: string
    private _actions = new ActionList<[jplayer, ...T]>()

    private static runActions(this: void){
        let id = BlzGetTriggerSyncPrefix()
        let sync = SyncData._id2sync.get(id)
        if (!sync){return}

        let pl = GetTriggerPlayer()
        let raw = BlzGetTriggerSyncData()
        let data = sync.raw2data(raw)

        sync._actions.run(pl, ...data)
    }

    private static _id2sync = new Map<string, SyncData<any>>()

    private static _last_id = '!!!!'
    private static _newId(){    
        let p4 = string.byte(SyncData._last_id, 1)
        let p3 = string.byte(SyncData._last_id, 2)
        let p2 = string.byte(SyncData._last_id, 3)
        let p1 = string.byte(SyncData._last_id, 4)
    
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
            return Log.err('no valid ids left.',
                            __path__, undefined, 2)
        }
        SyncData._last_id = string.char(p4) + 
                            string.char(p3) + 
                            string.char(p2) + 
                            string.char(p1)
    
        return SyncData._last_id
    }

    private static _trigger = IsGame() ? ((): jtrigger => {
        let trig = CreateTrigger()
        TriggerAddAction(trig, SyncData.runActions)
        return trig
    })() : <jtrigger><unknown>undefined
}