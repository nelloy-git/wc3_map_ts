--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass')
---@type Wc3Utils
local UtilsLib = LibManager.getDepency('Wc3Utils')
local Action = UtilsLib.Action or error()
local ActionList = UtilsLib.ActionList or error()
local isTypeErr = UtilsLib.isTypeErr or error('')

---@type ParameterTypeClass
local ParameterType = require('Type') or error('')
---@type ParameterValueClass
local Value = require('Value') or error('')
---@type ParameterValueTypeClass
local ValueType = require('ValueType') or error('')

--=======
-- Class
--=======

local ParameterContainer = Class.new('ParameterContainer')
---@class ParameterContainer
local public = ParameterContainer.public
---@class ParameterContainerClass
local static = ParameterContainer.static
---@type ParameterContainerClass
local override = ParameterContainer.override
local private = {}

--========
-- Static
--========

---@return ParameterContainer
function override.new(child)
    isTypeErr(child, {'nil', ParameterContainer}, 'child')

    local instance = child or Class.allocate(ParameterContainer)
    private.newData(instance)

    return instance
end

--========
-- Public
--========

---@param param ParameterType
---@param val_type ParameterValueType
---@param val number
---@return number
function public:add(param, val_type, val)
    isTypeErr(self, ParameterContainer, 'self')
    isTypeErr(param, ParameterType, 'param')
    isTypeErr(val_type, ValueType, 'val_type')
    isTypeErr(val, 'number', 'val')
    local priv = private.data[self]

    local res = priv.values[param]:add(val_type, val)
    local min = param:getMin()
    local max = param:getMax()

    res = res < min and min or res
    res = res > max and max or res

    priv.actions:run(self, param)

    return res
end

---@param param ParameterType
---@param val_type ParameterValueType
---@return number
function public:get(param, val_type)
    isTypeErr(self, ParameterContainer, 'self')
    isTypeErr(param, ParameterType, 'param')
    isTypeErr(val_type, ValueType, 'val_type')
    local priv = private.data[self]

    local res = priv.values[param]:get(val_type)
    if val_type == ValueType.enum.RES then
        local min = param:getMin()
        local max = param:getMax()

        res = res < min and min or res
        res = res > max and max or res
    end

    return res
end

---@alias ParameterChangedCallback fun(container:ParameterContainer, param:ParameterType)

---@param callback ParameterChangedCallback
---@return Action
function public:addChangedAction(callback)
    isTypeErr(self, ParameterContainer, 'self')
    isTypeErr(callback, 'function', 'callback')
    return private.data[self].actions:add(callback)
end

---@param action Action
---@return boolean
function public:removeAction(action)
    isTypeErr(self, ParameterContainer, 'self')
    isTypeErr(action, Action, 'action')
    return private.data[self].actions:remove(action)
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

---@param self ParameterContainer
function private.newData(self)
    local priv = {
        values = {},
        actions = ActionList.new(self)
    }
    private.data[self] = priv

    for name, param in pairs(ParameterType.enum) do
        priv.values[param] = Value.new()
    end
end

return static