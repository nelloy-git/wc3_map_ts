import { getFilePath, Log} from "../Utils";
import { File } from '../WcIO'

import { encode, decode } from './JsonLua/index'

let __path__ = Macro(getFilePath())

export interface JsonFileIFace {
    read(pl: jplayer, callback: (this: void, f: JsonFileIFace)=>void): void
    write(pl: jplayer): void

    readonly data: LuaTable | undefined
}