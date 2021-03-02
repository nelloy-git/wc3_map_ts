import { getFileDir, Import } from "../../../../../Utils"

const __dir__ = Macro(getFileDir())
const dst = Macro(__dir__.substr((<string>GetSrc()).length)) + '/'
const src = Macro(__dir__ + '/')

export const tile_00_00 = new Import(src + '00_00.dds', dst + '00_00.dds')
export const tile_00_01 = new Import(src + '00_01.dds', dst + '00_01.dds')
export const tile_00_02 = new Import(src + '00_02.dds', dst + '00_02.dds')
export const tile_01_00 = new Import(src + '01_00.dds', dst + '01_00.dds')
export const tile_1 = new Import(src + '1.dds', dst + '1.dds')