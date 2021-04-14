import * as Binary from '../../../src/Binary'

import { getFileDir } from "../../../src/Utils";
import { GameplayUnitType } from "./UnitType";

let __dir__ = Macro(getFileDir())

export let Ogre = new GameplayUnitType(Binary.Map.w3u, __dir__ + '/json/Ogre.json')