import { Import } from '../Import'
import { Logger } from '../Logger'
const Log = Logger.Default

new Import(GetSrc() + '/Utils/IsReforged/Check.toc', 'war3mapImported/IsReforged/Check.toc')
new Import(GetSrc() + '/Utils/IsReforged/CheckSD.fdf', 'war3mapImported/IsReforged/Check.fdf')
new Import(GetSrc() + '/Utils/IsReforged/CheckHD.fdf', '_HD.w3mod/war3mapImported/IsReforged/Check.fdf')
let is_reforged: boolean

if (IsGame()){
    if (!BlzLoadTOCFile('war3mapImported/IsReforged/Check.toc')){
        Log.err('IsReforged: can not load checker .toc file')
    }
    is_reforged = GetLocalizedString("ASSET_MODE") == 'HD'
}

export function isReforged(pl: jplayer){
    if (pl != GetLocalPlayer()){
        return Log.err('IsReforged: can be used for local player only.')
    }

    return is_reforged
}