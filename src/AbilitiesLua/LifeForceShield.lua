--=========
-- Include
--=========

---@type Wc3AbilityExt
local Wc3AbilityExt = LibManager.getDepency('Wc3AbilityExt')
local AbilityExtType = Wc3AbilityExt.Type

local Casting = require('LifeForceShield.Casting')
local Data = require('LifeForceShield.Data')
local Targeting = require('LifeForceShield.Targeting')

--========
-- Module
--========

return AbilityExtType.new(Targeting, Casting, Data)