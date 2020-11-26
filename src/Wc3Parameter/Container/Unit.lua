--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass')
---@type Wc3Handle
local Wc3Handle = LibManager.getDepency('Wc3Handle')
local Unit = Wc3Handle.Unit
---@type Wc3Utils
local UtilsLib = LibManager.getDepency('Wc3Utils')
local isTypeErr = UtilsLib.isTypeErr or error('')
local Log = UtilsLib.Log or error('')

---@type ParameterContainerClass
local Container = require('Container') or error('')
local ContainerPublic = Class.getPublic(Container) or error('')
---@type ParameterSettings
local Settings = require('Settings') or error('')
---@type ParameterTypeClass
local ParameterType = require('Type') or error('')
---@type ParameterValueTypeClass
local ValueType = require('ValueType') or error('')

--=======
-- Class
--=======

local ParameterContainerUnit = Class.new('ParameterContainerUnit', Container)
---@class ParameterContainerUnit : ParameterContainer
local public = ParameterContainerUnit.public
---@class ParameterContainerUnitClass : ParameterContainerClass
local static = ParameterContainerUnit.static
---@type ParameterContainerUnitClass
local override = ParameterContainerUnit.override
local private = {}

--=========
-- Static
--=========

---@param owner Unit
---@param child ParameterContainerUnit | nil
---@return ParameterContainerUnit
function override.new(owner, child)
    isTypeErr(owner, Unit, 'owner')
    isTypeErr(child, {'nil', ParameterContainerUnit}, 'child')

    if private.unit2container[owner] then
        Log:wrn('Parameter container for unit already exists.')
        return private.unit2container[owner]
    end

    local instance = child or Class.allocate(ParameterContainerUnit)
    instance = Container.new(instance)
    private.newData(instance, owner)

    return instance
end

---@param owner Unit
---@return ParameterContainerUnit | nil
function static.get(owner)
    return private.unit2container[owner]
end

--========
-- Public
--========

---@param param ParameterType
---@param val_type ParameterValueType
---@param value number
---@return number
function public:add(param, val_type, value)
    isTypeErr(self, ParameterContainerUnit, 'self')
    isTypeErr(param, ParameterType, 'param')
    isTypeErr(val_type, ValueType, 'val_type')
    isTypeErr(value, 'number', 'value')

    local res = ContainerPublic.add(self, param, val_type, value)

    local apply_func = private.apply_func[param]
    if apply_func then
        local priv = private.data[self]
        apply_func(priv.owner:getData(), res)
    end

    return res
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})
private.unit2container = setmetatable({}, {__mode = 'k'})

---@param self ParameterContainerUnit
---@param owner Unit
function private.newData(self, owner)
    local priv = {
        owner = owner
    }
    private.data[self] = priv
    private.unit2container[owner] = self
end

private.apply_func = {
    [ParameterType.enum.PATK] = function(unit, value)
        BlzSetUnitBaseDamage(unit, math.floor((1 - 0.5 * Settings.PAtkDispersion) * value), 0)
        BlzSetUnitDiceNumber(unit, 1, 0)
        BlzSetUnitDiceSides(unit, math.floor(Settings.PAtkDispersion * value + 1), 0)
    end,

    [ParameterType.enum.PSPD] = function(unit, value)
        BlzSetUnitAttackCooldown(unit, 1 / value, 0)
    end,

    [ParameterType.enum.LIFE] = function(unit, value)
        local percent_hp = GetUnitLifePercent(unit)
        BlzSetUnitMaxHP(unit, math.floor(value))
        SetUnitState(unit, UNIT_STATE_LIFE, GetUnitState(unit, UNIT_STATE_MAX_LIFE) * percent_hp * 0.01)
    end,

    [ParameterType.enum.REGE] = function(unit, value)
        BlzSetUnitRealField(unit, UNIT_RF_HIT_POINTS_REGENERATION_RATE, value)
    end,

    [ParameterType.enum.MANA] = function(unit, value)
        local percent_mana = GetUnitManaPercent(unit)
        BlzSetUnitMaxMana(unit, math.floor(value))
        SetUnitState(unit, UNIT_STATE_MANA, GetUnitState(unit, UNIT_STATE_MAX_MANA) * percent_mana * 0.01)
    end,

    [ParameterType.enum.RECO] = function(unit, value)
        BlzSetUnitRealField(unit, UNIT_RF_MANA_REGENERATION, value)
    end,

    [ParameterType.enum.MOVE] = function(unit, value)
        if value <= 1 then
            SetUnitTurnSpeed(unit, 0)
        else
            SetUnitTurnSpeed(unit, GetUnitDefaultTurnSpeed(unit))
        end
        SetUnitMoveSpeed(unit, value)
    end,
}

return static