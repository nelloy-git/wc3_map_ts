--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Handle
local Wc3Handle = LibManager.getDepency('Wc3Handle') or error('')
local TimedObj = Wc3Handle.TimedObj
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local Action = Wc3Utils.Action or error('')
local ActionList = Wc3Utils.ActionList or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')

--=======
-- Class
--=======

local AbilityExtCharges = Class.new('AbilityExtCharges')
---@class AbilityExtCharges
local public = AbilityExtCharges.public
---@class AbilityExtChargesClass
local static = AbilityExtCharges.static
---@type AbilityExtChargesClass
local override = AbilityExtCharges.override
local private = {}

--========
-- Static
--========

---@param child AbilityExtCharges | nil
---@return AbilityExtCharges
function override.new(child)
    isTypeErr(child, {AbilityExtCharges, 'nil'}, 'child')

    local instance = child or Class.allocate(AbilityExtCharges)
    private.newData(instance)

    return instance
end

override.getPeriod = TimedObj.getPeriod

--========
-- Public
--========

--- Set current charges.
---@param charges number
---@param ignore_max boolean | nil
function public:set(charges, ignore_max)
    isTypeErr(self, AbilityExtCharges, 'self')
    isTypeErr(charges, 'number', 'charges')
    isTypeErr(ignore_max, {'number', 'nil'}, 'ignore_max')
    local priv = private.data[self]

    local prev_charges = priv.charges

    if charges > priv.max_charges then
        priv.charges = ignore_max and charges or priv.max_charges
    elseif charges <= 0 then
        priv.charges = 0
    else
        priv.charges = charges
    end

    if charges < priv.max_charges then
        if priv.timer:getTimeLeft() <= 0 then
            priv.timer:start(priv.cooldown)
        end
    else
        priv.timer:cancel()
    end

    if priv.charges ~= prev_charges then
        priv.charges_changed_actions:run(self)
    end
end

--- Get current charges
---@return number
function public:get()
    isTypeErr(self, AbilityExtCharges, 'self')
    return private.data[self].charges
end

--- Set maximum charges
---@param max number
function public:setMax(max)
    isTypeErr(self, AbilityExtCharges, 'self')
    isTypeErr(max, 'number', 'max')
    private.data[self].max_charges = max
    self:set(self:get())
end

--- Get maxinun charges
---@return number
function public:getMax()
    isTypeErr(self, AbilityExtCharges, 'self')
    return private.data[self].max_charges
end

--- Pause charges cooldown
---@param flag boolean
function public:pause(flag)
    isTypeErr(self, AbilityExtCharges, 'self')
    isTypeErr(flag, 'boolean', 'flag')
    private.data[self].timer:pause(flag)
end

--- Set time left for getting charge.
---@param time number
function public:setTimeLeft(time)
    isTypeErr(self, AbilityExtCharges, 'self')
    isTypeErr(time, 'number', 'time')
    private.data[self].timer:setTimeLeft(time)
end

--- Get time left for getting charge.
---@return number
function public:getTimeLeft()
    isTypeErr(self, AbilityExtCharges, 'self')
    return private.data[self].timer:getTimeLeft()
end

--- Set full time for getting charge.
---@param time number
function public:setCooldown(time)
    isTypeErr(self, AbilityExtCharges, 'self')
    isTypeErr(time, 'number', 'time')
    local priv = private.data[self]

    if priv.timer:getTimeLeft() > 0 then
        priv.timer:setTimeLeft(priv.timer:getTimeLeft() + time - priv.cooldown)
    end
    priv.cooldown = time
end

--- Get full time for getting charge.
---@return number
function public:getCooldown()
    isTypeErr(self, AbilityExtCharges, 'self')
    return private.data[self].cooldown
end

---@alias AbilityExtChargesCallback fun(charges:AbilityExtCharges)

---@param callback AbilityExtChargesCallback
---@return Action
function public:addCooldownAction(callback)
    isTypeErr(self, AbilityExtCharges, 'self')
    isTypeErr(callback, 'function', 'callback')
    return private.data[self].cooldown_actions:add(callback)
end

---@param callback AbilityExtChargesCallback
---@return Action
function public:addChargesChangedAction(callback)
    isTypeErr(self, AbilityExtCharges, 'self')
    isTypeErr(callback, 'function', 'callback')
    return private.data[self].charges_changed_actions:add(callback)
end

---@param action Action
---@return boolean
function public:removeAction(action)
    isTypeErr(self, AbilityExtCharges, 'self')
    isTypeErr(action, Action, 'action')
    if private.data[self].cooldown_actions:remove(action) then
        return true
    end
    return private.data[self].charges_changed_actions:remove(action)
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})
private.timer2charges = setmetatable({}, {__mode = 'kv'})

---@param self AbilityExtCharges
function private.newData(self)
    local priv = {
        charges = 1,
        max_charges = 1,
        cooldown = 0,

        cooldown_actions = ActionList.new(),
        charges_changed_actions = ActionList.new(),

        timer = TimedObj.new(),
    }
    private.data[self] = priv
    private.timer2charges[priv.timer] = self

    priv.timer:addLoopAction(private.timerLoopCallback)
    priv.timer:addFinishAction(private.timerFinishCallback)
end

---@param timer TimedObj
function private.timerLoopCallback(timer)
    local self = private.timer2charges[timer]
    private.data[self].cooldown_actions:run(self)
end

---@param timer TimedObj
function private.timerFinishCallback(timer)
    local self = private.timer2charges[timer]
    self:set(self:get() + 1)
end

return static