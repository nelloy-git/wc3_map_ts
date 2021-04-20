import { Log, encode64, decode64 } from "../../src/Utils"

const CHUNK_SIZE = 180
const SYNC = 'S_D'

type IOFileCallback = (this: void, path: string, pl: jplayer, data: string) => void

function to32BitHexString(num: number) {
    return string.format('%08X', num);
}

function from32BitHexString(someHexString: string) {
    return tonumber(someHexString, 16) || 0;
}

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

        let enc = encode64(s)
        let chunks_count = math.ceil(enc.length / CHUNK_SIZE);

        let msg = ''
        for (let i = 0; i < enc.length; i++) {
            msg += enc.charAt(i);
            if (msg.length >= CHUNK_SIZE) {
                let chunk = to32BitHexString(math.ceil(i / CHUNK_SIZE))
                let count = to32BitHexString(chunks_count)
                Preload(`")\ncall BlzSendSyncData("${SYNC}","${chunk + count + msg}`);
                msg = "";
            }
        }

        if (msg.length > 0) {
            let chunk = to32BitHexString(chunks_count)
            let count = to32BitHexString(chunks_count)
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

        let chunk = from32BitHexString(raw.substr(0, 8))
        let count = from32BitHexString(raw.substr(8, 8))
        if (this.__data_size < 0){
            this.__data_size = count
        } else if (this.__data_size != count){
            return error(File.name + ' different messages mixed.')
        }


        this.__data_rec++
        this.__data[chunk - 1] = decode64(raw.substr(16))

        if (this.__data_rec < count){
            return
        }

        if (!this.__path || !this.__reader || !this.__cb){
            return error(File.name + ' currupted queue.')
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

    private static __trigger = IsGame() ? ((): jtrigger => {
        let trig = CreateTrigger()
        for (let i = 0; i < GetBJMaxPlayers(); i++) {
            BlzTriggerRegisterPlayerSyncEvent(trig, Player(i), SYNC, false);
        }
        TriggerAddAction(trig, () => {File.__onSync()});
        return trig
    })() : <jtrigger><unknown>undefined
}