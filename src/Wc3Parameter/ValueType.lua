--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass')

--=======
-- Class
--=======

local ParameterValueType = Class.new('ParameterValueType')
---@class ParameterValueType
local public = ParameterValueType.public
---@class ParameterValueTypeClass
local static = ParameterValueType.static
---@type ParameterValueTypeClass
local override = ParameterValueType.override
local private = {}

--========
-- Static
--========

override.enum = {
    ---@type ParameterValueType
    BASE = Class.allocate(ParameterValueType),
    ---@type ParameterValueType
    MULT = Class.allocate(ParameterValueType),
    ---@type ParameterValueType
    ADDIT = Class.allocate(ParameterValueType),
    ---@type ParameterValueType
    RES = Class.allocate(ParameterValueType),
}

---@return table<ParameterValueType, number>
function override.newList()
    local list = {}
    for name, value_type in pairs(static.enum) do
        list[value_type] = private.default[value_type]
    end
    return list
end

---@param list table<ParameterValueType, number>
---@return number
function override.math(list)
    local base = list[static.enum.BASE]
    local mult = list[static.enum.MULT]
    local addit = list[static.enum.ADDIT]
    list[static.enum.RES] = base * mult + addit
    return list[static.enum.RES]
end

--========
-- Public
--========

--=========
-- Private
--=========

private.default = {
    [static.enum.BASE] = 0,
    [static.enum.MULT] = 1,
    [static.enum.ADDIT] = 0,
    [static.enum.RES] = 0,
}

return static