import * as Json from '../../../Json'
import { getFileDir } from '../../../Utils'

const __dir__ = Macro(getFileDir())

export const Breakthrough = new Json.Cached(__dir__ + '/Breakthrough.json').data
export const HeavyHammer = new Json.Cached(__dir__ + '/HeavyHammer.json').data
export const ToxicFart = new Json.Cached(__dir__ + '/ToxicFart.json').data
export const VoodooPoison = new Json.Cached(__dir__ + '/VoodooPoison.json').data