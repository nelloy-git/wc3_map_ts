--=========
-- Include
--=========

---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils')
local ActionList = Wc3Utils.ActionList or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')
local pairsByKeys = Wc3Utils.pairsByKeys or error('')

---@type DamageShieldClass
local Shield = require('Shield') or error('')

--========
-- Module
--========

---@class DamageEvent
local DamageEvent = {}

local modificators = {}

---@alias DamageModificator fun(dmg:number, dmg_type:damagetype, targ:unit, src:unit):number

--- Actions with same priority can will be executed in random order.
---@param priority number
---@param modificator DamageModificator
---@return Action
function DamageEvent.addAction(priority, modificator)
    isTypeErr(priority, 'number', 'priority')
    isTypeErr(modificator, 'function', 'modificator')

    if not modificators[priority] then
        modificators[priority] = ActionList.new(DamageEvent)
    end
    return modificators[priority]:add(modificator)
end

---@param action Action
---@return boolean
function DamageEvent.removeAction(action)
    for priority, list in pairs(modificators) do
        if list:remove(action) then
            return true
        end
    end
    return false
end

local function sort(k1, k2)
    return k1 > k2
end

local function runActions()
    local dmg_type = BlzGetEventDamageType()
    local dmg = GetEventDamage()
    local targ = BlzGetEventDamageTarget()
    local src = GetEventDamageSource()

    for priority, list in pairsByKeys(modificators, sort) do
        -- Apply damage modificators one by one.
        local count = list:count()
        for i = 1, count do
            dmg = list:get(i):run(dmg, dmg_type, targ, src)
        end
    end

    dmg = Shield.consumeDamage(dmg, targ, dmg_type)
    BlzSetEventDamage(dmg < 0 and 0 or dmg)
end

if IsGame() then
    local trigger = CreateTrigger()
    TriggerAddAction(trigger, runActions)

    for i = 0, bj_MAX_PLAYER_SLOTS - 1 do
        local pl = Player(i)
        TriggerRegisterPlayerUnitEvent(trigger, pl, EVENT_PLAYER_UNIT_DAMAGING)
    end
end

return DamageEvent