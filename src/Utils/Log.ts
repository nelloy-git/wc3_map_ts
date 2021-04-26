import { FileText } from "./File";

function __format(text: string, lvl?: Log.Level){
    let fmt = '[%.1f] '
    if (lvl){ fmt += '{' + lvl + '} ' }
    fmt += '%s'

    return string.format(fmt, os.clock() - Log.INIT_TIME, text)
}

export function log(msg: string, lvl: Log.Level = 'Msg'){
    let flags = Log.flags[lvl]
    if (!flags){
        flags = {chat: true, file: true, autosave: true}
    }

    msg = __format(msg, lvl)
    if (flags.chat){
        print(msg)
    }
    
    if (flags.file){
        file_buffer.push(msg)
    }

    if (flags.autosave){
        save()
    }
}

export function save(){
    if (IsGame()){
        PreloadGenClear()
        PreloadGenStart()

        Preload("\")\r\n\tDEL " + Log.BAT_OUT_FILE + "\r\n\t(\"")
        Preload("\")\r\n\tDEL " + Log.LOG_OUT_FILE + "\r\n\t(\"")

        for (let i = 0; i < file_buffer.length; i++){
            let bat_msg = string.format("\")\r\n\techo %s >> %s \r\n\t(\"",
                                        file_buffer[i],
                                        Log.BAT_OUT_FILE)
            Preload(bat_msg)
        }

        Preload("\")\r\n\tstart " + Log.BAT_OUT_FILE + "\r\n\t(\"")
        PreloadGenEnd(Log.LOG_OUT_FILE)
    } else {
        let f = new FileText()
        f.data = ''
        for (let i = 0; i < file_buffer.length; i++){
            f.data += file_buffer[i] + '\n'
        }
        f.write(GetDst() + '/../' + Log.BAT_OUT_FILE)
    }
}

const file_buffer: string[] = []

export namespace Log {
    export type Level = 'Msg' | 'Wrn' | 'Err' | 'Info'
    export type Flags = {
        chat: boolean       // print msg in game
        file: boolean       // save msg to file buffer
        autosave: boolean   // save buffer to file when msg received
    }

    type FlagsConfig = Record<Log.Level, Log.Flags>
    export const flags: FlagsConfig = {
        Msg: {chat: true, file: true, autosave: false},
        Wrn: {chat: true, file: true, autosave: false},
        Err: {chat: true, file: true, autosave: true},
        Info: {chat: false, file: true, autosave: false},
    }

    export const INIT_TIME = os.clock()
    export const LOG_OUT_FILE = 'rename_to_bat_and_run.txt'
    export const BAT_OUT_FILE = 'log.txt'
}