--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')

--=======
-- Class
--=======

local AbilityExtTypeCasting = Class.new('AbilityExtTypeCasting')
---@class AbilityExtTypeCasting
local public = AbilityExtTypeCasting.public
---@class AbilityExtTypeCastingClass
local static = AbilityExtTypeCasting.static
---@type AbilityExtTypeCastingClass
local override = AbilityExtTypeCasting.override
local virtual = {}
local private = {}
private.virtual_functions = {}

--========
-- Static
--========

---@param child AbilityExtTypeCasting | nil
---@return AbilityExtTypeCasting
function override.new(child)
    isTypeErr(child, {AbilityExtTypeCasting, 'nil'}, 'child')

    local instance = child or Class.allocate(AbilityExtTypeCasting)
    return instance
end

--========
-- Public
--========

---@param abil AbilityExt
function public:start(abil) end

---@param abil AbilityExt
function public:loop(abil) end

---@param abil AbilityExt
function public:cancel(abil) end

---@param abil AbilityExt
function public:interrupt(abil) end

---@param abil AbilityExt
function public:finish(abil) end

--=========
-- Private
--=========

return static