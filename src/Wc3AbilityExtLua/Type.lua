--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')

---@type AbilityExtTypeTargetingClass
local AbilityExtTypeTargeting = require('Type.Targeting') or error('')
---@type AbilityExtTypeCastingClass
local AbilityExtTypeCasting = require('Type.Casting') or error('')
---@type AbilityExtTypeDataClass
local AbilityExtTypeData = require('Type.Data') or error('')

--=======
-- Class
--=======

local AbilityExtType = Class.new('AbilityExtType')
---@class AbilityExtType
local public = AbilityExtType.public
---@class AbilityExtTypeClass
local static = AbilityExtType.static
---@type AbilityExtTypeClass
local override = AbilityExtType.override
local private = {}
private.virtual_functions = {}

--========
-- Static
--========

---@param targ_type AbilityExtTypeTargeting
---@param cast_type AbilityExtTypeCasting
---@param data_type AbilityExtTypeData
---@return AbilityExtType
function override.new(targ_type, cast_type, data_type)
    isTypeErr(targ_type, AbilityExtTypeTargeting, 'targ_type')
    isTypeErr(cast_type, AbilityExtTypeCasting, 'cast_type')
    isTypeErr(data_type, AbilityExtTypeData, 'data_type')

    local instance = Class.allocate(AbilityExtType)
    private.newData(instance, targ_type, cast_type, data_type)

    return instance
end

--========
-- Public
--========

---@return AbilityExtTypeTargeting
function public:getTargeting()
    isTypeErr(self, AbilityExtType, 'self')
    return private.data[self].targ_type
end

---@return AbilityExtTypeCasting
function public:getCasting()
    isTypeErr(self, AbilityExtType, 'self')
    return private.data[self].cast_type
end

---@return AbilityExtTypeData
function public:getData()
    isTypeErr(self, AbilityExtType, 'self')
    return private.data[self].data_type
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

---@param self AbilityExtType
---@param targ_type AbilityExtTypeTargeting
---@param cast_type AbilityExtTypeCasting
---@param data_type AbilityExtTypeData
function private.newData(self, targ_type, cast_type, data_type)
    local priv = {
        targ_type = targ_type,
        cast_type = cast_type,
        data_type = data_type
    }
    private.data[self] = priv
end



return static