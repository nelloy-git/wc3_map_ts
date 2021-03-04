if (!IsGame()){
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3map.doo', 'war3map.doo')
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3map.mmp', 'war3map.mmp')
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3map.shd', 'war3map.shd')
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3map.w3c', 'war3map.w3c')
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3map.w3e', 'war3map.w3e')
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3map.w3i', 'war3map.w3i')
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3map.w3r', 'war3map.w3r')
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3map.wct', 'war3map.wct')
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3map.wpm', 'war3map.wpm')
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3map.wtg', 'war3map.wtg')
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3map.wts', 'war3map.wts')
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3mapMap.blp', 'war3mapMap.blp')
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3mapMisc.txt', 'war3mapMisc.txt')
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3mapUnits.doo', 'war3mapUnits.doo')
}

import * as Abil from './AbilityExt'
import * as Binary from './Binary'
import * as IO from './WcIO'
import * as Json from './Json'
import * as Utils from "./Utils"
                                                                            
import { TestType as TestAbil } from './AbilityExt/TestType'

// import * as UnitType from "./Gameplay/Units/init";

import { Init } from './Interface/Init'
import { TerrainTile, AshenvaleDirt } from './Terrain/Tile/Tile'
import { hTimer } from './Handle'

if (!IsGame()){
    let f = new Utils.FileBinary()
    f.read(GetSrc() + '/Terrain/Preset/Test1.w3m/war3map.w3e')
    let w3e = Binary.w3eFile.fromBinary(f)

    f.read(GetSrc() + '/Terrain/Preset/Test1.w3m/war3map.w3d')
    let w3d = Binary.w3dFile.fromBinary(f)

    f.read(GetSrc() + '/Terrain/Preset/Test1.w3m/war3map.doo')
    let doo = Binary.dooFile.fromBinary(f)

    let ft = new Utils.FileText()
    ft.data = Json.encode(doo.toJson())
    ft.write(GetSrc() + '/test.json')
}

let im = new Utils.Import(GetSrc() + '/Pavement.blp', './war3mapImported/Pavement.blp')

if (IsGame()){

    SetCameraBounds(-3328.0 + GetCameraMargin(CAMERA_MARGIN_LEFT),
                    -3584.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM),
                    3328.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT),
                    3072.0 - GetCameraMargin(CAMERA_MARGIN_TOP),
                    -3328.0 + GetCameraMargin(CAMERA_MARGIN_LEFT),
                    3072.0 - GetCameraMargin(CAMERA_MARGIN_TOP),
                    3328.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT),
                    -3584.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM))
    SetDayNightModels("Environment\\DNC\\DNCLordaeron\\DNCLordaeronTerrain\\DNCLordaeronTerrain.mdl", "Environment\\DNC\\DNCLordaeron\\DNCLordaeronUnit\\DNCLordaeronUnit.mdl")
    InitBlizzard()

    Init()

    let fog = CreateFogModifierRect(Player(0), FOG_OF_WAR_VISIBLE, GetEntireMapRect(), true, true)
    FogModifierStart(fog)

    let tile_top = AshenvaleDirt.tile_01_00
    let tile_bot = AshenvaleDirt.tile_rock

    for (let x = -256; x <= 256; x += 128){
        for (let y = -256; y <= 256; y += 128){
            let t = new TerrainTile(tile_top, tile_bot)
            t.x = x
            t.y = y
        }
    }

    TerrainDeformCrater(128, 128, 128, -400, 1, true)

    // let x = 0
    // let t = new hTimer()
    // Preloader('terrainart\\ashenvale\\ashen_dirt.dds')
    // t.addAction(()=>{
    //     let i = CreateImage(tile_type.dst, 263.3, 263.3, 1, x, 0, 1, 0, 0, 0, 4)
    //     SetImageRenderAlways(i, true)
    //     // let u = CreateUbersplat(x, 0, 'Adrt', 255, 255, 255, 255, true, true)
    //     // SetUbersplatRenderAlways(u, true)
    //     x += 128
    // })
    // t.start(1, true)

    // let TestTerrain = Terrain.createFromJson(<LuaHash>json.read())
    // Terrain.apply(TestTerrain)

    // SetTerrainType(4 * 128, 0, FourCC('Adrg'), -1, 2, 1)
    // Preloader('TerrainArt\\Ashenvale\\Ashen_DirtGrass.blp')
    // Preloader('_hd.w3mod\\TerrainArt\\Ashenvale\\Ashen_DirtGrass.blp')
    // SetTerrainType(-4 * 128, 0, FourCC('Alvd'), -1, 2, 1)
    // function cb(this: void, f: Json.JsonFileGame){
    //     print('Here')
    //     print(f)
    //     print(f.data)
    //     print((<LuaHash><unknown>f.data)['types'])
    //     print((<Array<any>>(<LuaHash><unknown>f.data)['types']).length)
    // }

    // let f = new Json.JsonFileGame('test.txt')
    // f.write(Player(0), test2)
    // f.read(Player(0), cb)

}