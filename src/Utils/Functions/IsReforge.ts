import { Import } from '../Import'

new Import(GetSrc() + '/Utils/IsReforged/Check.toc', 'war3mapImported/IsReforged/Check.toc')
new Import(GetSrc() + '/Utils/IsReforged/CheckSD.fdf', 'war3mapImported/IsReforged/Check.fdf')
new Import(GetSrc() + '/Utils/IsReforged/CheckHD.fdf', '_HD.w3mod/war3mapImported/IsReforged/Check.fdf')
let is_reforged: boolean

if (IsGame()){
    if (!BlzLoadTOCFile('war3mapImported/IsReforged/Check.toc')){
        error('IsReforged: can not load checker .toc file')
    }
    is_reforged = GetLocalizedString("ASSET_MODE") == 'HD'
}

// Get graphics mode for local player
export function isReforged(this:void){
    return is_reforged
}