LibManager.startLib('Wc3AbilityExt')

--===========
-- Depencies
--===========

LibManager.addDepency('LuaClass', 'https://github.com/nelloy-git/LuaClass.git')
LibManager.addDepency('Wc3Input', 'https://github.com/nelloy-git/Wc3Input.git')
LibManager.addDepency('Wc3Handle', 'https://github.com/nelloy-git/Wc3Handle.git')
LibManager.addDepency('Wc3Utils', 'https://github.com/nelloy-git/Wc3Utils.git')

--=====
-- API
--=====

---@class Wc3AbilityExt
local Wc3AbilityExt = {}

---@type AbilityExtClass
Wc3AbilityExt.AbilityExt = require('AbilityExt') or error('')
Wc3AbilityExt.AbilityExt.init()
---@type AbilityExtChargesClass
Wc3AbilityExt.Charges = require('Charges') or error('')

---@type AbilityExtContainerClass
Wc3AbilityExt.Container = require('Container') or error('')
---@type AbilityExtTypeClass
Wc3AbilityExt.Type = require('Type') or error('')

-- Targeting
---@type AbilityExtTypeTargetingClass
Wc3AbilityExt.TargetingType = require('Type.Targeting') or error('')
---@type AbilityExtTypeTargetingFriendClass
Wc3AbilityExt.TargetingTypeFriend = require('Type.Targeting.Friend') or error('')

-- Casting
---@type AbilityExtTypeCastingClass
Wc3AbilityExt.CastingType = require('Type.Casting') or error('')

-- Data
---@type AbilityExtTypeDataClass
Wc3AbilityExt.DataType = require('Type.Data') or error('')

--[[


---@type AbilityTargetDestructableClass
AbilityLibAPI.TargetDestructable = require('Target.Destructable') or error('')
---@type AbilityTargetItemClass
AbilityLibAPI.TargetItem = require('Target.Item') or error('')
---@type AbilityTargetNoneClass
AbilityLibAPI.TargetNone = require('Target.None') or error('')
---@type AbilityTargetPointClass
AbilityLibAPI.TargetPoint = require('Target.Point') or error('')
---@type AbilityTargetUnitClass
AbilityLibAPI.TargetUnit = require('Target.Unit') or error('')

---@type AbilityDataClass
local AbilityData = require('Data.Base') or error('')
AbilityLibAPI.EVENT = AbilityData.EVENT
AbilityLibAPI.addEventAction = AbilityData.addEventAction

---@type AbilityCastingClass
local AbilityCasting = require('Casting.Base')
AbilityLibAPI.CastingLoopPeriod = AbilityCasting.getCastingPeriod()

---@type AbilityDataType
AbilityLibAPI.TestType = require('TestType') or error('')
]]

LibManager.endLib()

return Wc3AbilityExt