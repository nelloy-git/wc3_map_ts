LibManager.startLib('AbilityList')

--===========
-- Depencies
--===========

LibManager.addDepency('Wc3AbilityExt', 'https://github.com/nelloy-git/Wc3AbilityExt.git')
LibManager.addDepency('Wc3Handle', 'https://github.com/nelloy-git/Wc3Handle.git')
LibManager.addDepency('Wc3Parameter', 'https://github.com/nelloy-git/Wc3Parameter.git')
LibManager.addDepency('Wc3Utils', 'https://github.com/nelloy-git/Wc3Utils.git')

--=====
-- API
--=====

---@class AbilityList
local AbilityList = {}

---@type AbilityExtType
AbilityList.LifeForceShield = require('LifeForceShield')

LibManager.endLib()

return AbilityList