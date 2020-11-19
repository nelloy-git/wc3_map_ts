--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local Action = Wc3Utils.Action or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')

---@type HandleClass
local Handle = require('Handle') or error('')

--=======
-- Class
--=======

local Timer = Class.new('Timer', Handle)
---@class Timer : Handle
local public = Timer.public
---@class TimerClass : HandleClass
local static = Timer.static
---@type TimerClass
local override = Timer.override
local private = {}

--=========
-- Static
--=========

---@param child Timer | nil
---@return Timer
function override.new(child)
    if child then isTypeErr(child, Timer, 'child') end

    local instance = child or Class.allocate(Timer)
    instance = Handle.new(CreateTimer(), private.destroyTimerHandle, instance)

    return instance
end

--========
-- Public
--========

---@param timeout number
---@param periodic boolean
---@param callback Callback
function public:start(timeout, periodic, callback)
    isTypeErr(self, Timer, 'self')
    isTypeErr(timeout, 'number', 'timeout')
    isTypeErr(periodic, 'boolean', 'periodic')
    isTypeErr(callback, 'function', 'callback')

    local action = Action.new(callback, self)
    TimerStart(self:getData(), timeout, periodic, function() action:run() end)
end

function public:pause()
    isTypeErr(self, Timer, 'self')
    PauseTimer(self:getData())
end

function public:resume()
    isTypeErr(self, Timer, 'self')
    ResumeTimer(self:getData())
end

--=========
-- Private
--=========

function private.destroyTimerHandle(handle)
    PauseTimer(handle)
    DestroyTimer(handle)
end

return static