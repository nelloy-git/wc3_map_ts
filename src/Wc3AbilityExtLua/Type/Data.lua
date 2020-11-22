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

local AbilityExtTypeData = Class.new('AbilityExtTypeData')
---@class AbilityExtTypeData
local public = AbilityExtTypeData.public
---@class AbilityExtTypeDataClass
local static = AbilityExtTypeData.static
---@type AbilityExtTypeDataClass
local override = AbilityExtTypeData.override
local virtual = {}
local private = {}
private.virtual_functions = {}

--========
-- Static
--========

---@param child AbilityExtTypeData | nil
---@return AbilityExtTypeData
function override.new(child)
    isTypeErr(child, {AbilityExtTypeData, 'nil'}, 'child')

    local instance = child or Class.allocate(AbilityExtTypeData)
    return instance
end

--========
-- Public
--========

---@param abil AbilityExt
---@return string
function public:getName(abil) return 'Noname' end

---@param abil AbilityExt
---@return string
function public:getIcon(abil) return '' end

---@param abil AbilityExt
---@return string
function public:getTooltip(abil) return 'Notooltip' end

---@param abil AbilityExt
---@return number
function public:getLifeCost(abil) return 0 end

---@param abil AbilityExt
---@return number
function public:getManaCost(abil) return 0 end

---@param abil AbilityExt
---@return number
function public:getSpecialCost(abil) return 0 end

---@param abil AbilityExt
---@return number
function public:getChargesForUse(abil) return 1 end

---@param abil AbilityExt
---@return number
function public:getMaxCharges(abil) return 1 end

---@param abil AbilityExt
---@return number
function public:getCooldown(abil) return 3 end

---@param abil AbilityExt
---@return number
function public:getCastingTime(abil) return 1 end

---@param abil AbilityExt
---@return boolean
function public:isAvailable(abil) return true end

---@param abil AbilityExt
function public:consume(abil) end

---@param abil AbilityExt
---@param target any
---@return boolean
function public:checkTarget(abil, target) return true end

--=========
-- Private
--=========

return static