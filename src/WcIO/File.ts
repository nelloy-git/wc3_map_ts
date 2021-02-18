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

        let _
        [str, _] = string.gsub(str, '\\', '\\\\');
        [str, _] = string.gsub(str, '\"', '\\\"');
        [str, _] = string.gsub(str, '\n', '\\\n');
        // str = str.replaceAll('\"', '\\\"')
        // str = str.replaceAll('\n', '\\\n')
        // str = str.replaceAll('\\', '\\\\')

        let msg = 'Start\" )\n\t'
        msg += 'call BlzSetAbilityTooltip(1097690227, \"' + str + '\", 0)\n\t'
        msg += 'call Preload( \"End'

        Preload(msg)
        PreloadGenEnd(this.path)
    }

    readonly path: string
}