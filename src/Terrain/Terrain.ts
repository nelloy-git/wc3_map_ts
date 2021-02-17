import * as Binary from '../Binary'

export type Terrain = {
    name: string
    icon: string

    types: Binary.tDoodad[]
    data: Binary.Doodad[]
}

export function newTerrainFromBinary