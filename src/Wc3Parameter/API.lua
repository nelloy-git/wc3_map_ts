LibManager.startLib('Wc3Parameter')

--===========
-- Depencies
--===========

LibManager.addDepency('LuaClass', 'https://github.com/nelloy-git/LuaClass.git')
LibManager.addDepency('Wc3Handle', 'https://github.com/nelloy-git/Wc3Handle.git')
LibManager.addDepency('Wc3Utils', 'https://github.com/nelloy-git/Wc3Utils.git')

--=====
-- API
--=====

---@class Wc3Parameter
local Wc3Parameter = {}

---@type ParameterContainerClass
Wc3Parameter.Container = require('Container') or error('')
---@type ParameterTypeClass
Wc3Parameter.Type = require('Type') or error('')
---@type ParameterValueTypeClass
Wc3Parameter.ValueType = require('ValueType') or error('')
---@type ParameterContainerUnitClass
Wc3Parameter.UnitContainer = require('Container.Unit') or error('')

LibManager.endLib()

return Wc3Parameter