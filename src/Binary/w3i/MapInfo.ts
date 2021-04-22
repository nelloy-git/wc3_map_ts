import { FileBinary } from "../../Utils";
import { Obj } from "../Obj";
import { float2byte, int2byte, str2byte } from "../Utils";

export class w3iMapInfo extends Obj{
    static fromBinary(file: FileBinary){
        let ls = new w3iMapInfo()

        ls.version = tostring(file.readInt(4)) + '.'
                     + tostring(file.readInt(4)) + '.'
                     + tostring(file.readInt(4)) + '.'
                     + tostring(file.readInt(4))

        ls.name = file.readString()
        ls.author = file.readString()
        ls.description = file.readString()
        ls.players_recommended = file.readString()

        for (let i = 0; i < 8; i++){
            ls.camera_bounds[i] = file.readFloat()
        }
        for (let i = 0; i < 4; i++){
            ls.camera_bounds_complements[i] = file.readInt(4)
        }

        ls.playable_width = file.readInt(4)
        ls.playable_height = file.readInt(4)

        let flags_1 = file.readChar(1).charCodeAt(0)
        let flags_2 = file.readChar(1).charCodeAt(0)
        file.readChar(2)

        // print(flags_1, flags_2)

        ls.hide_minimap_in_preview = (flags_2 & 0x01) != 0
        ls.modify_ally_properties = (flags_2 & 0x02) != 0
        ls.melee = (flags_2 & 0x04) != 0
        ls.playable_map_size_was_large_and_has_never_been_reduced_to_medium = (flags_2 & 0x08) != 0
        ls.mask_areas_are_partially_visible = (flags_2 & 0x10) != 0
        ls.fixed_player_settings_for_custom_forces = (flags_2 & 0x20) != 0
        ls.use_custom_forces = (flags_2 & 0x40) != 0
        ls.use_custom_techtree = (flags_2 & 0x80) != 0

        ls.use_custom_abilities = (flags_1 & 0x01) != 0
        ls.use_custom_upgrades = (flags_1 & 0x02) != 0
        ls.map_properties_menu_opened_at_least_once_since_map_creation = (flags_1 & 0x04) != 0
        ls.show_waves_on_cliff_shores = (flags_1 & 0x08) != 0
        ls.show_waves_on_rolling_shores = (flags_1 & 0x10) != 0
        ls.unknown_flag_1 = (flags_1 & 0x20) != 0
        ls.unknown_flag_2 = (flags_1 & 0x40) != 0
        ls.unknown_flag_3 = (flags_1 & 0x80) != 0

        return ls
    }

    toBinary(){
        let raw = ''

        let v = this.version.split('.')
        if (v.length != 4){
            error('wrong warcraft version format', 2)
        }
        raw += int2byte(<number>tonumber(v[0]))
        raw += int2byte(<number>tonumber(v[1]))
        raw += int2byte(<number>tonumber(v[2]))
        raw += int2byte(<number>tonumber(v[3]))
        raw += str2byte(this.name)
        raw += str2byte(this.author)
        raw += str2byte(this.description)
        raw += str2byte(this.players_recommended)
        for (let i = 0; i < 8; i++){
            raw += float2byte(this.camera_bounds[i])
        }
        for (let i = 0; i < 4; i++){
            raw += int2byte(this.camera_bounds_complements[i])
        }
        raw += int2byte(this.playable_width)
        raw += int2byte(this.playable_height)

        let flags_2 = 0
        if (this.hide_minimap_in_preview){flags_2 |= 0x01}
        if (this.modify_ally_properties){flags_2 |= 0x02}
        if (this.melee){flags_2 |= 0x04}
        if (this.playable_map_size_was_large_and_has_never_been_reduced_to_medium){flags_2 |= 0x08}
        if (this.mask_areas_are_partially_visible){flags_2 |= 0x10}
        if (this.fixed_player_settings_for_custom_forces){flags_2 |= 0x20}
        if (this.use_custom_forces){flags_2 |= 0x40}
        if (this.use_custom_techtree){flags_2 |= 0x80}

        let flags_1 = 0
        if (this.use_custom_abilities){flags_1 |= 0x01}
        if (this.use_custom_upgrades){flags_1 |= 0x02}
        if (this.map_properties_menu_opened_at_least_once_since_map_creation){flags_1 |= 0x04}
        if (this.show_waves_on_cliff_shores){flags_1 |= 0x08}
        if (this.show_waves_on_rolling_shores){flags_1 |= 0x10}
        if (this.unknown_flag_1){flags_1 |= 0x20}
        if (this.unknown_flag_2){flags_1 |= 0x40}
        if (this.unknown_flag_3){flags_1 |= 0x80}

        // print(flags_1, flags_2)
        raw += string.char(flags_1)
        raw += string.char(flags_2)
        raw += '\0\0'

        return raw
    }

    version: string = ''
    name: string = ''
    author: string = ''
    description: string = ''
    players_recommended: string = ''

    camera_bounds: number[] = []
    camera_bounds_complements: number[] = []
    playable_width: number = 0
    playable_height: number = 0
    ground: string = ''

    hide_minimap_in_preview: boolean = false
    modify_ally_properties: boolean = false
    melee: boolean = false
    playable_map_size_was_large_and_has_never_been_reduced_to_medium: boolean = false
    mask_areas_are_partially_visible: boolean = false
    fixed_player_settings_for_custom_forces: boolean = false
    use_custom_forces: boolean = false
    use_custom_techtree: boolean = false
    use_custom_abilities: boolean = false
    use_custom_upgrades: boolean = false
    map_properties_menu_opened_at_least_once_since_map_creation: boolean = false
    show_waves_on_cliff_shores: boolean = false
    show_waves_on_rolling_shores: boolean = false
    unknown_flag_1: boolean = false
    unknown_flag_2: boolean = false
    unknown_flag_3: boolean = false
}