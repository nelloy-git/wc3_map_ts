import * as Binary from '../Binary'
import { w3iForceData } from '../Binary/w3i/Force'
import { Vec2 } from '../Math'
import { FileBinary } from '../Utils'

const __dir__ = Macro(getFileDir())

let __bin: FileBinary = <FileBinary><unknown> undefined
let __w3i: Binary.w3iFile = <Binary.w3iFile><unknown> undefined

if (!IsGame()){
    __bin = new FileBinary()
    __bin.read(__dir__ + '/war3map.w3i')
    __bin.saveCache(__dir__ + '/war3map.w3i')

    MacroFinal(() => {
        __bin.data = __w3i.toBinary()
        __bin.write(GetDst() + '/war3map.w3i')
    })
}
__bin.loadCache(__dir__ + '/war3map.w3i')
__w3i = Binary.w3iFile.fromBinary(__bin)
__w3i.players = []
__w3i.forces = []

export function setName(name: string){
    __w3i.info.name = name
}

export function setAuthor(author: string){
    __w3i.info.author = author
}

export function setDescription(desc: string){
    __w3i.info.description = desc
}

export function setPlayersRecommended(pl_rec: string){
    __w3i.info.players_recommended = pl_rec
}

export function setCameraBounds(p1: Vec2, p2: Vec2, p3: Vec2, p4: Vec2){
    __w3i.info.camera_bounds[0] = p1.x
    __w3i.info.camera_bounds[1] = p1.y
    __w3i.info.camera_bounds[2] = p2.x
    __w3i.info.camera_bounds[3] = p2.y
    __w3i.info.camera_bounds[4] = p3.x
    __w3i.info.camera_bounds[5] = p3.y
    __w3i.info.camera_bounds[6] = p4.x
    __w3i.info.camera_bounds[7] = p4.y
}

export function setPlayableMap(size: Vec2, top_left: Vec2, bot_right: Vec2){
    __w3i.info.playable_width = math.floor(size.x)
    __w3i.info.playable_height = math.floor(size.y)
    __w3i.info.camera_bounds_complements[0] = math.floor(top_left.x)
    __w3i.info.camera_bounds_complements[1] = math.floor(bot_right.x)
    __w3i.info.camera_bounds_complements[2] = math.floor(top_left.y)
    __w3i.info.camera_bounds_complements[3] = math.floor(bot_right.y)
}

export function addPlayer(id: number, name: string,
                          race: Race,
                          controller: Control,
                          start_x: number, start_y: number){

    for (let pl of __w3i.players){
        if (pl.id == id){
            error('Player id: ' + id + ' already reserved.')
        }
    }
    
    let pl = new Binary.w3iPlayer()
    pl.id = id
    pl.name = name
    pl.type = <Binary.w3iPlayer.Type><number>controller
    pl.race = <Binary.w3iPlayer.Race><number>race

    pl.fixed_start_pos = 1
    pl.start_x = start_x
    pl.start_y = start_y
    pl.ally_low_flags = 0
    pl.ally_high_flags = 0

    __w3i.players.push(pl)
}

export function addForce(name: string, player_ids: number[],
                         allied: boolean, allied_victory: boolean,
                         share_vision: boolean, share_unit_control: boolean,
                         share_advanced_control: boolean){
    let f = new w3iForceData()

    f.name = name
    for (const pl_id of player_ids){
        f.players.push(pl_id)
    }
    f.allied = allied
    f.allied_victory = allied_victory
    f.share_vision = share_vision
    f.share_unit_control = share_unit_control
    f.share_advanced_control = share_advanced_control

    __w3i.forces.push(f)
}

export function applyConfig(){
    if (IsGame()){
        SetMapName(__w3i.info.name)
        SetMapDescription(__w3i.info.description)
        SetPlayers(__w3i.players.length)
        SetTeams(__w3i.forces.length)
        SetGamePlacement(MAP_PLACEMENT_TEAMS_TOGETHER)

        for (const pl of __w3i.players){
            DefineStartLocation(pl.id, pl.start_x, pl.start_y)
            SetPlayerStartLocation(Player(pl.id), pl.id)
            SetPlayerColor(Player(pl.id), ConvertPlayerColor(pl.id))

            let race = __races.get(pl.race)
            race = race ? race : RACE_PREF_USER_SELECTABLE
            SetPlayerRacePreference(Player(pl.id), race)
            SetPlayerRaceSelectable(Player(pl.id), race == RACE_PREF_USER_SELECTABLE)

            let contr = __controller.get(pl.type)
            contr = contr ? contr : MAP_CONTROL_NONE
            SetPlayerController(Player(pl.id), contr)
            SetPlayerSlotAvailable(Player(pl.id), contr)
        }
        InitGenericPlayerSlots()
    }
}

export function applyMain(){
    if (IsGame()){
        SetCameraBounds(__w3i.info.camera_bounds[0] + GetCameraMargin(CAMERA_MARGIN_LEFT),
                        __w3i.info.camera_bounds[1] + GetCameraMargin(CAMERA_MARGIN_BOTTOM),
                        __w3i.info.camera_bounds[2] - GetCameraMargin(CAMERA_MARGIN_RIGHT),
                        __w3i.info.camera_bounds[3] - GetCameraMargin(CAMERA_MARGIN_TOP),
                        __w3i.info.camera_bounds[4] + GetCameraMargin(CAMERA_MARGIN_LEFT),
                        __w3i.info.camera_bounds[5] - GetCameraMargin(CAMERA_MARGIN_TOP),
                        __w3i.info.camera_bounds[6] - GetCameraMargin(CAMERA_MARGIN_RIGHT),
                        __w3i.info.camera_bounds[7] + GetCameraMargin(CAMERA_MARGIN_BOTTOM))
    }
}

function find<K,V>(m: Map<K,V>, v: V){
    for (let [m_k, m_v] of m){
        if (v == m_v){
            return m_k
        }
    }
    return undefined
}

export enum Race {
    None = Binary.w3iPlayer.Race.None,
    Human = Binary.w3iPlayer.Race.Human,
    Orc = Binary.w3iPlayer.Race.Orc,
    Undead = Binary.w3iPlayer.Race.Undead,
    NightElf = Binary.w3iPlayer.Race.NightElf,
}

export enum Control {
    None = Binary.w3iPlayer.Type.None,
    Human = Binary.w3iPlayer.Type.Human,
    Computer = Binary.w3iPlayer.Type.Computer,
    Neutral = Binary.w3iPlayer.Type.Neutral,
    Resquable = Binary.w3iPlayer.Type.Resquable,
}

const __races = new Map([
    [Binary.w3iPlayer.Race.None, RACE_PREF_USER_SELECTABLE],
    [Binary.w3iPlayer.Race.Human, RACE_PREF_HUMAN],
    [Binary.w3iPlayer.Race.Orc, RACE_PREF_ORC],
    [Binary.w3iPlayer.Race.Undead, RACE_PREF_UNDEAD],
    [Binary.w3iPlayer.Race.NightElf, RACE_PREF_NIGHTELF]
])

const __controller = new Map([
    [Binary.w3iPlayer.Type.None, MAP_CONTROL_NONE],
    [Binary.w3iPlayer.Type.Human, MAP_CONTROL_USER],
    [Binary.w3iPlayer.Type.Computer, MAP_CONTROL_COMPUTER],
    [Binary.w3iPlayer.Type.Neutral, MAP_CONTROL_NEUTRAL],
    [Binary.w3iPlayer.Type.Resquable, MAP_CONTROL_RESCUABLE]
])