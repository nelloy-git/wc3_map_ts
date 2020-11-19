--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local Action = Wc3Utils.Action or error('')
local ActionList = Wc3Utils.ActionList or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')
local Log = Wc3Utils.Log or error('')

---@type HandleClass
local Handle = require('Handle') or error('')
---@type TriggerClass
local Trigger = require('Handle.Trigger') or error('')
---@type TriggerEventClass
local TriggerEvent = require('Handle.TriggerEvent') or error('')
---@type UnitClass
local Unit = require('Handle.Unit') or error('')

--=======
-- Class
--=======

local Ability = Class.new('Ability', Handle)
---@class Ability : Handle
local public = Ability.public
---@class AbilityClass : HandleClass
local static = Ability.static
---@type AbilityClass
local override = Ability.override
local private = {}

--=========
-- Static
--=========

---@param owner Unit
---@param abil_id number
---@param child Ability | nil
---@return Ability
function override.new(owner, abil_id, child)
    isTypeErr(owner, Unit, 'owner')
    isTypeErr(abil_id, 'number', 'abil_id')
    if child then isTypeErr(child, Ability, 'child') end

    local handle = BlzGetUnitAbility(owner:getData(), abil_id)
    if handle ~= nil then
        Log:err('Can not add second ability with the same ID to Unit.', 2)
    end

    local instance = child or Class.allocate(Ability)
    UnitAddAbility(owner:getData(), abil_id)
    handle = BlzGetUnitAbility(owner:getData(), abil_id)
    if handle == nil then
        Log:err('Can not create handle for Ability.', 2)
    end

    instance = Handle.new(handle, private.destroyHandle, instance)

    private.newData(instance, owner, abil_id)

    return instance
end

--========
-- Public
--========

---@return Unit
function public:getOwner()
    isTypeErr(self, Ability, 'self')
    return private.data[self].owner
end

---@return number
function public:getId()
    isTypeErr(self, Ability, 'self')
    return private.data[self].abil_id
end

---@param tooltip string
---@param lvl number
function public:setTooltipNormal(tooltip, lvl)
    isTypeErr(self, Ability, 'self')
    isTypeErr(tooltip, 'string', 'tooltip')
    isTypeErr(lvl, 'number', 'lvl')
    BlzSetAbilityStringLevelField(self:getData(), ABILITY_SLF_TOOLTIP_NORMAL, lvl - 1, tooltip)
end

---@param tooltip string
---@param lvl number
function public:setTooltipNormalExtended(tooltip, lvl)
    isTypeErr(self, Ability, 'self')
    isTypeErr(tooltip, 'string', 'tooltip')
    isTypeErr(lvl, 'number', 'lvl')
    BlzSetAbilityStringLevelField(self:getData(), ABILITY_SLF_TOOLTIP_NORMAL_EXTENDED, lvl - 1, tooltip)
end

---@param range number
function public:setRange(range)
    isTypeErr(self, Ability, 'self')
    isTypeErr(range, 'number', 'range')
    BlzSetAbilityRealLevelField(self:getData(), ABILITY_RLF_CAST_RANGE, 0, range)
end

---@alias AbilityCallback fun(event:string, abil:Ability)

---@param event string | "'CHANNEL'" | "'CAST'" | "'EFFECT'" | "'FINISH'" | "'ENDCAST'"
---@param callback AbilityCallback
---@return Action
function public:addAction(event, callback)
    isTypeErr(self, Ability, 'self')
    isTypeErr(event, 'string', 'event')
    isTypeErr(callback, 'function', 'callback')
    return private.data[self].actions[event]:add(callback)
end

---@param action Action
---@return boolean
function public:removeAction(action)
    isTypeErr(self, Ability, 'self')
    isTypeErr(action, Action, 'action')
    local priv = private.data[self]

    for event, actions in pairs(priv.actions) do
        if actions:remove(action) then
            return true
        end
    end
    return false
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

---@param self Ability
---@param owner Unit
---@param abil_id number
function private.newData(self, owner, abil_id)
    local priv = {
        owner = owner,
        abil_id = abil_id,

        actions = {}
    }
    private.data[self] = priv

    for i = 1, #private.event2str do
        priv.actions[private.event2str[i]] = ActionList.new()
    end
end

---@param handle ability
function private.destroyHandle(handle)
    local abil = static.getLinked(handle)
    if not abil then return end

    local owner = abil:getOwner()
    local abil_id = abil:getId()
    UnitRemoveAbility(owner:getData(), abil_id)
end

---@param playerunitevent playerunitevent
function private.onEvent(playerunitevent)
    ---@type Ability
    local self = static.getLinked(GetSpellAbility())
    local s_event = private.event2str[playerunitevent]
    local actions = private.data[self].actions[s_event]

    actions:run(self, s_event)
end

if IsGame() then
    private.event2str = {
        [EVENT_PLAYER_UNIT_SPELL_CHANNEL] = 'CHANNEL',
        [EVENT_PLAYER_UNIT_SPELL_CAST] = 'CAST',
        [EVENT_PLAYER_UNIT_SPELL_EFFECT] = 'EFFECT',
        [EVENT_PLAYER_UNIT_SPELL_FINISH] = 'FINISH',
        [EVENT_PLAYER_UNIT_SPELL_ENDCAST] = 'ENDCAST',
    }

    private.ability_events = {}
    for abilityevent, str in pairs(private.event2str) do
        table.insert(private.ability_events, abilityevent)
    end

    private.triggers = {}
    for i = 1, #private.ability_events do
        local trigger = Trigger.new()
        trigger:add(function() private.onEvent(private.ability_events[i]) end)

        for j = 0, bj_MAX_PLAYER_SLOTS - 1 do
            local pl = Player(j)
            local event = TriggerEvent.newPlayerUnitEvent(pl, EVENT_PLAYER_UNIT_SPELL_CHANNEL)
            event:addTrigger(trigger)
        end
        private.triggers[private.ability_events[i]] = trigger
    end
end

return static