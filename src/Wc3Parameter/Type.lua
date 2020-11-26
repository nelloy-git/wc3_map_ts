--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local Color = Wc3Utils.Color or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')

--=======
-- Class
--=======

local ParameterType = Class.new('ParameterType')
---@class ParameterType
local public = ParameterType.public
---@class ParameterTypeClass
local static = ParameterType.static
---@type ParameterTypeClass
local override = ParameterType.override
local private = {}

--========
-- Static
--========

--========
-- Public
--========

---@return string
function public:getName()
    isTypeErr(self, ParameterType, 'self')
    return private.data[self].name
end

---@return Color
function public:getColor()
    isTypeErr(self, ParameterType, 'self')
    return Color.copy(private.data[self].color)
end

---@return number
function public:getMin()
    isTypeErr(self, ParameterType, 'self')
    return private.data[self].min
end

---@return number
function public:getMax()
    isTypeErr(self, ParameterType, 'self')
    return private.data[self].max
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

---@param name string
---@param color Color
---@param min number
---@param max number
---@return ParameterType
function private.new(name, color, min, max)
    isTypeErr(name, 'string', 'name')
    isTypeErr(color, Color, 'color')
    isTypeErr(min, 'number', 'min')
    isTypeErr(max, 'number', 'max')
    local instance = Class.allocate(ParameterType)

    local priv = {
        name = name,
        color = Color.copy(color),
        min = min,
        max = max
    }
    private.data[instance] = priv

    return instance
end

--========
-- Static
--========

override.enum = {
    PATK = private.new('PATK', Color.new(1, 1, 1, 1), -(10^10), 10^10),
    PSPD = private.new('PSPD', Color.new(1, 1, 1, 1), -(10^10), 10^10),
    PDEF = private.new('PDEF', Color.new(1, 1, 1, 1), -(10^10), 10^10),
    PRES = private.new('PRES', Color.new(1, 1, 1, 1), -(10^10),     1),
    MATK = private.new('MATK', Color.new(1, 1, 1, 1), -(10^10), 10^10),
    MSPD = private.new('MSPD', Color.new(1, 1, 1, 1), -(10^10), 10^10),
    MDEF = private.new('MDEF', Color.new(1, 1, 1, 1), -(10^10), 10^10),
    MRES = private.new('MRES', Color.new(1, 1, 1, 1), -(10^10),     1),
    CRIT = private.new('CRIT', Color.new(1, 1, 1, 1), -(10^10),     1),
    LIFE = private.new('LIFE', Color.new(1, 1, 1, 1),       10, 10^10),
    REGE = private.new('REGE', Color.new(1, 1, 1, 1), -(10^10), 10^10),
    MANA = private.new('MANA', Color.new(1, 1, 1, 1),       10, 10^10),
    RECO = private.new('RECO', Color.new(1, 1, 1, 1), -(10^10), 10^10),
    MOVE = private.new('MOVE', Color.new(1, 1, 1, 1), -(10^10),   500),
}

return static