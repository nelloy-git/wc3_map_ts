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
        
        let flags = file.readInt(4)
        for (let i = 0; i < 16; i++){
            print(i, (flags & Math.floor(Math.pow(2, i))) != 0)
        }

        ls.hide_minimap_in_preview = (flags & 0x0001) != 0
        ls.modify_ally_properties = (flags & 0x0002) != 0
        ls.melee = (flags & 0x0004) != 0
        ls.playable_map_size_was_large_and_has_never_been_reduced_to_medium = (flags & 0x0008) != 0
        ls.mask_areas_are_partially_visible = (flags & 0x0010) != 0
        ls.fixed_player_settings_for_custom_forces = (flags & 0x0020) != 0
        ls.use_custom_forces = (flags & 0x0040) != 0
        ls.use_custom_techtree = (flags & 0x0080) != 0
        ls.use_custom_abilities = (flags & 0x0100) != 0
        ls.use_custom_upgrades = (flags & 0x0200) != 0
        ls.map_properties_menu_opened_at_least_once_since_map_creation = (flags & 0x0400) != 0
        ls.show_waves_on_cliff_shores = (flags & 0x0800) != 0
        ls.show_waves_on_rolling_shores = (flags & 0x1000) != 0
        print(ls.show_waves_on_rolling_shores)
        print(ls.use_custom_techtree)

        return ls
    }

    toBinary(){
        let raw = ''

        let v = this.version.split('.')
        if (v.length != 4){
            error('wrong warcraft version format')
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

        let flags = 0
        if (this.hide_minimap_in_preview){flags = flags | 0x0100}
        if (this.modify_ally_properties){flags = flags | 0x0200}
        if (this.melee){flags = flags | 0x0400}
        if (this.mask_areas_are_partially_visible){flags = flags | 0x1000}
        if (this.fixed_player_settings_for_custom_forces){flags = flags | 0x2000}
        if (this.use_custom_forces){flags = flags | 0x4000}
        if (this.use_custom_techtree){flags = flags | 0x8000}
        if (this.use_custom_abilities){flags = flags | 0x0001}
        if (this.use_custom_upgrades){flags = flags | 0x0002}
        if (this.show_waves_on_cliff_shores){flags = flags | 0x0008}
        print(flags)
        if (this.show_waves_on_rolling_shores){flags = flags | 0x0010}
        print(flags)
        raw += int2byte(flags)

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
}