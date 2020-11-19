--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local isTypeErr = Wc3Utils.isTypeErr

---@type TimerClass
local Timer = require('Handle.Timer') or error('')

--=======
-- Class
--=======

local TriggerEvent = Class.new('TriggerEvent')
---@class TriggerEvent
local public = TriggerEvent.public
---@class TriggerEventClass
local static = TriggerEvent.static
---@type TriggerEventClass
local override = TriggerEvent.override
local private = {}

--========
-- Static
--========

---@param func function
---@varargs any
---@return TriggerEvent
function static.new(func, ...)
    isTypeErr(func, 'function', 'func')
    local instance = Class.allocate(TriggerEvent)
    private.newData(instance, func, ...)
    return instance
end

---@param var_name string
---@param opcode limitop
---@param limitval number
function static.newVariableEvent(var_name, opcode, limitval)
    isTypeErr(var_name, 'string', 'var_name')
    isTypeErr(opcode, 'limitop', 'opcode')
    isTypeErr(limitval, 'number', 'limitval')
    return static.new(TriggerRegisterVariableEvent, var_name, opcode, limitval)
end

---@param timeout number
---@param periodic boolean
function static.newTimerEvent(timeout, periodic)
    isTypeErr(timeout, 'number', 'timeout')
    isTypeErr(periodic, 'number', 'periodic')
    return static.new(TriggerRegisterTimerEvent, timeout, periodic)
end

---@param timer Timer
function static.newTimerExpireEvent(timer)
    isTypeErr(timer, Timer, 'timer')
    return static.new(TriggerRegisterTimerExpireEvent, timer:getData())
end

---@param gamestate gamestate
---@param opcode limitop
---@param limitval number
function static.newGameStateEvent(gamestate, opcode, limitval)
    isTypeErr(gamestate, 'gamestate', 'gamestate')
    isTypeErr(opcode, 'limitop', 'opcode')
    isTypeErr(limitval, 'number', 'limitval')
    return static.new(TriggerRegisterGameStateEvent, gamestate, opcode, limitval)
end

---@param dialog dialog
function static.newDialogEvent(dialog)
    isTypeErr(dialog, 'dialog', 'dialog')
    return static.new(TriggerRegisterDialogEvent, dialog)
end

---@param button button
function static.newDialogButtonEvent(button)
    isTypeErr(button, button, 'button')
    return static.new(TriggerRegisterDialogButtonEvent, button)
end

---@param gameevent gameevent
function static.newGameEvent(gameevent)
    isTypeErr(gameevent, 'gameevent', 'gameevent')
    return static.new(TriggerRegisterGameEvent, gameevent)
end

---@param region region
function static.newEnterRegion(region)
    isTypeErr(region, 'region', 'region')
    return static.new(TriggerRegisterEnterRegion, region)
end

---@param region region
function static.newLeaveRegion(region)
    isTypeErr(region, 'region', 'region')
    return static.new(TriggerRegisterLeaveRegion, region)
end

---@param trackable trackable
function static.newTrackableHitEvent(trackable)
    isTypeErr(trackable, 'trackable', 'trackable')
    return static.new(TriggerRegisterTrackableHitEvent, trackable)
end

---@param trackable trackable
function static.newTrackableTrackEvent(trackable)
    isTypeErr(trackable, 'trackable', 'trackable')
    return static.new(TriggerRegisterTrackableTrackEvent, trackable)
end

---@param player player
---@param playerevent playerevent
function static.newPlayerEvent(player, playerevent)
    isTypeErr(playerevent, 'playerevent', 'playerevent')
    isTypeErr(player, 'player', 'player')
    return static.new(TriggerRegisterPlayerEvent, player, playerevent)
end

---@param player player
---@param playerunitevent playerunitevent
function static.newPlayerUnitEvent(player, playerunitevent)
    isTypeErr(playerunitevent, 'playerunitevent', 'playerunitevent')
    isTypeErr(player, 'player', 'player')
    return static.new(TriggerRegisterPlayerUnitEvent, player, playerunitevent, nil)
end

---@param player player
---@param alliancetype alliancetype
function static.newPlayerAllianceChange(player, alliancetype)
    isTypeErr(player, 'player', 'player')
    isTypeErr(alliancetype, 'alliancetype', 'alliancetype')
    return static.new(TriggerRegisterPlayerAllianceChange, player, alliancetype)
end

---@param player player
---@param playerstate playerstate
---@param opcode limitop
---@param limitval number
function static.newPlayerStateEvent(player, playerstate, opcode, limitval)
    isTypeErr(player, 'player', 'player')
    isTypeErr(playerstate, 'playerstate', 'playerstate')
    isTypeErr(limitval, 'number', 'limitval')
    return static.new(TriggerRegisterPlayerStateEvent, player, playerstate, opcode, limitval)
end

---@param player player
---@param message string
---@param exact_match boolean
function static.newPlayerChatEvent(player, message, exact_match)
    isTypeErr(player, 'player', 'player')
    isTypeErr(message, 'string', 'message')
    isTypeErr(exact_match, 'boolean', 'exact_match')
    return static.new(TriggerRegisterPlayerChatEvent, player, message, exact_match)
end

---@param widget widget
function static.newDeathEvent(widget)
    isTypeErr(widget, 'widget', 'widget')
    return static.new(TriggerRegisterDeathEvent, widget)
end

---@param unit unit
---@param unitstate unitstate
---@param opcode limitop
---@param limitval number
function static.newUnitStateEvent(unit, unitstate, opcode, limitval)
    isTypeErr(unit, 'unit', 'unit')
    isTypeErr(unitstate, 'unitstate', 'unitstate')
    isTypeErr(opcode, 'limitop', 'opcode')
    isTypeErr(limitval, 'number', 'limitval')
    return static.new(TriggerRegisterUnitStateEvent, unit, unitstate, opcode, limitval)
end

---@param unit unit
---@param unitevent unitevent
function static.newUnitEvent(unit, unitevent)
    isTypeErr(unit, 'unit', 'unit')
    isTypeErr(unitevent, 'unitevent', 'unitevent')
    return static.new(TriggerRegisterUnitEvent, unitevent, unit)
end

---@param unit unit
---@param range number
function static.newUnitInRange(unit, range)
    isTypeErr(unit, 'unit', 'unit')
    isTypeErr(range, 'number', 'range')
    return static.new(TriggerRegisterUnitInRange, unit, range)
end

---@param frame framehandle
---@param frameeventtype frameeventtype
function static.newFrameEvent(frame, frameeventtype)
    isTypeErr(frame, 'framehandle', 'frame')
    isTypeErr(frameeventtype, 'frameeventtype', 'frameeventtype')
    return static.new(BlzTriggerRegisterFrameEvent, frame, frameeventtype)
end

---@param player player
---@param prefix string
---@param from_server boolean
function static.newPlayerSyncEvent(player, prefix, from_server)
    isTypeErr(player, 'player', 'player')
    isTypeErr(prefix, 'string', 'prefix')
    isTypeErr(from_server, 'boolean', 'from_server')
    return static.new(BlzTriggerRegisterPlayerSyncEvent, player, prefix, from_server)
end

---@param player player
---@param key oskeytype
---@param meta_key integer
---@param key_down boolean
function static.newPlayerKeyEvent(player, key, meta_key, key_down)
    isTypeErr(player, 'player', 'player')
    isTypeErr(key, 'oskeytype', 'key')
    isTypeErr(meta_key, 'integer', 'meta_key')
    isTypeErr(key_down, 'boolean', 'key_down')
    return static.new(BlzTriggerRegisterPlayerKeyEvent, player, key, meta_key, key_down)
end

--========
-- Public
--========

---@param trigger Trigger
function public:addTrigger(trigger)
    isTypeErr(self, TriggerEvent, 'self')
    local priv = private.data[self]
    priv.func(trigger:getData(), table.unpack(priv.args))
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

---@param self TriggerEvent
function private.newData(self, func, ...)
    local priv = {
        func = func,
        args = table.pack(...)
    }
    private.data[self] = priv
end

return static