//import "common"
import * as Binary from './Binary'
import { FileBinary } from "./Utils";

let f = new FileBinary()
f.read(GetSrc() + '/map_data.w3m/war3map.w3i')

let w3i = Binary.w3iFile.fromBinary(f)
print('file_format: ', w3i.file_format)

print(w3i.env.weather)
print(w3i.env.custom_sound)
print(w3i.env.tileset_of_light.charCodeAt(0))
print(w3i.env.water_color)

print(w3i.players[0].start_x)
print(w3i.players[0].start_y)
print(w3i.players[0].ally_low_flags)
print(w3i.players[0].ally_high_flags)
print(w3i.forces.length)

f.data = w3i.toBinary()
f.write('./test.w3i')

if (IsGame()){
    SetMapName("Just another Warcraft III map")
    SetMapDescription("Nondescript")
    SetPlayers(6)
    SetTeams(6)
    SetGamePlacement(MAP_PLACEMENT_TEAMS_TOGETHER)

    DefineStartLocation(0, 0, 0)
    DefineStartLocation(1, 0, 0)
    DefineStartLocation(2, 0, 0)
    DefineStartLocation(3, 0, 0)
    DefineStartLocation(4, 0, 0)
    DefineStartLocation(5, 0, 0)

    // Player 0
    SetPlayerStartLocation(Player(0), 0)
    SetPlayerColor(Player(0), ConvertPlayerColor(0))
    SetPlayerRacePreference(Player(0), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(0), true)
    SetPlayerController(Player(0), MAP_CONTROL_USER)

    // Player 1
    SetPlayerStartLocation(Player(1), 1)
    SetPlayerColor(Player(1), ConvertPlayerColor(1))
    SetPlayerRacePreference(Player(1), RACE_PREF_ORC)
    SetPlayerRaceSelectable(Player(1), true)
    SetPlayerController(Player(1), MAP_CONTROL_USER)

    // Player 2
    SetPlayerStartLocation(Player(2), 2)
    SetPlayerColor(Player(2), ConvertPlayerColor(2))
    SetPlayerRacePreference(Player(2), RACE_PREF_UNDEAD)
    SetPlayerRaceSelectable(Player(2), true)
    SetPlayerController(Player(2), MAP_CONTROL_USER)

    // Player 3
    SetPlayerStartLocation(Player(3), 3)
    SetPlayerColor(Player(3), ConvertPlayerColor(3))
    SetPlayerRacePreference(Player(3), RACE_PREF_NIGHTELF)
    SetPlayerRaceSelectable(Player(3), true)
    SetPlayerController(Player(3), MAP_CONTROL_USER)

    // Player 4
    SetPlayerStartLocation(Player(4), 4)
    SetPlayerColor(Player(4), ConvertPlayerColor(4))
    SetPlayerRacePreference(Player(4), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(4), true)
    SetPlayerController(Player(4), MAP_CONTROL_USER)

    // Player 5
    SetPlayerStartLocation(Player(5), 5)
    SetPlayerColor(Player(5), ConvertPlayerColor(5))
    SetPlayerRacePreference(Player(5), RACE_PREF_ORC)
    SetPlayerRaceSelectable(Player(5), true)
    SetPlayerController(Player(5), MAP_CONTROL_USER)

    SetPlayerSlotAvailable(Player(0), MAP_CONTROL_USER)
    SetPlayerSlotAvailable(Player(1), MAP_CONTROL_USER)
    SetPlayerSlotAvailable(Player(2), MAP_CONTROL_USER)
    SetPlayerSlotAvailable(Player(3), MAP_CONTROL_USER)
    SetPlayerSlotAvailable(Player(4), MAP_CONTROL_USER)
    SetPlayerSlotAvailable(Player(5), MAP_CONTROL_USER)
    InitGenericPlayerSlots()

    SetStartLocPrioCount(0, 1)
    SetStartLocPrio(0, 0, 3, MAP_LOC_PRIO_HIGH)

    SetStartLocPrioCount(1, 3)
    SetStartLocPrio(1, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(1, 1, 3, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(1, 2, 4, MAP_LOC_PRIO_LOW)

    SetStartLocPrioCount(2, 1)
    SetStartLocPrio(2, 0, 3, MAP_LOC_PRIO_HIGH)

    SetStartLocPrioCount(3, 2)
    SetStartLocPrio(3, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(3, 1, 2, MAP_LOC_PRIO_HIGH)

    SetStartLocPrioCount(4, 5)
    SetStartLocPrio(4, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(4, 1, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(4, 2, 2, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(4, 3, 3, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(4, 4, 5, MAP_LOC_PRIO_HIGH)

    SetStartLocPrioCount(5, 3)
    SetStartLocPrio(5, 0, 2, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(5, 1, 3, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(5, 2, 4, MAP_LOC_PRIO_HIGH)
}