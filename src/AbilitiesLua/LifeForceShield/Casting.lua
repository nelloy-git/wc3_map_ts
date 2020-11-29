--=========
-- Include
--=========

---@type Wc3AbilityExt
local Wc3AbilityExt = LibManager.getDepency('Wc3AbilityExt')
local CastingType = Wc3AbilityExt.CastingType
local casting_period = Wc3AbilityExt.getAbilityCastingPeriod

---@type LifeForceShieldSettings
local Settings = require('LifeForceShield.Settings')
local LifeDrainPerSec = Settings.LifeDrainPerSec
local BonusShieldPerMAtk = Settings.BonusShieldPerMAtk

--========
-- Module
--========

local AbilCasting = CastingType.new()

local life_drained = {}

---@param abil AbilityExt
function CastingType:loop(abil)
    local target = abil:getTarget()

    local hp = target:getHealth()
    local max_hp = target:getMaxHealth()
    local perc = hp / max_hp

    life_drained[abil] = (life_drained[abil] or 0) + LifeDrainPerSec * casting_period * max_hp
    target:setHealth((perc - LifeDrainPerSec * casting_period) * max_hp)
end

---@param abil AbilityExt
local function endCasting(abil)
    local owner = abil:getOwner()
    local target = abil:getTarget()

    --local buffs = UnitBuffs.get(target)
    --local matk = ParamUnit.get(owner):getResult(ParamType.MATK)
    --buffs:add(BuffEffect, owner, 10, life_drained[abil] * (1 + BonusShieldPerMAtk * matk))
    life_drained[abil] = nil
end

function CastingType:cancel(abil)
    endCasting(abil)
end

function CastingType:interrupt(abil)
    endCasting(abil)
end

function CastingType:finish(abil)
    endCasting(abil)
end

return AbilCasting