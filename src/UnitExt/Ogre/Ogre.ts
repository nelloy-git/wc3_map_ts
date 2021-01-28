import { Map, FieldUnitList } from "../../Binary";
import { id2int, IsReforged } from "../../Utils";
import { UnitExt } from "../UnitExt";
import { Breakthrough } from './Abils/Breakthrough'
import { HeavyHammer } from './Abils/HeavyHammer'
import { VoodooPoison } from "./Abils/VoodooPoison";

let type = Map.w3u.add(id2int('hfoo'))
type.setInt(FieldUnitList.HitPointsMaximumBase, 100)
type.setInt(FieldUnitList.ManaMaximum, 100)
type.setString(FieldUnitList.ModelFile, 'Units\\Creeps\\OgreLord\\OgreLord.mdl')

export class Ogre extends UnitExt {
    constructor(x: number, y: number, pl: jplayer){
        super(type, x, y, pl)

        if (IsReforged(GetLocalPlayer())){
            this.unit.modelScale = 0.7
        } else {
            this.unit.modelScale = 1.2
        }

        this.params.set('LIFE', 'BASE', 800)
        this.params.set('REGE', 'BASE', 4)

        this.params.set('MANA', 'BASE', 100)
        this.params.set('RECO', 'BASE', 0.5)

        this.params.set('PATK', 'BASE', 35)
        this.params.set('PSPD', 'BASE', 1)
        this.params.set('PDEF', 'BASE', 10)
        this.params.set('PRES', 'BASE', 0.1)

        this.params.set('MATK', 'BASE', 10)
        this.params.set('MSPD', 'BASE', 1)
        this.params.set('MDEF', 'BASE', 5)
        this.params.set('MRES', 'BASE', 0.1)

        this.params.set('CRIT', 'BASE', 0)
        this.params.set('MOVE', 'BASE', 310)

        this.abils.set(0, HeavyHammer)
        this.abils.set(1, VoodooPoison)
        this.abils.set(2, Breakthrough)
    }
}