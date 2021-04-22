import { Vec2 } from '../Math'

export type PlayerConfig = {
    id: number,
    name: string,
    race: Race,
    control: Control,
    start_x: number,
    start_y: number
}

export type ForceConfig = {
    name: string,
    players: number[],
    allied: boolean,
    allied_victory: boolean,
    share_vision: boolean,
    share_unit_control: boolean,
    share_advanced_control: boolean,
}

export type MapConfig = {
    name: string,
    author: string,
    description: string,
    recommended: string,
    cam_bounds: [p1: Vec2, p2: Vec2, p3: Vec2, p4: Vec2]
    map_bounds: [size: Vec2, top_left: Vec2, bot_right: Vec2]
    players: PlayerConfig[]
    forces: ForceConfig[]
}

export enum Race {
    None,
    Human ,
    Orc,
    Undead,
    NightElf,
}

export enum Control {
    None,
    Human,
    Computer,
    Neutral,
    Resquable,
}