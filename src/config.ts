import * as Pl from './Configure/Player'

Pl.addPlayer(0, 'Player1', Pl.Race.Human, Pl.Control.Human, 0, 0)
Pl.addForce('Force1', [0], true, true, true, true, true)

// Pl.applyConfig()
// Pl.addPlayer(1, 'Player2', RACE_PREF_RANDOM, MAP_CONTROL_USER, 0, 0)
// Pl.addPlayer(2, 'Player3', RACE_PREF_RANDOM, MAP_CONTROL_USER, 0, 0)
// Pl.addPlayer(3, 'Player4', RACE_PREF_RANDOM, MAP_CONTROL_USER, 0, 0)

if (IsGame()){
    SetMapName("Just another Warcraft III map")
    SetMapDescription("Nondescript")
    SetPlayers(6)
    SetTeams(6)
    SetGamePlacement(MAP_PLACEMENT_TEAMS_TOGETHER)


    // Player 0
    DefineStartLocation(0, 0, 0)
    SetPlayerStartLocation(Player(0), 0)
    SetPlayerColor(Player(0), ConvertPlayerColor(0))
    SetPlayerRacePreference(Player(0), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(0), true)
    SetPlayerController(Player(0), MAP_CONTROL_USER)
    SetPlayerSlotAvailable(Player(0), MAP_CONTROL_USER)

    // Player 1
    DefineStartLocation(1, 0, 0)
    SetPlayerStartLocation(Player(1), 1)
    SetPlayerColor(Player(1), ConvertPlayerColor(1))
    SetPlayerRacePreference(Player(1), RACE_PREF_ORC)
    SetPlayerRaceSelectable(Player(1), true)
    SetPlayerController(Player(1), MAP_CONTROL_USER)
    SetPlayerSlotAvailable(Player(1), MAP_CONTROL_USER)

    // Player 2
    DefineStartLocation(2, 0, 0)
    SetPlayerStartLocation(Player(2), 2)
    SetPlayerColor(Player(2), ConvertPlayerColor(2))
    SetPlayerRacePreference(Player(2), RACE_PREF_UNDEAD)
    SetPlayerRaceSelectable(Player(2), true)
    SetPlayerController(Player(2), MAP_CONTROL_USER)
    SetPlayerSlotAvailable(Player(2), MAP_CONTROL_USER)

    // Player 3
    DefineStartLocation(3, 0, 0)
    SetPlayerStartLocation(Player(3), 3)
    SetPlayerColor(Player(3), ConvertPlayerColor(3))
    SetPlayerRacePreference(Player(3), RACE_PREF_NIGHTELF)
    SetPlayerRaceSelectable(Player(3), true)
    SetPlayerController(Player(3), MAP_CONTROL_USER)
    SetPlayerSlotAvailable(Player(3), MAP_CONTROL_USER)

    // Player 4
    DefineStartLocation(4, 0, 0)
    SetPlayerStartLocation(Player(4), 4)
    SetPlayerColor(Player(4), ConvertPlayerColor(4))
    SetPlayerRacePreference(Player(4), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(4), true)
    SetPlayerController(Player(4), MAP_CONTROL_USER)
    SetPlayerSlotAvailable(Player(4), MAP_CONTROL_USER)

    // Player 5
    DefineStartLocation(5, 0, 0)
    SetPlayerStartLocation(Player(5), 5)
    SetPlayerColor(Player(5), ConvertPlayerColor(5))
    SetPlayerRacePreference(Player(5), RACE_PREF_ORC)
    SetPlayerRaceSelectable(Player(5), true)
    SetPlayerController(Player(5), MAP_CONTROL_USER)
    SetPlayerSlotAvailable(Player(5), MAP_CONTROL_USER)

    InitGenericPlayerSlots()
}