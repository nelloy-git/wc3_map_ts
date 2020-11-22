--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Handle
local Wc3Handle = LibManager.getDepency('Wc3Handle') or error('')
local TimedObj = Wc3Handle.TimedObj or error('')
local Unit = Wc3Handle.Unit or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local Action = Wc3Utils.Action or error('')
local ActionList = Wc3Utils.ActionList or error('')
local isType = Wc3Utils.isType or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')

---@type AbilityExtChargesClass
local AbilityExtCharges = require('Charges') or error('')
-- --@type AbilityExtEventModule
-- local AbilityExtEventModule = require('Event') or error('')
-- local TargetingEvent = AbilityExtEventModule.TargetingEnum
-- local CastingEvent = AbilityExtEventModule.CastingEnum
---@type AbilityExtTargetSyncClass
local AbilityExtSyncTarget = require('TargetSync') or error('')
---@type AbilityExtTypeClass
local AbilityExtType -- static.init

--=======
-- Class
--=======

local AbilityExt = Class.new('AbilityExt')
---@class AbilityExt
local public = AbilityExt.public
---@class AbilityExtClass
local static = AbilityExt.static
---@type AbilityExtClass
local override = AbilityExt.override
local private = {}

--=========
-- Static
--=========

function static.init()
    AbilityExtType = require('Type') or error('')
end

---@param owner Unit
---@param abil_type AbilityExtType
---@param child AbilityExt | nil
---@return AbilityExt
function override.new(owner, abil_type, child)
    isTypeErr(owner, Unit, 'owner')
    isTypeErr(abil_type, AbilityExtType, 'abil_type')
    isTypeErr(child, {AbilityExt, 'nil'}, 'child')

    local instance = child or Class.allocate(AbilityExt)
    private.newData(instance, owner, abil_type)

    return instance
end

override.getCastingPeriod = TimedObj.getPeriod
override.getCooldownPeriod = AbilityExtCharges.getPeriod

--========
-- Public
--========

---@return Unit
function public:getOwner()
    isTypeErr(self, AbilityExt, 'self')
    return private.data[self].owner
end

---@return AbilityExtType
function public:getType()
    isTypeErr(self, AbilityExt, 'self')
    return private.data[self].abil_type
end

---@return any
function public:getTarget()
    isTypeErr(self, AbilityExt, 'self')
    return private.data[self].target
end

---@return TimedObj
function public:getCastingTimer()
    isTypeErr(self, AbilityExt, 'self')
    return private.data[self].casting_timer
end

---@return AbilityExtCharges
function public:getCharges()
    isTypeErr(self, AbilityExt, 'self')
    return private.data[self].charges
end

-------------
-- Targeting
-------------

function public:targetingStart()
    isTypeErr(self, AbilityExt, 'self')
    local priv = private.data[self]

    ---@type AbilityExtType
    local abil_type = priv.abil_type
    local data_type = abil_type:getData()

    if data_type:isAvailable(self) then
        local targ_type = abil_type:getTargeting()
        targ_type:start(self, private.targetingFinishCallback)

        priv.targ_actions.START:run(self, 'START')
    end
end

function public:targetingCancel()
    isTypeErr(self, AbilityExt, 'self')
    local priv = private.data[self]

    ---@type AbilityExtType
    local abil_type = priv.abil_type
    local targ_type = abil_type:getTargeting()

    if targ_type:cancel() then
        priv.targ_actions.CANCEL:run(self, 'CANCEL')
    end
end

function public:targetingFinish()
    isTypeErr(self, AbilityExt, 'self')
    local priv = private.data[self]

    ---@type AbilityExtType
    local abil_type = priv.abil_type
    local targ_type = abil_type:getTargeting()

    if targ_type:finish(self) then
        priv.targ_actions.FINISH:run(self, 'FINISH')
    end
end

-----------
-- Casting
-----------

---@param target any
---@return boolean
function public:castingStart(target)
    isTypeErr(self, AbilityExt, 'self')
    local priv = private.data[self]

    ---@type AbilityExtType
    local abil_type = priv.abil_type
    local data_type = abil_type:getData()

    if not (data_type:isAvailable(self) and
            data_type:checkTarget(self, target)) then
        return false
    end

    -- Update cooldown
    priv.charges:setCooldown(data_type:getCooldown(self))
    data_type:consume(self)

    priv.target = target
    priv.casting_timer:start(data_type:getCastingTime())
    priv.cast_actions.START:run(self, 'START')

    return true
end

function public:castingCancel()
    isTypeErr(self, AbilityExt, 'self')
    local priv = private.data[self]

    ---@type AbilityExtType
    local abil_type = priv.abil_type
    local cast_type = abil_type:getCasting()

    priv.casting_timer:cancel()
    cast_type:cancel(self)
    priv.cast_actions.CANCEL:run(self, 'CANCEL')
    priv.target = nil
end

function public:castingInterrupt()
    isTypeErr(self, AbilityExt, 'self')
    local priv = private.data[self]

    ---@type AbilityExtType
    local abil_type = priv.abil_type
    local cast_type = abil_type:getCasting()

    priv.casting_timer:cancel()
    cast_type:interrupt(self)
    priv.cast_actions.INTERRUPT:run(self, 'INTERRUPT')
    priv.target = nil
end

function public:castingFinish()
    isTypeErr(self, AbilityExt, 'self')
    local priv = private.data[self]

    ---@type AbilityExtType
    local abil_type = priv.abil_type
    local cast_type = abil_type:getCasting()

    priv.casting_timer:finish()
    cast_type:finish(self)
    priv.cast_actions.FINISH:run(self, 'FINISH')
    priv.target = nil
end

-----------
-- Actions
-----------

---@alias AbilityExtCallback fun(abil:AbilityExt, event:string)

---@param event string | "'START'" | "'CANCEL'" | "'FINISH'"
---@param callback AbilityExtCallback
---@return Action
function public:addTargetingAction(event, callback)
    isTypeErr(self, AbilityExt, 'self')
    isTypeErr(event, 'string', 'event')
    isTypeErr(callback, 'function', 'callback')
    local priv = private.data[self]

    return priv.targ_actions[event]:add(callback)
end

---@param event string | "'START'" | "'LOOP'" | "'CANCEL'" | "'INTERRUPT'" | "'FINISH'"
---@param callback AbilityExtCallback
---@return Action
function public:addCastingCallback(event, callback)
    isTypeErr(self, AbilityExt, 'self')
    isTypeErr(event, 'string', 'event')
    isTypeErr(callback, 'function', 'callback')
    local priv = private.data[self]

    return priv.cast_actions[event]:add(callback)
end

---@param action Action
---@return boolean
function public:removeAction(action)
    isTypeErr(self, AbilityExt, 'self')
    isTypeErr(action, Action, 'action')
    local priv = private.data[self]

    for _, list in pairs(priv.targ_actions) do
        if list:remove(action) then
            return true
        end
    end

    for _, list in pairs(priv.cast_actions) do
        if list:remove(action) then
            return true
        end
    end

    return false
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

private.id2abil = {}
private.casting_timer2ability = setmetatable({}, {__mode = 'k'})
private.charges2ability = setmetatable({}, {__mode = 'k'})

---@param self AbilityExt
---@param owner Unit
---@param abil_type AbilityExtType
function private.newData(self, owner, abil_type)
    local priv = {
        id = private.newId(),
        owner = owner,
        abil_type = abil_type,

        target = nil,

        casting_timer = TimedObj.new(),
        charges = AbilityExtCharges.new(),

        targ_actions = {
            START = ActionList.new(),
            CANCEL = ActionList.new(),
            FINISH = ActionList.new(),
        },
        cast_actions = {
            START = ActionList.new(),
            LOOP = ActionList.new(),
            CANCEL = ActionList.new(),
            INTERRUPT = ActionList.new(),
            FINISH = ActionList.new(),
        },
    }
    private.data[self] = priv
    private.id2abil[priv.id] = self
    private.casting_timer2ability[priv.casting_timer] = self
    private.charges2ability[priv.charges] = self

    -- Link casting.
    priv.casting_timer:addLoopAction(private.castingLoopCallback)
    priv.casting_timer:addFinishAction(private.castingFinishCallback)
end

local cur_new_id = 0
function private.newId()
    cur_new_id =  cur_new_id + 1
    return cur_new_id
end

---@param self AbilityExt
---@param target any
function private.targetingFinishCallback(self, target)
    local abil_id = private.data[self].id
    if not isType(target, 'table') then
        target = {target}
    end

    private.target_sync:send(abil_id, target)
end

---@param sync AbilityExtTargetSync
---@param abil_id number
---@param targets table<integer, Handle | AbilityExtPoint>
---@param source player
function private.targetSynced(sync, abil_id, targets, source)
    local self = private.id2abil[abil_id]

    if #targets <= 1 then targets = targets[1] end
    self:castingStart(targets)
end

---@param casting_timer TimedObj
function private.castingLoopCallback(casting_timer)
    ---@type AbilityExt
    local self = private.casting_timer2ability[casting_timer]
    local priv = private.data[self]

    ---@type AbilityExtType
    local abil_type = priv.abil_type
    local cast_type = abil_type:getCasting()

    cast_type:loop(self)
    priv.cast_actions.LOOP:run(self, 'LOOP')
end

---@param casting_timer TimedObj
function private.castingFinishCallback(casting_timer)
    ---@type AbilityExt
    local self = private.casting_timer2ability[casting_timer]
    local priv = private.data[self]

    ---@type AbilityExtType
    local abil_type = priv.abil_type
    local cast_type = abil_type:getCasting()

    cast_type:finish(self)
    priv.cast_actions.FINISH:run(self, 'FINISH')
end

if IsGame() then
    private.target_sync = AbilityExtSyncTarget.new()
    private.target_sync:addAction(private.targetSynced)
end

return static