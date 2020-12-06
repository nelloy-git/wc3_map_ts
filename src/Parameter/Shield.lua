--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils')
local isType = Wc3Utils.isType or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')

--=======
-- Class
--=======

local DamageShield = Class.new('Shield')
---@class DamageShield
local public = DamageShield.public
---@class DamageShieldClass
local static = DamageShield.static
---@type DamageShieldClass
local override = DamageShield.override
local private = {}

--=========
-- Static
--=========

--- value >= 0
---@param owner unit
---@param value number
---@param dmg_types damagetype | damagetype[]
---@param child DamageShield | nil
---@return DamageShield
function override.new(owner, value, dmg_types, child)
    isTypeErr(owner, 'unit', 'owner')
    isTypeErr(value, 'number', 'value')
    isTypeErr(dmg_types, {'damagetype', 'table'}, 'dmg_types')
    if isType(dmg_types, 'table') then
        for i = 1, #dmg_types do
            isTypeErr(dmg_types[i], 'damagetype', 'dmg_types[i]')
        end
    else
        dmg_types = {dmg_types}
    end
    isTypeErr(child, {DamageShield, 'nil'}, 'child')

    if value < 0 then return nil end

    local instance = child or Class.allocate(DamageShield)
    private.newData(instance, owner, value, dmg_types)

    return instance
end

--- Returns inconsumed damage.
---@param dmg number
---@param owner unit
---@param dmg_type damagetype
---@return number
function static.consumeDamage(dmg, owner, dmg_type)
    isTypeErr(dmg, 'number', 'dmg')
    isTypeErr(owner, 'unit', 'owner')
    isTypeErr(dmg_type, 'damagetype', 'dmg_type')

    local cur = private.cur_value[dmg_type][owner]
    cur = (cur or 0) - dmg

    if cur < 0 then
        private.cur_value[dmg_type][owner] = nil
        private.max_value[dmg_type][owner] = nil

        return -cur
    end

    private.cur_value[dmg_type][owner] = cur
    return 0
end

---@param owner unit
---@param dmg_type damagetype
---@return number
function static.getCurrent(owner, dmg_type)
    isTypeErr(owner, 'unit', 'owner')
    isTypeErr(dmg_type, 'damagetype', 'dmg_type')
    return (private.cur_value[dmg_type][owner] or 0)
end

---@param owner unit
---@param dmg_type damagetype
---@return number
function static.getMax(owner, dmg_type)
    isTypeErr(owner, 'unit', 'owner')
    isTypeErr(dmg_type, 'damagetype', 'dmg_type')
    return (private.max_value[dmg_type][owner] or 0)
end

--========
-- Public
--========

function public:destroy()
    isTypeErr(self, DamageShield, 'self')
    local priv = private.data[self]

    local owner = priv.owner
    local value = priv.value
    for i = 1, #priv.dmg_types do
        local dmg_type = priv.dmg_types[i]
        local cur_val = private.cur_value[dmg_type]
        local max_val = private.max_value[dmg_type]

        max_val[owner] = (max_val[owner] or 0) - value
        cur_val[owner] = math.min((cur_val[owner] or 0), max_val[owner])

        if cur_val[owner] <= 0 then
            max_val[owner] = nil
            cur_val[owner] = nil
        end
    end
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

private.all_types = {
    DAMAGE_TYPE_UNKNOWN, DAMAGE_TYPE_NORMAL, DAMAGE_TYPE_ENHANCED, DAMAGE_TYPE_FIRE,
    DAMAGE_TYPE_COLD, DAMAGE_TYPE_LIGHTNING, DAMAGE_TYPE_POISON, DAMAGE_TYPE_DISEASE,
    DAMAGE_TYPE_DIVINE, DAMAGE_TYPE_MAGIC, DAMAGE_TYPE_SONIC, DAMAGE_TYPE_ACID,
    DAMAGE_TYPE_FORCE, DAMAGE_TYPE_DEATH, DAMAGE_TYPE_MIND, DAMAGE_TYPE_PLANT,
    DAMAGE_TYPE_DEFENSIVE, DAMAGE_TYPE_DEMOLITION, DAMAGE_TYPE_SLOW_POISON,
    DAMAGE_TYPE_SPIRIT_LINK, DAMAGE_TYPE_SHADOW_STRIKE,DAMAGE_TYPE_UNIVERSAL,
}

private.cur_value = {}
private.max_value = {}
for i = 1, #private.all_types do
    local dmg_type = private.all_types[i]

    private.cur_value[dmg_type] = {}
    private.max_value[dmg_type] = {}
end

---@param self DamageShield
---@param owner unit
---@param value number
---@param dmg_types damagetype[]
function private.newData(self, owner, value, dmg_types)
    local priv = {
        owner = owner,
        value = value,
        dmg_types = dmg_types
    }
    private.data[self] = priv

    for i = 1, #dmg_types do
        local dmg = dmg_types[i]
        private.cur_value[dmg][owner] = (private.cur_value[dmg][owner] or 0) + value
        private.max_value[dmg][owner] = (private.max_value[dmg][owner] or 0) + value
    end
end

return static