import { Log } from "../Utils"
import { SyncData } from "./SyncData"
import { Utils } from './Utils'

declare function TestFileSync(this: void): void

const CHUNK_SIZE = 180
const SYNC = 'S_D'
// const SYNC_END = 'S_E'

class SyncFile extends SyncData<[number, number, string]>{
    protected data2raw(chunk_pos:number, chunk_size: number, data: string){
        let pos = Utils.to32BitHexString(chunk_pos)
        let size = Utils.to32BitHexString(chunk_size)
        let raw = Utils.encode64(data)

        return Utils.encode64(pos + size + raw)
    }
    protected raw2data(raw: string): [number, number, string]{
        let pos = Utils.from32BitHexString(raw.substr(0, 8))
        let size = Utils.from32BitHexString(raw.substr(8, 8))
        let data = raw.substr(16)

        return [pos, size, data]
    }
}

type IOFileCallback = (this: void, path: string, pl: jplayer, data: string) => void

export class File {
    static read(path: string, pl: jplayer, callback: IOFileCallback){
        this.__read_queue.push({path: path,
                                pl: pl, 
                                cb: callback})
        this.__readFromQueue()
    }

    static write(path: string, pl: jplayer, s: string){
        if (GetLocalPlayer() != pl){
            return
        }

        let enc = Utils.encode64(s)
        let chunks_count = math.ceil(enc.length / CHUNK_SIZE);

        let msg = ''
        for (let i = 0; i < enc.length; i++) {
            msg += enc.charAt(i);
            if (msg.length >= CHUNK_SIZE) {
                let chunk = Utils.to32BitHexString(math.ceil(i / CHUNK_SIZE))
                let count = Utils.to32BitHexString(chunks_count)
                Preload(`")\ncall BlzSendSyncData("${SYNC}","${chunk + count + msg}`);
                msg = "";
            }
        }

        if (msg.length > 0) {
            let chunk = Utils.to32BitHexString(chunks_count)
            let count = Utils.to32BitHexString(chunks_count)
            Preload(`")\ncall BlzSendSyncData("${SYNC}","${chunk + count + msg}`);
        }

        PreloadGenEnd(path);
    }

    private static __readFromQueue(){
        if (this.__path != undefined){
            return
        }
        
        let elem = this.__read_queue.shift()
        if (elem){
            this.__clearState()

            this.__path = elem.path
            this.__reader = elem.pl
            this.__cb = elem.cb
            
            PreloadStart();
            Preloader(this.__path);
            PreloadEnd(1);
        }
    }

    private static __onSync(){
        let raw = BlzGetTriggerSyncData()

        let chunk = Utils.from32BitHexString(raw.substr(0, 8))
        let count = Utils.from32BitHexString(raw.substr(8, 8))
        if (this.__data_size < 0){
            this.__data_size = count
        } else if (this.__data_size != count){
            Log.err('')
        }


        this.__data_rec++
        this.__data[chunk - 1] = Utils.decode64(raw.substr(16))
        // print(chunk, count, this.__data[chunk])

        if (this.__data_rec < count){
            return
        }

        if (!this.__path || !this.__reader || !this.__cb){
            return Log.err('')
        }

        let data = ''
        for (let i = 0; i < this.__data_size; i++){
            data += this.__data[i]
        }

        let cb = this.__cb
        cb(this.__path, this.__reader, data)

        this.__clearState()
        this.__readFromQueue()
    }

    private static __clearState(){
        this.__path = undefined
        this.__reader = undefined
        this.__cb = undefined
        
        this.__data_rec = 0
        this.__data_size = -1
        this.__data = []
    }

    static get path(){return this.__path}
    static get reader(){return this.__reader}
    // static get data(){return this.__data}

    private static __path: string | undefined
    private static __reader: jplayer | undefined
    private static __cb: IOFileCallback | undefined

    private static __data_rec: number
    private static __data_size: number
    private static __data: string[] = []

    private static __read_queue: {path: string, pl: jplayer, cb: IOFileCallback}[] = []

    private static _trigger = IsGame() ? ((): jtrigger => {
        let trig = CreateTrigger()
        for (let i = 0; i < GetBJMaxPlayers(); i++) {
            BlzTriggerRegisterPlayerSyncEvent(trig, Player(i), SYNC, false);
        }
        TriggerAddAction(trig, () => {File.__onSync()});
        return trig
    })() : <jtrigger><unknown>undefined
}