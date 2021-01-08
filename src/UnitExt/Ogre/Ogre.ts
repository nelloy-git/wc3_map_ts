import { Map, FieldUnitList } from "../../Binary";
import { id2int } from "../../Utils";
import { UnitExt } from "../UnitExt";
// import { Breakthrough } from './Abils/Breakthrough'

let type = Map.w3u.add(id2int('hfoo'))
type.setInt(FieldUnitList.HitPointsMaximumBase, 100)
type.setInt(FieldUnitList.ManaMaximum, 100)
type.setString(FieldUnitList.ModelFile, 'Units\\Creeps\\OgreLord\\OgreLord.mdl')

export class Ogre extends UnitExt {
    constructor(x: number, y: number, pl: jplayer){
        super(type, x, y, pl)

        this.params.set('LIFE', 'BASE', 800)
        // this.params.set('REGE', 'BASE', 4)

        // this.params.set('MANA', 'BASE', 100)
        // this.params.set('RECO', 'BASE', 0.5)

        // this.params.set('PATK', 'BASE', 65)
        // this.params.set('PSPD', 'BASE', 0.5)
        // this.params.set('PDEF', 'BASE', 10)
        // this.params.set('PRES', 'BASE', 0.1)

        // this.params.set('MATK', 'BASE', 0)
        // this.params.set('MSPD', 'BASE', 1)
        // this.params.set('MDEF', 'BASE', 10)
        // this.params.set('MRES', 'BASE', 0.1)

        // this.params.set('CRIT', 'BASE', 0)
        // this.params.set('MOVE', 'BASE', 310)

        // this.abils.set(0, Breakthrough)
    }
}