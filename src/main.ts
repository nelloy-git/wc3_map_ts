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

import { Terrain } from './Terrain'

// import * as UnitType from "./Gameplay/Units/init";

import { Init } from './Interface/Init'
import { hTimer } from './Handle'

let w3e_path = Macro(GetSrc() + '/Terrain/Preset/Test1.w3m/war3map.w3e')
let w3d_path = Macro(GetSrc() + '/Terrain/Preset/Test1.w3m/war3map.w3d')
let doo_path = Macro(GetSrc() + '/Terrain/Preset/Test1.w3m/war3map.doo')

let w3e_bin = new Utils.FileBinary()
let w3d_bin = new Utils.FileBinary()
let doo_bin = new Utils.FileBinary()
if (!IsGame()){
    w3e_bin.read(w3e_path)
    w3d_bin.read(w3d_path)
    doo_bin.read(doo_path)

    w3e_bin.saveCache(w3e_path)
    w3d_bin.saveCache(w3d_path)
    doo_bin.saveCache(doo_path)
} else {
    w3e_bin.loadCache(w3e_path)
    w3d_bin.loadCache(w3d_path)
    doo_bin.loadCache(doo_path)
}

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

    let tm = new hTimer()
    tm.addAction(()=>{

        let w3e = Binary.w3eFile.fromBinary(w3e_bin)
        let w3d = Binary.w3dFile.fromBinary(w3d_bin)
        let doo = Binary.dooFile.fromBinary(doo_bin)

        let t = new Terrain('Test', 'Test', w3e, w3d, doo)
        let map_rect = GetEntireMapRect()
        let cx = GetRectMinX(map_rect)
        let cy = GetRectMinY(map_rect)

        t.apply(cx, cy, -256)
    })
    tm.start(3, false)
 
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