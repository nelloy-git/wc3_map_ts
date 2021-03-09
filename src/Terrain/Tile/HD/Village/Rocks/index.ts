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

Tile.push((new Import(src + '04x00.dds', dst + '04x00.dds')).dst)
Tile.push((new Import(src + '04x01.dds', dst + '04x01.dds')).dst)
Tile.push((new Import(src + '04x02.dds', dst + '04x02.dds')).dst)
Tile.push((new Import(src + '04x03.dds', dst + '04x03.dds')).dst)
Tile.push((new Import(src + '05x00.dds', dst + '05x00.dds')).dst)
Tile.push((new Import(src + '05x01.dds', dst + '05x01.dds')).dst)
Tile.push((new Import(src + '05x02.dds', dst + '05x02.dds')).dst)
Tile.push((new Import(src + '05x03.dds', dst + '05x03.dds')).dst)

Tile.push((new Import(src + '06x00.dds', dst + '06x00.dds')).dst)
Tile.push((new Import(src + '06x01.dds', dst + '06x01.dds')).dst)
Tile.push((new Import(src + '06x02.dds', dst + '06x02.dds')).dst)
Tile.push((new Import(src + '06x03.dds', dst + '06x03.dds')).dst)
Tile.push((new Import(src + '07x00.dds', dst + '07x00.dds')).dst)
Tile.push((new Import(src + '07x01.dds', dst + '07x01.dds')).dst)
Tile.push((new Import(src + '07x02.dds', dst + '07x02.dds')).dst)
Tile.push((new Import(src + '07x03.dds', dst + '07x03.dds')).dst)

export { Tile }