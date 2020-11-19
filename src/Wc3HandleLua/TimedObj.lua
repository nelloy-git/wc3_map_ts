--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local Action = Wc3Utils.Action or error('')
local ActionList = Wc3Utils.ActionList or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')

---@type HandleSettings
local Settings = require('Settings') or error('')
---@type TimerClass
local Timer = require('Handle.Timer') or error('')

--=======
-- Class
--=======

local TimedObj = Class.new('TimedObj')
---@class TimedObj
local public = TimedObj.public
---@class TimedObjClass
local static = TimedObj.static
---@type TimedObjClass
local override = TimedObj.override
local private = {}

--=========
-- Static
--=========

---@param child TimedObj
---@return TimedObj
function override.new(child)
    if child then isTypeErr(child, TimedObj, 'child') end
    local instance = child or Class.allocate(TimedObj)
    private.newData(instance)

    return instance
end

---@return number
function override.getPeriod()
    return private.period
end

--========
-- Public
--========

---@param time number
function public:start(time)
    isTypeErr(self, TimedObj, 'self')
    isTypeErr(time, 'number', 'time')
    local priv = private.data[self]

    priv.start_time = private.cur_time
    priv.finish_time = private.cur_time + time
    private.active_list[self] = priv

    priv.actions_start:run(self)
end

---@param flag boolean
function public:pause(flag)
    isTypeErr(self, TimedObj, 'self')
    isTypeErr(flag, 'boolean', 'flag')
    private.data[self].pause = flag
end

function public:loop()
    isTypeErr(self, TimedObj, 'self')
    private.data[self].actions_loop:run(self)
end

function public:cancel()
    isTypeErr(self, TimedObj, 'self')
    local priv = private.data[self]

    priv.start_time = -1
    priv.finish_time = -1
    private.active_list[self] = nil

    priv.actions_cancel:run(self)
end

function public:finish()
    isTypeErr(self, TimedObj, 'self')
    local priv = private.data[self]

    priv.start_time = -1
    priv.finish_time = -1
    private.active_list[self] = nil

    priv.actions_finish:run(self)
end

---@param time_left number
function public:setTimeLeft(time_left)
    isTypeErr(self, TimedObj, 'self')
    isTypeErr(time_left, 'number', 'time_left')
    private.data[self].finish_time = private.cur_time + time_left
end

---@return number
function public:getTimeLeft()
    isTypeErr(self, TimedObj, 'self')
    local left = private.data[self].finish_time - private.cur_time
    return left >= 0 and left or 0
end

---@return number
function public:getFullTime()
    isTypeErr(self, TimedObj, 'self')
    local priv = private.data[self]
    return priv.finish_time - priv.start_time
end

---@alias TimedObjCallback fun(timer:TimedObj)

---@param callback TimedObjCallback
---@return boolean
function public:addStartAction(callback)
    isTypeErr(self, TimedObj, 'self')
    isTypeErr(callback, 'function', 'callback')
    return private.data[self].actions_start:add(callback)
end

---@param callback TimedObjCallback
---@return boolean
function public:addLoopAction(callback)
    isTypeErr(self, TimedObj, 'self')
    isTypeErr(callback, 'function', 'callback')
    return private.data[self].actions_loop:add(callback)
end

---@param callback TimedObjCallback
---@return boolean
function public:addCancelAction(callback)
    isTypeErr(self, TimedObj, 'self')
    isTypeErr(callback, 'function', 'callback')
    return private.data[self].actions_cancel:add(callback)
end

---@param callback TimedObjCallback
---@return boolean
function public:addFinishAction(callback)
    isTypeErr(self, TimedObj, 'self')
    isTypeErr(callback, 'function', 'callback')
    return private.data[self].actions_finish:add(callback)
end

---@param action Action
---@return boolean
function public:removeAction(action)
    isTypeErr(self, TimedObj, 'self')
    isTypeErr(action, Action, 'action')
    local priv = private.data[self]

    local found = false
    found = priv.actions_start:remove(action)
    found = priv.actions_loop:remove(action)
    found = priv.actions_cancel:remove(action)
    found = priv.actions_finish:remove(action)
    return found
end

function public:destroy()
    isTypeErr(self, TimedObj, 'self')
    private.data[self] = nil
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})
private.active_list = setmetatable({}, {__mode = 'k'})

---@param self TimedObj
function private.newData(self)
    local priv = {
        start_time = -1,
        finish_time = -1,

        actions_start = ActionList.new(self),
        actions_loop = ActionList.new(self),
        actions_cancel = ActionList.new(self),
        actions_finish = ActionList.new(self),
    }
    private.data[self] = priv
end

private.cur_time = 0
private.period = Settings.TimedObjPeriod or error('')
function private.timerLoop()
    private.cur_time = private.cur_time + private.period

    local cur_time = private.cur_time

    local active = {}
    for k,v in pairs(private.active_list) do
        active[k] = v
    end

    for self, priv in pairs(active) do
        if priv.pause then
            priv.finish_time = priv.finish_time + private.period
        end

        if priv.finish_time <= cur_time then
            self:finish()
        else
            self:loop()
        end
    end
end

if IsGame() then
    private.timer = Timer.new()
    private.timer:start(private.period, true, private.timerLoop)
end

return static