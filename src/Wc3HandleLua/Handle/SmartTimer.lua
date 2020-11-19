--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local Action = Wc3Utils.Action or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')
local Log = Wc3Utils.Log or error('')

---@type HandleClass
local Handle = require('Handle') or error('')

--=======
-- Class
--=======

local SmartTimer = Class.new('SmartTimer', Handle)
---@class SmartTimer : Handle
local public = SmartTimer.public
---@class SmartTimerClass : HandleClass
local static = SmartTimer.static
---@type SmartTimerClass
local override = SmartTimer.override
local private = {}

--========
-- Static
--========

---@param precision number
---@param child SmartTimer | nil
---@return SmartTimer
function override.new(precision, child)
    isTypeErr(precision, 'number', 'precision')
    if child then isTypeErr(child, SmartTimer, 'child') end

    if precision < private.minimum_period then
        Log:wrn(SmartTimer..string.format(' got too high precision. Changed %.4f -> %.4f', precision, private.minimum_period))
        precision = private.minimum_period
    end

    local instance = child or Class.allocate(SmartTimer)
    instance = Handle.new(CreateTimer(), private.destroyRawTimer, instance)
    private.newData(instance, precision)

    return instance
end

--========
-- Public
--========

---@return number
function public:getCurrentTime()
    isTypeErr(self, SmartTimer, 'self')
    return private.data[self].cur_time
end

---@return number
function public:getPeriod()
    isTypeErr(self, SmartTimer, 'self')
    return private.data[self].precision
end

---@param delay number
---@param callback Callback
---@return Action
function public:addAction(delay, callback)
    isTypeErr(self, SmartTimer, 'self')
    isTypeErr(delay, 'number', 'delay')
    isTypeErr(callback, 'function', 'callback')
    local priv = private.data[self]

    delay = math.max(delay, priv.precision)
    local data = {
        time = priv.cur_time + delay,
        action = Action.new(callback, self)
    }
    local pos = private.findPos(priv.actions_list, data.time, 1, #priv.actions_list)
    table.insert(priv.actions_list, pos, data)

    return data.action
end

---@param action Action
---@return boolean
function public:removeAction(action)
    isTypeErr(self, SmartTimer, 'self')
    isTypeErr(action, Action, 'action')
    local priv = private.data[self]

    for i = 1, #priv.actions_list do
        if priv.actions_list[i].action == action then
            table.remove(priv.actions_list, i)
            return true
        end
    end
    return false
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

private.minimum_period = 0.03125 -- 1/32 sec

---@param self SmartTimer
---@param precision number
function private.newData(self, precision)
    local priv = {
        cur_time = 0,
        precision = precision,

        actions_list = {}
    }
    private.data[self] = priv

    TimerStart(self:getData(), precision, true, function() private.runActions(priv) end)
end

function private.runActions(priv)
    priv.cur_time = priv.cur_time + priv.precision

    local cur_time = priv.cur_time
    while #priv.actions_list > 0 do
        local cur_data = priv.actions_list[1]

        if cur_data.time <= cur_time then
            cur_data.action:run()
            table.remove(priv.actions_list, 1)
        else
            break
        end
    end
end

---@param actions_list table
---@param time number
---@param first integer
---@param len integer
---@return number
function private.findPos(actions_list, time, first, len)
    if len == 0 then return first end

    local half_len, d = math.modf(len / 2)
    local pos = first + half_len
    if actions_list[pos].time > time then
        return private.findPos(actions_list, time, first, half_len)
    else
        return private.findPos(actions_list, time, first + half_len + 2 * d, half_len)
    end
end

function private.destroyTimerHandle(handle)
    PauseTimer(handle)
    DestroyTimer(handle)
end

return static