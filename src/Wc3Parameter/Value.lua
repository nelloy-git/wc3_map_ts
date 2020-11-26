--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')

---@type ParameterValueTypeClass
local ValueType = require('ValueType') or error('')

--=======
-- Class
--=======

local ParameterValue = Class.new('ParameterValue')
---@class ParameterValue
local public = ParameterValue.public
---@class ParameterValueClass
local static = ParameterValue.static
---@type ParameterValueClass
local override = ParameterValue.override
local private = {}

--========
-- Static
--========

---@param child ParameterValue | nil
---@return ParameterValue
function override.new(child)
    isTypeErr(child, {'nil', ParameterValue}, 'child')

    local instance = child or Class.allocate(ParameterValue)
    private.newData(instance)

    return instance
end

--========
-- Public
--========

---@param val_type ParameterValueType
---@param val number
function public:add(val_type, val)
    isTypeErr(self, ParameterValue, 'self')
    isTypeErr(val_type, ValueType, 'val_type')
    isTypeErr(val, 'number', 'val')
    local priv = private.data[self]

    priv.list[val_type] = priv.list[val_type] + val

    return ValueType.math(priv.list)
end

---@param val_type ParameterValueType
---@return number
function public:get(val_type)
    isTypeErr(self, ParameterValue, 'self')
    isTypeErr(val_type, ValueType, 'val_type')

    return private.data[self].list[val_type]
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

---@param self ParameterValue
function private.newData(self)
    local priv = {
        list = ValueType.newList(),
    }
    private.data[self] = priv
end

return static