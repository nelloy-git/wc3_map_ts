import { getFileDir, Import } from "../../../../../Utils"

const __dir__ = Macro(getFileDir())
const dst = Macro(__dir__.substr((<string>GetSrc()).length)) + '/'
const src = Macro(__dir__ + '/')

let Tile: string[] = []

Tile.push((new Import(src + '00x00.dds', dst + '00x00.dds')).dst)
Tile.push((new Import(src + '00x01.dds', dst + '00x01.dds')).dst)
Tile.push((new Import(src + '00x02.dds', dst + '00x02.dds')).dst)
Tile.push((new Import(src + '00x03.dds', dst + '00x03.dds')).dst)
Tile.push((new Import(src + '01x00.dds', dst + '01x00.dds')).dst)
Tile.push((new Import(src + '01x01.dds', dst + '01x01.dds')).dst)
Tile.push((new Import(src + '01x02.dds', dst + '01x02.dds')).dst)
Tile.push((new Import(src + '01x03.dds', dst + '01x03.dds')).dst)

Tile.push((new Import(src + '02x00.dds', dst + '02x00.dds')).dst)
Tile.push((new Import(src + '02x01.dds', dst + '02x01.dds')).dst)
Tile.push((new Import(src + '02x02.dds', dst + '02x02.dds')).dst)
Tile.push((new Import(src + '02x03.dds', dst + '02x03.dds')).dst)
Tile.push((new Import(src + '03x00.dds', dst + '03x00.dds')).dst)
Tile.push((new Import(src + '03x01.dds', dst + '03x01.dds')).dst)
Tile.push((new Import(src + '03x02.dds', dst + '03x02.dds')).dst)
Tile.push((new Import(src + '03x03.dds', dst + '03x03.dds')).dst)

export { Tile }