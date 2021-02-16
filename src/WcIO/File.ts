import { Log } from "../Utils"

export class File {
    constructor(path: string){
        this.path = path
    }

    read(){
        BlzSetAbilityTooltip(1097690227, '', 0)
        Preloader(this.path)
        let str: string | undefined = BlzGetAbilityTooltip(1097690227, 0)

        return str == '' ? str : undefined
    }

    write(str: string){
        PreloadGenClear()
        if (str.indexOf('\"') >= 0 || str.indexOf('\n' || str.indexOf('\\') >= 0) >= 0){
            return Log.err('can not save string with \\n, \" or \\ symbols',
                            undefined, File, 2)
        }

        let msg = 'Start\" )\n\t'
        msg += 'call BlzSetAbilityTooltip(1097690227, \"' + str + '\", 0)\n\t'
        msg += 'call Preload( \"End'

        Preload(msg)
        PreloadGenEnd(this.path)
    }

    readonly path: string
}